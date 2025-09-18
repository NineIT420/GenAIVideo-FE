import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { X, Plus } from "lucide-react";
const baseUrl = import.meta.env.VITE_BASE_URL;
export function VideoKindModal({ videoKinds, isOpen, onClose, onSave, enableRefinement, setEnableRefinement }) {
  const [localKinds, setLocalKinds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalKinds([...videoKinds]);
    }
  }, [isOpen, videoKinds]);

  const addKind = () => {
    setLocalKinds([
      ...localKinds,
      {
        videoKind: "",
        genPrompt: "",
        refinePrompt: "",
        countWords: false,
      },
    ]);
  };

  const removeKind = (index) => {
    setLocalKinds(localKinds.filter((_, i) => i !== index));
  };

  const updateKind = (index, field, value) => {
    const updated = [...localKinds];
    updated[index] = { ...updated[index], [field]: value };
    setLocalKinds(updated);
  };

  const handleSave = async () => {
    try {
      const kindsData = localKinds.map((kind) => ({
        name: kind.videoKind,
        genPrompt: kind.genPrompt,
        refinePrompt: kind.refinePrompt,
        countWords: kind.countWords,
      }));

      const response = await fetch(
        `${baseUrl}/save_video_kinds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(kindsData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save video kinds");
      }

      onSave(localKinds);
      onClose();
    } catch (error) {
      console.error("Error saving video kinds:", error);
      alert("Failed to save video kinds. See console for details.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Video Kind Options"
      size="extra-large"
    >
      <div className="flex flex-col gap-2">
        <p className="info-text">
          Use <code>$topic$</code> and <code>$mins$</code> in the prompts. They
          will be replaced with the dynamic values in each run.
        </p>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="refinement-toggle"
            checked={enableRefinement}
            onChange={(e) => setEnableRefinement(e.target.checked)}
          />
          <label htmlFor="refinement-toggle">
            Enable Script Refinement by Claude AI
          </label>
        </div>
        <div className="table-container h-[200px] overflow-y-auto ">
          <table className="kinds-table">
            <thead>
              <tr>
                <th>Video Kind</th>
                <th>Script Generation Prompt</th>
                {enableRefinement && <th>Script Refining Prompt</th>}
                <th>Count Words</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {localKinds.map((kind, index) => (
                <tr key={index}>
                  <td className="w-[250px] ">
                    <input
                      type="text"
                      className="w-full p-1 border"
                      value={kind.videoKind}
                      onChange={(e) =>
                        updateKind(index, "videoKind", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td className="w-[250px] h-[100px]">
                    <textarea
                      className="w-full h-full border p-1 "
                      value={kind.genPrompt}
                      onChange={(e) =>
                        updateKind(index, "genPrompt", e.target.value)
                      }
                      rows={2}
                    />
                  </td>
                  {enableRefinement && (
                    <td className="w-[250px] h-[100px]">
                      <textarea
                        className="w-full h-full border"
                        value={kind.refinePrompt}
                        onChange={(e) =>
                          updateKind(index, "refinePrompt", e.target.value)
                        }
                        rows={2}
                        disabled={!enableRefinement}
                      />
                    </td>
                  )}
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={kind.countWords}
                      onChange={(e) =>
                        updateKind(index, "countWords", e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeKind(index)}
                    >
                      <X className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn btn-outline" onClick={addKind}>
          <Plus className="icon" />
          Add Option
        </button>

        <div className="flex justify-between gap-2 border-t pt-2">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
