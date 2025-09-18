import React from "react";
import { useState, useEffect } from "react";
import { Settings, Wand2, ChevronDown } from "lucide-react";
import { TopicFinderModal } from "./TopicFinderModal";
import { MdKey } from "react-icons/md";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
export function VideoGenerationForm({
  videoKinds,
  showCostConfig,
  onVideoGenerated,
  onOpenVoiceModal,
  onOpenKindModal,
  setShowCostConfig,
  selectedVoice,
  onOpenImgedModal,
  imageKinds,
  setTokenConfiguration,
  tokenConfiguration,
  setShowSuccessMessage,
  enableRefinement,
  setEnableRefinement
}) {
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [defultValue, setDefultValue] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newVideo, setNewVideo] = useState({
    mode: "niche",
    niche: "",
    topic: "",
    misc_cost: 0,
    kind: "",
    duration: 1,
    visual_style: "",
    voice: null,
  });

  // GET defult value
  const GetDefultValue = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/default_values`);
      console.log(data);
      setDefultValue(data);
    } catch (erro) {
      console.error(erro);
    }
  };

  useEffect(() => {
    setNewVideo((prev) => ({ ...prev, voice: selectedVoice }));
  }, [selectedVoice]);

  // Update form when default values are fetched
  useEffect(() => {
    if (defultValue) {
      setNewVideo((prev) => ({
        ...prev,
        kind: defultValue.video_kind || prev.kind,
        visual_style: defultValue.visual_style || prev.visual_style,
		mode: defultValue.trigger_mode || "niche",
      }));

      if (defultValue.voice_id && !selectedVoice) {
        const defaultVoice = {
          voice_id: defultValue.voice_id,
          name: defultValue.voice_id,
        };
        setNewVideo((prev) => ({ ...prev, voice: defaultVoice }));
      }
	  
	  if (defultValue.enable_refinement) {
		  setEnableRefinement(defultValue.enable_refinement)
	  }
    }
  }, [defultValue, selectedVoice]);

  const selectedVoiceName = () => {
    return selectedVoice?.name || newVideo.voice?.name || "Select Voice";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedKind = videoKinds.find(
        (opt) => opt.videoKind === newVideo.kind
      );
      const countWords = selectedKind ? selectedKind.countWords : false;

      const params = new URLSearchParams({
        mode: newVideo.mode,
        niche: newVideo.mode === "niche" ? newVideo.niche : newVideo.topic,
        video_kind: newVideo.kind,
        duration_in_mins: newVideo.duration.toString(),
        voice_id: selectedVoice?.voice_id || newVideo.voice?.voice_id || "",
        count_words: countWords ? "true" : "false",
        refine_script: enableRefinement ? "true" : "false",
        misc_cost: newVideo.misc_cost || 0,
        visual_style: newVideo.visual_style,
      });

	  setShowSuccessMessage(true);
	  await new Promise(resolve => setTimeout(resolve, 2000));
	  
      void fetch(`${baseUrl}/run_flow?${params.toString()}`, {
        method: "POST",
      });

      // Reset form
      setNewVideo({
        mode: newVideo.mode,
        niche: "",
        topic: "",
        misc_cost: newVideo.misc_cost || 0,
        kind: newVideo.kind || defultValue?.video_kind,
        duration: newVideo.duration || 1,
        voice: selectedVoice || newVideo.voice,
        visual_style: newVideo.visual_style || defultValue?.visual_style,
      });
	  await new Promise(resolve => setTimeout(resolve, 2000));
      onVideoGenerated();
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      setShowSuccessMessage(false);
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    GetDefultValue();
  }, []);

  return (
    <div className="card form-card">
      <div className="card-header">
        <div className="form-header">
          <h4>Generate New Video</h4>
          <select
            className="form-select mode-select"
            value={newVideo.mode}
            onChange={(e) => {
              setNewVideo({ ...newVideo, mode: e.target.value });
            }}
          >
            <option value="niche">Trigger by Niche</option>
            <option value="topic">Trigger by Topic</option>
          </select>
        </div>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="video-form">
          <div className="form-grid">
            {newVideo.mode === "niche" ? (
              <div className="form-group">
                <label htmlFor="niche">Niche</label>
                <input
                  id="niche"
                  type="text"
                  className="form-input"
                  value={newVideo.niche}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, niche: e.target.value })
                  }
                  required
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <div className="input-group">
                  <input
                    id="topic"
                    type="text"
                    className="form-input w-full"
                    value={newVideo.topic}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, topic: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline input-addon"
                    onClick={() => setShowTopicModal(true)}
                    title="Use AI for topic suggestions"
                  >
                    <Wand2 className="icon" />
                  </button>
                </div>
              </div>
            )}
            {/*Video Kind*/}
            <div className="form-group">
              <div className="label-with-action">
                <label>Video Kind</label>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={onOpenKindModal}
                >
                  <Settings className="icon" />
                </button>
              </div>
              <select
                className="form-select"
                value={newVideo.kind}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, kind: e.target.value })
                }
              >
                {videoKinds.map((kind) => (
                  <option key={kind.videoKind} value={kind.videoKind}>
                    {kind.videoKind}
                  </option>
                ))}
              </select>
            </div>
            {/*Duration*/}
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                id="duration"
                type="number"
                min="0.1"
				step="0.1"
                className="form-input"
                value={newVideo.duration}
                onChange={(e) =>
                  setNewVideo({
                    ...newVideo,
                    duration: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            {/*Voice*/}
            <div className="form-group">
              <label>Voice</label>
              <button
                type="button"
                className="btn btn-outline voice-select"
                onClick={onOpenVoiceModal}
              >
                {selectedVoiceName()}
                <ChevronDown className="icon" />
              </button>
            </div>
            {/*Image*/}
            <div className="form-group">
              <div className="label-with-action mb-[5px]">
                <label>Visual Style</label>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={onOpenImgedModal}
                >
                  <Settings className="icon" />
                </button>
              </div>
              <select
                className="form-select"
                value={newVideo.visual_style}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, visual_style: e.target.value })
                }
              >
                {imageKinds.map((kind, index) => (
                  <option key={index} value={kind.name}>
                    {kind.name}
                  </option>
                ))}
              </select>
            </div>
            {/*Miscellaneous Cost*/}
            <div className="form-group ">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miscellaneous Cost ($)
              </label>
              <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
                <span className="flex items-center justify-center bg-gray-100 text-gray-500  text-sm w-[30px]">
                  $
                </span>
                <input
                  type="number"
                  value={newVideo.misc_cost}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, misc_cost: e.target.value })
                  }
                  className="flex-1 pl-2 pr-4 py-2 focus:outline-none"
                  placeholder="0.00"
                  step="0.0000001"
                />
              </div>
            </div>
          </div>
          {/*Show Token Configuration*/}
          <div className="form-actions">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTokenConfiguration(!tokenConfiguration);
                }}
                className="btn btn-outline btn-sm"
                type="button"
              >
                <MdKey />
                {tokenConfiguration
                  ? "Hide Token Configuration"
                  : "Show Token Configuration"}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setShowCostConfig(!showCostConfig);
                }}
              >
                <Settings className="icon" />
                {showCostConfig ? "Hide Cost Config" : "Cost Configuration"}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate Video"}
            </button>
          </div>
        </form>
        {/*showCostConfig*/}
      </div>
      <TopicFinderModal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        setNewVideo={setNewVideo}
      />
    </div>
  );
}
