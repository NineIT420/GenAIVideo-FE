import React, { useState, useRef } from "react";
import { Modal } from "./Modal";
import { Search, Play } from "lucide-react";

export function VoiceModal({
  voices,
  isOpen,
  onClose,
  setSelectedVoice,
  selectedVoice,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    lang: "",
    accent: "",
    tone: "",
    age: "",
    gender: "",
    platform: "",
  });
  const audioRef = useRef(null);
  console.log(selectedVoice);
  const getUniqueValues = (key) => {
    const values = voices.map((voice) => voice[key]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const filteredVoices = voices.filter((voice) => {
    const matchesSearch = voice.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilters =
      (!filters.accent || voice.accent === filters.accent) &&
      (!filters.tone || voice.tone === filters.tone) &&
      (!filters.age || voice.age === filters.age) &&
      (!filters.gender || voice.gender === filters.gender) &&
      (!filters.platform || voice.platform === filters.platform);
    return matchesSearch && matchesFilters;
  });

  const playSample = async (voice) => {
    if (audioRef.current) {
      audioRef.current.pause();
      
      // Handle minimax voices with specific API call
      if (voice.platform === 'minimax') {
        try {
          const baseUrl = import.meta.env.VITE_BASE_URL;
          const response = await fetch(`${baseUrl}/preview_minimax/${voice.voice_id}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
      audioRef.current.play();
          } else {
            console.error('Failed to fetch minimax voice preview:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching minimax voice preview:', error);
        }
      } else {
        // For other platforms, use the existing mp3_sample URL
        audioRef.current.src = voice.mp3_sample;
        audioRef.current.play();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Voice"
      size="extra-large"
    >
      <div className="voice-modal-content">
        {/* Search and Filters */}
        <div className="voice-filters">
          <div className="search-container">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search voices by name..."
                className="search-input"
              />
            </div>
          </div>

          <select
            className="filter-select"
            value={filters.platform}
            onChange={(e) =>
              setFilters({ ...filters, platform: e.target.value })
            }
          >
            <option value="">All Platforms</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="minimax">MiniMax</option>
          </select>

          <select
            className="filter-select"
            value={filters.accent}
            onChange={(e) => setFilters({ ...filters, accent: e.target.value })}
          >
            <option value="">All Accents</option>
            {getUniqueValues("accent").map((accent) => (
              <option key={accent} value={accent}>
                {accent}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          >
            <option value="">All Genders</option>
            {getUniqueValues("gender").map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.age}
            onChange={(e) => setFilters({ ...filters, age: e.target.value })}
          >
            <option value="">All Ages</option>
            {getUniqueValues("age").map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Grid */}
        <div className="voice-grid  h-[200px]">
          {filteredVoices.map((voice) => (
            <div
              key={voice.voice_id}
              className={`voice-card ${
                selectedVoice === voice ? "selected" : ""
              }`}
              onClick={() => setSelectedVoice(voice)}
            >
              <div className="voice-card-header">
                <h5>{voice.name}</h5>
              </div>

              <p className="voice-description">{voice.description}</p>

              <div className="voice-tags">
                <span className="tag">
                  {voice.platform === "elevenlabs" ? "ElevenLabs" : "MiniMax"}
                </span>
                <span className="tag">{voice.accent}</span>
                <span className="tag">{voice.gender}</span>
                <span className="tag">{voice.age}</span>
                <span className="tag">{voice.tone}</span>
              </div>

              <button
                className="btn btn-outline btn-sm preview-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  playSample(voice);
                }}
              >
                <Play className="icon" />
                Preview Voice
              </button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Confirm Selection
          </button>
        </div>

        <audio ref={audioRef} />
      </div>
    </Modal>
  );
}
