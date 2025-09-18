import React, { useEffect, useState } from "react";
import { UsageChart } from "../components/UsageChart";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
const baseUrl = import.meta.env.VITE_BASE_URL;

export function VideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Data, setData] = useState();
  const [selectedImages, setSelectedImages] = useState({});
  const [generatedImages, setGeneratedImages] = useState({});
  const [loading, setLoading] = useState({});

  const getVideoInfo = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/run_to_display/${id}`);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageSelect = (paraIndex, imageId, imageLink) => {
    setSelectedImages((prev) => ({
      ...prev,
      [paraIndex]: { id: imageId, link: imageLink },
    }));
  };

  const handleGenerateImages = async (paraIndex, paraId) => {
    const selectedImage = selectedImages[paraIndex];
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    setLoading((prev) => ({ ...prev, [paraIndex]: true }));

    try {
      const response = await axios.post(
        `${baseUrl}/${id}/regenerate_image?img_id=${selectedImage?.id}&para_id=${paraId}`
      );

      setGeneratedImages((prev) => ({
        ...prev,
        [paraIndex]: response.data,
      }));
    } catch (error) {
      console.error("Error generating images:", error);
      alert("Failed to generate images");
    } finally {
      setLoading((prev) => ({ ...prev, [paraIndex]: false }));
    }
  };

  const handleSubmitNewImage = async (paraIndex, paraId) => {
    const selectedImage = selectedImages[paraIndex];
    const generatedImageList = generatedImages[paraIndex];

    if (!selectedImage || !generatedImageList) {
      alert("Please select an image and generate alternatives first");
      return;
    }

    const selectedGeneratedImage = generatedImageList.find(
      (img) => img.selected
    );
    if (!selectedGeneratedImage) {
      alert("Please select a generated image");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/${id}/replace_image?para_id=${paraId}&old_img_id=${selectedImage.id}&new_img_id=${selectedGeneratedImage.img_id}`
      );

      alert("Image updated successfully!");
      // Refresh the video data
      getVideoInfo();
      setGeneratedImages({});
      setSelectedImages({});
    } catch (error) {
      console.error("Error submitting new image:", error);
      alert("Failed to update image");
    }
  };

  const handleGeneratedImageSelect = (paraIndex, imageId) => {
    setGeneratedImages((prev) => ({
      ...prev,
      [paraIndex]: prev[paraIndex].map((img) => ({
        ...img,
        selected: img.img_id === imageId,
      })),
    }));
  };

  useEffect(() => {
    getVideoInfo();
    // Smooth scroll to top on first load
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [id]);
  return (
    <div className="video-details container">
      <div className="flex items-center gap-2 mb-5">
        <FaArrowLeft
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="font-bold text-2xl">{Data?.videoTitle}</h1>
      </div>
      <div className="details-grid">
        <div className="detail-item">
          <strong>Flow Run ID :</strong> {Data?.flowRunId}
        </div>
        <div className="detail-item">
          <strong>Trigger Time :</strong> {Data?.triggerTime}
        </div>
        <div className="detail-item">
          <strong>Trigger :</strong>{" "}
          <span className=" bg-blue-500 py-1 px-2 rounded text-white text-xs">
            {Data?.trigger}
          </span>
        </div>
        <div className="detail-item">
          <strong>Best Trend/Trigger Topic :</strong> {Data?.triggerTopic}
        </div>
        <div className="detail-item">
          <strong>Status :</strong>{" "}
          <span className=" bg-blue-500 py-1 px-2 rounded text-white text-xs">
            {Data?.status}
          </span>
        </div>
        <div className="detail-item">
          <strong>Last update :</strong> {Data?.lastUpdate}
        </div>
        <div className="detail-item">
          <strong>Video Kind :</strong> {Data?.videoKind}
        </div>
        <div className="detail-item">
          <strong>Voice :</strong> {Data?.voice}
        </div>
		<div className="detail-item">
          <strong>Video Model :</strong> {Data?.video_model}
        </div>
      </div>

      {Data?.videoLink && (
        <div className="video-link">
          <strong>Link to YouTube Video :</strong>
          <div className="link-container">
            <a
              href={`https://${Data?.videoLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-link-url"
            >
              {Data?.videoLink}
            </a>
          </div>
        </div>
      )}

      <div className="separator"></div>

      <div className="generated-content">
        <h5>Generated Content</h5>
        <div className="content-details">
          <div className="content-item">
            <strong>Title :</strong> {Data?.videoTitle}
          </div>
          <div className="content-item">
            <strong>Description :</strong> {Data?.description}
          </div>
          <div className="content-item">
            <strong>Tags :</strong> {Data?.tags}
          </div>
          <div className="content-item">
            <strong>Full script text:</strong> {Data?.["script-text"]}
          </div>
          <div className="content-item">
            <strong>Script :</strong>
            {Array.isArray(Data?.script) ? (
              Data?.script?.map((paragraph, paraIndex) => (
                <div key={paraIndex} className="mb-8 p-2 border rounded-lg">
                  <p className="">{paragraph.para_text}</p>

                  {/* Original Images Section */}
                  <div className="mb-4">
                    <h6 className="font-semibold mb-2">Original visuals:</h6>
                    <div className="grid grid-cols-2 gap-4">
                      {paragraph?.visuals?.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all relative ${
                            selectedImages[paraIndex]?.id === image?.id
                              ? "border-blue-500 shadow-lg"
                              : "border-transparent"
                          }`}
                          onClick={() =>
                            handleImageSelect(paraIndex, image?.id, image?.link)
                          }
                        >
                          {image?.type === "image" ? (
                            <img
                              src={image?.link}
                              className="w-full h-full object-contain"
                              alt={`Image ${imageIndex + 1}`}
                            />
                          ) : (
                            <video
                              className="w-full h-full object-contain"
                              controls
                            >
                              <source src={image?.link} />
                            </video>
                          )}
                          {selectedImages[paraIndex]?.id === image?.id && (
                            <div className="bg-blue-500 text-white text-center py-1 text-sm absolute bottom-0 w-full">
                              Selected
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  {selectedImages[paraIndex] && (
                    <div className="mb-4">
                      <button
                        onClick={() =>
                          handleGenerateImages(paraIndex, paragraph.para_id)
                        }
                        disabled={loading[paraIndex]}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {loading[paraIndex]
                          ? "Generating..."
                          : "Generate Alternative Images"}
                      </button>
                    </div>
                  )}

                  {/* Generated Images Section */}
                  {generatedImages[paraIndex] &&
                    generatedImages[paraIndex]?.length > 0 && (
                      <div className="mb-4">
                        <h6 className="font-semibold mb-2">
                          Generated Alternative Images:
                        </h6>
                        <div className="grid grid-cols-2 gap-4">
                          {generatedImages[paraIndex].map(
                            (image, imageIndex) => (
                              <div
                                key={imageIndex}
                                className={` cursor-pointer border-2 rounded-lg overflow-hidden transition-all relative ${
                                  image?.selected
                                    ? "border-green-500 shadow-lg"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                  handleGeneratedImageSelect(
                                    paraIndex,
                                    image?.img_id
                                  )
                                }
                              >
                                <img
                                  src={image?.img_link}
                                  className="w-full h-full object-contain"
                                  alt={`Generated Image ${imageIndex + 1}`}
                                />
                                {image?.selected && (
                                  <div className="bg-green-500 text-white text-center py-1 text-sm absolute bottom-0 w-full">
                                    Selected
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                          <button
                            onClick={() =>
                              handleSubmitNewImage(paraIndex, paragraph.para_id)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Submit New Image
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ))
            ) : (
              <p>{Data?.script}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <div className="download-section">
          <strong>Voiceover</strong>
          <div className="download-container">
            <a
              href={`${baseUrl}/flow/${Data?.flowRunId}/voiceover`}
              download
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Download Voiceover
            </a>
          </div>
        </div>
        <div className="download-section">
          <strong>Video</strong>
          <div className="download-container">
            <a
              href={`${baseUrl}/flow/${Data?.flowRunId}/video`}
              download
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Download Video
            </a>
          </div>
        </div>
      </div>

      <div className="separator"></div>
      <UsageChart video={Data} />
    </div>
  );
}
