import React from "react";
import { Loader2, Inbox } from "lucide-react";
import { useNavigate } from "react-router";

export function VideosTable({ videos, loading }) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="icon spinning" />
        <p>Loading previous runs...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <Inbox className="icon large" />
        <p>No video runs found. Generate your first video above!</p>
      </div>
    );
  }

  return (
    <div className="table-container overflow-x-auto">
      <table className="videos-table min-w-max w-full text-sm text-left">
        <thead className="bg-white">
          <tr>
            <th className="px-4 py-2">Video Title / Run ID</th>
            <th className="px-4 py-2">Trigger Time</th>
            <th className="px-4 py-2">Trigger</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {videos?.map((video) => (
            <tr
              key={video?.id}
              className="table-row clickable border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`${video?.id}`)}
            >
              <td className="px-4 py-2 md:font-medium ">{video?.videoTitle}</td>
              <td className="px-4 py-2 ">{video?.triggerTime}</td>
              <td className="px-4 py-2 ">
                <span className="bg-[#0d6efd] rounded-lg text-white px-2 py-1 text-xs">
                  {video?.trigger}
                </span>
              </td>
              <td className="px-4 py-2 ">
                <span className="bg-[#0d6efd] rounded-lg text-white px-2 py-1 text-xs">
                  {video?.status}
                </span>
              </td>
              <td className="px-4 py-2 ">${video?.totalCost.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
