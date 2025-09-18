import React, { useState, useEffect } from "react";
import { VideoGenerationForm } from "../components/VideoGenerationForm";
import { VideosTable } from "../components/VideosTable";
import { VoiceModal } from "../components/VoiceModal";
import { VideoKindModal } from "../components/VideoKindModal";
import { RefreshCw } from "lucide-react";
import axios from "axios";
import { ImageKindModal } from "../components/ImageKindModal";
import { CostConfigSection } from "../components/CostConfigSection";
import TokenConfiguration from "../components/TokenConfiguration";
const baseUrl = import.meta.env.VITE_BASE_URL;
function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [voices, setVoices] = useState([]);
  const [videoKinds, setVideoKinds] = useState([]);
  const [imageKinds, setImageKinds] = useState([]);
  const [showImageKindModal, setShowImageKindModal] = useState(false);
  
  const [enableRefinement, setEnableRefinement] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [videosLoading, setVideosLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Modal states
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showKindModal, setShowKindModal] = useState(false);
  // cost config model
  const [showCostConfig, setShowCostConfig] = useState(false);
  // State for Token Configuration
  const [tokenConfiguration, setTokenConfiguration] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      await Promise.all([fetchVideos(), fetchVoices(), fetchVideoKinds()]);
    } catch (error) {
      console.error("Initialization error:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      setVideosLoading(true);
      const { data } = await axios.get(`${baseUrl}/runs_to_display`);
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setVideosLoading(false);
    }
  };

  const fetchVoices = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/get-voices`);
      setVoices(data.voices || []);
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  };

  const fetchVideoKinds = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/get_video_kinds`);
      setVideoKinds(
        data?.map((kind) => ({
          videoKind: kind.name,
          genPrompt: kind.genPrompt,
          refinePrompt: kind.refinePrompt,
          countWords: kind.countWords || false,
        }))
      );
    } catch (error) {
      console.error("Error fetching video kinds:", error);
      setVideoKinds([
        {
          videoKind: "Educational",
          genPrompt: "",
          refinePrompt: "",
          countWords: false,
        },
        {
          videoKind: "Entertaining",
          genPrompt: "",
          refinePrompt: "",
          countWords: false,
        },
      ]);
    }
  };

  // const handleVideoGenerated = async () => {
  //   setShowSuccessMessage(true);
  //   await fetchVideos();
  //   setTimeout(() => setShowSuccessMessage(false), 2000);
  // };

  // GET IMG KIND
  const GetImgKind = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/get_visual_styles`);
      console.log(data);
      setImageKinds(data);
    } catch (erro) {
      console.error(erro);
    }
  };

  useEffect(() => {
    GetImgKind();
  }, []);
  return (
    <div className="app">
      <div className="px-10">
        {showSuccessMessage && (
          <div className="alert alert-success">
            Flow triggered successfully! Please check back in 5-10 minutes to
            see the results.
          </div>
        )}

        <VideoGenerationForm
          videoKinds={videoKinds}
          voices={voices}
          onVideoGenerated={fetchVideos}
          onOpenVoiceModal={() => setShowVoiceModal(true)}
          onOpenKindModal={() => setShowKindModal(true)}
          onOpenImgedModal={() => setShowImageKindModal(true)}
          setShowCostConfig={setShowCostConfig}
          showCostConfig={showCostConfig}
          selectedVoice={selectedVoice}
          imageKinds={imageKinds}
          setTokenConfiguration={setTokenConfiguration}
          tokenConfiguration={tokenConfiguration}
		  setShowSuccessMessage={setShowSuccessMessage}
		  enableRefinement={enableRefinement}
		  setEnableRefinement={setEnableRefinement}
        />

        {showCostConfig && (
          <div className="my-5">
            <CostConfigSection onClose={() => setShowCostConfig(false)} />
          </div>
        )}

        {tokenConfiguration && (
          <div className="mb-5">
            <TokenConfiguration onClose={() => setTokenConfiguration(false)} />
          </div>
        )}

        <div className="dashboard-card">
          <div className="dashboard-header">
            <h2>YouTube Pipeline Dashboard</h2>
            <button
              className="btn btn-outline refresh-btn"
              onClick={fetchVideos}
              disabled={videosLoading}
            >
              <RefreshCw
                className={`icon ${videosLoading ? "spinning" : ""}`}
              />
              {videosLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <VideosTable videos={videos} loading={videosLoading} />
        </div>

        <VoiceModal
          voices={voices}
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          setSelectedVoice={setSelectedVoice}
          selectedVoice={selectedVoice}
        />

        <VideoKindModal
          videoKinds={videoKinds}
          isOpen={showKindModal}
          onClose={() => setShowKindModal(false)}
          onSave={setVideoKinds}
          enableRefinement={enableRefinement}
          setEnableRefinement={setEnableRefinement}
        />
        <ImageKindModal
          isOpen={showImageKindModal}
          onClose={() => setShowImageKindModal(false)}
          imageKinds={imageKinds}
          onSave={setImageKinds}
        />
      </div>
    </div>
  );
}

export default Dashboard;
