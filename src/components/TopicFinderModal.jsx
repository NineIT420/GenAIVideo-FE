import React from "react";
import { useState } from "react";
import { Modal } from "./Modal";
import { Loader2, Stars, Check } from "lucide-react";
import { FaExclamation } from "react-icons/fa";
const baseUrl = import.meta.env.VITE_BASE_URL;
export function TopicFinderModal({ isOpen, onClose, setNewVideo }) {
  const [prompt, setPrompt] = useState("");
  const [calculateVph, setCalculateVph] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const response = await fetch(
        `${baseUrl}/topic-finder?prompt=${encodeURIComponent(
          prompt
        )}&calculate_vph=${calculateVph}`
      );

      if (!response.ok) throw new Error("Failed to fetch topic suggestions");

      const data = await response.json();
      const sortedSuggestions = (data || []).sort(
        (a, b) => (b.score || 0) - (a.score || 0)
      );
      setSuggestions(sortedSuggestions);
    } catch (error) {
      console.error("Error fetching topic suggestions:", error);
      setError(error.message || "Failed to get topic suggestions");
    } finally {
      setLoading(false);
    }
  };

  const selectTopic = (topic) => {
    setNewVideo((prev) => ({
      ...prev,
      topic: topic,
      mode: "topic",
    }));
    console.log("Selected topic:", topic);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Topic Finder"
      size="large"
    >
      <div className="topic-finder-content">
        <div className="form-group">
          <label htmlFor="prompt">
            Enter a prompt to generate topic ideas:
          </label>
          <textarea
            id="prompt"
            placeholder="e.g. 'Tech trends for 2024' or 'Popular fitness topics'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="form-textarea"
          />
        </div>

        <div className="topic-finder-actions">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="vph-toggle"
              checked={calculateVph}
              onChange={(e) => setCalculateVph(e.target.checked)}
            />
            <label htmlFor="vph-toggle">Calculate VPH Score</label>
            <div className="relative">
              <div className="w-5 h-5 flex justify-center items-center border border-[#495057] rounded-full cursor-pointer group">
                <FaExclamation className="text-[#495057] text-xs" />
                <div className=" w-[195px] h-[85px] absolute bottom-6 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ">
                  VPH score calculation takes longer but helps identify better
                  performing topics
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={fetchSuggestions}
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <Loader2 className="icon spinning" />
            ) : (
              <Stars className="icon" />
            )}
            Generate Suggestions
          </button>
        </div>

        {loading && (
          <div className="loading-state">
            <Loader2 className="icon spinning large" />
            <p>Finding the best topics for you...</p>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {suggestions.length > 0 && (
          <div className="suggestions-section">
            <h6>Suggested Topics</h6>
            <div className="suggestions-list">
              {suggestions?.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  <div className="suggestion-info">
                    <span className="suggestion-topic ">
                      {suggestion.topic}
                    </span>
                    {suggestion?.score && (
                      <small className="suggestion-score">
                        VPH: {suggestion?.score?.toFixed(2)}
                      </small>
                    )}
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => selectTopic(suggestion.topic)}
                  >
                    <Check className="icon" />
                    Pick Topic
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
