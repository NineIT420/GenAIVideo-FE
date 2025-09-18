import React, { useEffect, useState } from "react";
import { ExternalLink, Check } from "lucide-react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

const serviceConfig = [
  {
    name: "serpapi",
    displayName: "SerpAPI",
    pricingUrl: "https://serpapi.com/pricing",
    unit: "search",
  },
  {
    name: "openai_in",
    displayName: "OpenAI Input",
    pricingUrl: "https://platform.openai.com/docs/pricing",
    unit: "million tokens",
  },
  {
    name: "openai_out",
    displayName: "OpenAI Output",
    pricingUrl: "https://platform.openai.com/docs/pricing",
    unit: "million tokens",
  },
  {
    name: "claude_in",
    displayName: "Claude Input",
    pricingUrl: "https://www.anthropic.com/pricing#api",
    unit: "million tokens",
  },
  {
    name: "claude_out",
    displayName: "Claude Output",
    pricingUrl: "https://www.anthropic.com/pricing#api",
    unit: "million tokens",
  },
  {
    name: "elevenlabs",
    displayName: "ElevenLabs",
    pricingUrl: "https://elevenlabs.io/pricing",
    unit: "minute",
  },
  {
    name: "minimax",
    displayName: "MiniMax",
    pricingUrl: "https://www.minimax.io/price",
    unit: "million characters",
  },
  {
	name: "stability",
	displayName: "Stability AI",
	pricingUrl: "https://platform.stability.ai/pricing",
	unit: "credit"
  }
];

export function CostConfigSection({ onClose }) {
  const [fetchedConfig, setFetchedConfig] = useState({});
  const [localConfig, setLocalConfig] = useState({});

  // Load from backend
  useEffect(() => {
    const loadCostConfig = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/get_prices`);
        setFetchedConfig(data || {});
      } catch (error) {
        console.error("Failed to load cost config:", error);
      }
    };
    loadCostConfig();
  }, []);

  // Merge defaults with fetched values ONCE after fetch
  useEffect(() => {
    const merged = {};
    serviceConfig.forEach((service) => {
      merged[service.name] = {
        cost: fetchedConfig[service.name] ?? 0,
        costUnit: service.unit,
        editable: true,
        ...(typeof fetchedConfig[service.name] === "object"
          ? fetchedConfig[service.name]
          : {}),
      };
    });
    setLocalConfig(merged);
  }, [fetchedConfig]);

  const updateCost = (serviceName, cost) => {
    setLocalConfig((prev) => ({
      ...prev,
      [serviceName]: { ...prev[serviceName], cost },
    }));
  };

  const saveCostConfig = async () => {
    try {
      const configToSave = {};
      Object.keys(localConfig).forEach((service) => {
        configToSave[service] = localConfig[service].cost;
      });

      localStorage.setItem("costConfig", JSON.stringify(configToSave));

      await fetch(`${baseUrl}/save_prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });

      onClose();
    } catch (error) {
      console.error("Error saving cost config:", error);
    }
  };

  return (
    <div className="cost-config-section !bg-white">
      <h6>Service Cost Configuration</h6>
      <div className="cost-config-grid">
        {serviceConfig.map((service) => {
          const config = localConfig[service.name];
          return (
            <div key={service.name} className="cost-config-item">
              <div className="cost-label">
                <label>
                  {service.displayName} (per {config?.costUnit})
                </label>
                <a
                  href={service.pricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pricing-link"
                  title={`View ${service.displayName} Pricing`}
                >
                  <ExternalLink className="icon" />
                </a>
              </div>
              <div className="cost-input-group">
                <span
                  className={`input-prefix ${
                    !config?.editable ? "disabled" : ""
                  }`}
                >
                  $
                </span>
                <input
                  type="number"
                  // step="0.000001"
                  min="-1"
                  value={config?.cost}
                  onChange={(e) =>
                    updateCost(service.name, parseFloat(e.target.value) || 0)
                  }
                  readOnly={!config?.editable}
                  disabled={!config?.editable}
                  className={`cost-input ${
                    !config?.editable ? "disabled" : ""
                  }`}
                  onWheel={(e) => e.target.blur()} // Prevents scroll on input
                />
              </div>
              {!config?.editable && (
                <p className="auto-fetch-note">
                  Automatically fetched from API
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="cost-config-actions">
        <button className="btn btn-primary" onClick={saveCostConfig}>
          <Check className="icon" /> Save Cost Configuration
        </button>
      </div>
    </div>
  );
}
