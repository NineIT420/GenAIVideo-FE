import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { X, Plus, Upload } from "lucide-react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export function ImageKindModal({ isOpen, onClose, onSave, imageKinds }) {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videoModels, setVideoModels] = useState([]);
  const [isLoadingVideoModels, setIsLoadingVideoModels] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});

  useEffect(() => {
    if (isOpen && imageKinds?.length) {
      // Ensure each option has style_guide_image field
      const formattedOptions = imageKinds.map(opt => ({
        ...opt,
        style_guide_image: opt.style_guide_image || null
      }));
      setOptions(formattedOptions);
    }
  }, [isOpen, imageKinds]);

  useEffect(() => {
    const fetchVideoModels = async () => {
      if (isOpen) {
        try {
          setIsLoadingVideoModels(true);
          const response = await axios.get(`${baseUrl}/video_models`);
          setVideoModels(response.data);
        } catch (error) {
          console.error("Error fetching video models:", error);
        } finally {
          setIsLoadingVideoModels(false);
        }
      }
    };

    fetchVideoModels();
  }, [isOpen]);

  const handleChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    setUploadingImages(prev => ({ ...prev, [index]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${baseUrl}/upload_style_guide`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Update the option with the file_id from backend
      const updated = [...options];
      updated[index].style_guide_image = response.data.file_id;
      setOptions(updated);

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleRemoveImage = async (index) => {
    const option = options[index];
    if (option.style_guide_image) {
      try {
        // Delete the image file from server
        await axios.delete(`${baseUrl}/delete_style_guide_image/${option.style_guide_image}.png`);
      } catch (error) {
        console.error("Error deleting image:", error);
        // Continue with removal even if delete fails
      }
    }

    // Remove the image reference from the option
    const updated = [...options];
    updated[index].style_guide_image = null;
    setOptions(updated);
  };

  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    return `${baseUrl}/style_guide?id=${fileId}`;
  };

  const saveImageStyle = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${baseUrl}/save_visual_styles`, options);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        name: "",
        images_per_paragraph: 0,
        defaultStyle: "",
        aspect_ratio: "",
        genPrompt: "",
        videos_per_paragraph: 0,
        video_model: "",
        stylePrompt: "",
        vintageOverlay: true,
        style_guide_image: null,
      },
    ]);
  };

  const handleRemoveOption = async (index) => {
    const option = options[index];
    
    // If the option has an image, delete it from server
    if (option.style_guide_image) {
      try {
        await axios.delete(`${baseUrl}/delete_style_guide_image/${option.style_guide_image}.png`);
      } catch (error) {
        console.error("Error deleting image while removing option:", error);
      }
    }
    
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const handleSave = () => {
    console.log("Saved:", options);
    onSave(options);
    saveImageStyle();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Image Style"
      size="extra-large"
    >
      <div className="flex flex-col gap-4 h-full ">
        <div className="max-h-[250px] overflow-y-auto">
          <table className="kinds-table">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-2 py-1">vintage overlay</th>
                <th className="border px-2 py-1">name</th>
                <th className="border px-2 py-1">Images per Paragraph</th>
                <th className="border px-2 py-1">videos per paragraph</th>
                <th className="border px-2 py-1">Image Style</th>
                <th className="border px-2 py-1">Aspect Ratio</th>
                <th className="border px-2 py-1">Video Model</th>
                <th className="border px-2 py-1">Video Style</th>
                <th className="border px-2 py-1">Prompt Description</th>
                <th className="border px-2 py-1">Style Guide</th>
                <th className="border px-2 py-1 text-center w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {options.map((opt, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">
                    <input
                      type="checkbox"
                      className="w-full border p-1 rounded"
                      checked={
                        opt.vintageOverlay === true ||
                        opt.vintageOverlay === "true" ||
                        opt.vintageOverlay === 1 ||
                        opt.vintageOverlay === "1"
                      }
                      onChange={(e) =>
                        handleChange(index, "vintageOverlay", e.target.checked)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border p-1 rounded"
                      value={opt.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      placeholder="name"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border p-1 rounded"
                      value={opt.images_per_paragraph}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "images_per_paragraph",
                          e.target.value
                        )
                      }
                      placeholder="Images per paragraph"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border p-1 rounded"
                      value={opt.videos_per_paragraph}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "videos_per_paragraph",
                          e.target.value
                        )
                      }
                      placeholder="Videos per paragraph"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      className="w-full border p-1 rounded"
                      value={opt.defaultStyle}
                      onChange={(e) =>
                        handleChange(index, "defaultStyle", e.target.value)
                      }
                    >
                      <option value="" className="hidden">
                        Select style
                      </option>
                      <option value="3d-model">3d-model</option>
                      <option value="analog-film">analog-film</option>
                      <option value="anime">anime</option>
                      <option value="cinematic">cinematic</option>
                      <option value="comic-book">comic-book</option>
                      <option value="digital-art">digital-art</option>
                      <option value="enhance">enhance</option>
                      <option value="isometric">isometric</option>
                      <option value="line-art">line-art</option>
                      <option value="low-poly">low-poly</option>
                      <option value="modeling-compound">
                        modeling-compound
                      </option>
                      <option value="neon-punk">neon-punk</option>
                      <option value="origami">origami</option>
                      <option value="photographic">photographic</option>
                      <option value="pixel-art">pixel-art</option>
                      <option value="tile-texture">tile-texture</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      className="w-full border p-1 rounded"
                      value={opt.aspect_ratio}
                      onChange={(e) =>
                        handleChange(index, "aspect_ratio", e.target.value)
                      }
                    >
                      <option value="" className="hidden">
                        Select ratio
                      </option>
                      <option value="16:9">16:9</option>
                      <option value="1:1">1:1</option>
                      <option value="21:9">21:9</option>
                      <option value="2:3">2:3</option>
                      <option value="3:2">3:2</option>
                      <option value="4:5">4:5</option>
                      <option value="5:4">5:4</option>
                      <option value="9:16">9:16</option>
                      <option value="9:21">9:21</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      className="w-full border p-1 rounded"
                      value={opt.video_model}
                      onChange={(e) =>
                        handleChange(index, "video_model", e.target.value)
                      }
                      disabled={isLoadingVideoModels}
                    >
                      <option value="">Select video model</option>
                      {videoModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="w-[150px] h-[100px]">
                    <textarea
                      className="w-full border rounded h-[50px] p-1"
                      value={opt.stylePrompt}
                      onChange={(e) =>
                        handleChange(index, "stylePrompt", e.target.value)
                      }
                      placeholder="Video style description"
                    />
                  </td>
                  <td className="w-[250px] h-[100px]">
                    <textarea
                      className="w-full border rounded h-[50px] p-1"
                      value={opt.genPrompt}
                      onChange={(e) =>
                        handleChange(index, "genPrompt", e.target.value)
                      }
                      placeholder="Prompt field"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <div className="flex flex-col items-center gap-2">
                      {opt.style_guide_image ? (
                        <div className="relative">
                          <img 
                            src={getImageUrl(opt.style_guide_image)} 
                            alt="Style guide" 
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              // If image fails to load, show placeholder
                              e.target.style.display = 'none';
                            }}
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(index, e.target.files[0])}
                            disabled={uploadingImages[index]}
                          />
                          <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-blue-500">
                            {uploadingImages[index] ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            ) : (
                              <Upload size={20} className="text-gray-400" />
                            )}
                          </div>
                        </label>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="text-gray-500 bg-transparent border border-gray-200 flex justify-center items-center gap-3 p-3 rounded-lg cursor-pointer"
          onClick={handleAddOption}
        >
          <FaPlus />
          <button className="self-start hover:underline text-sm">
            Add Option
          </button>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={handleSave}
            disabled={isLoading}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}