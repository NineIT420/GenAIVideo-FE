import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Info, Check } from "lucide-react";
import InstructionsModal from "./InstructionsModal";
import axios from "axios";
import { data } from "autoprefixer";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function TokenConfiguration({ onClose }) {
  const [showCurrentToken, setShowCurrentToken] = useState(false);
  const [showNewToken, setShowNewToken] = useState(false);
  const [stateshow, setstateshow] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [Data, setData] = useState({
    current_token: "",
    refresh_token: "",
    expiration_date: "",
  });

  const getToken = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/get_yt_token`);
      setData({
        expiration_date: data?.expiration_date || "",
        current_token: data?.refresh_token || "",
        refresh_token: "",
      });
    } catch (err) {
      console.error("Error fetching token data:", err);
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  const handleRefresh = async () => {
    // Check if refresh_token is empty or only whitespace
    if (!Data.refresh_token || Data.refresh_token.trim() === "") {
      setError("No refresh token provided, skipping API call");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${baseUrl}/update_yt_token?refresh_token=${Data.refresh_token}`
      );
      getToken();
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div onClick={onClose}></div>

      <div className="bg-white w-full rounded-lg border border-gray-200 mt-3">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Refresh Token Status
          </h2>
        </div>

        <div className="p-6 pt-0 grid grid-cols-[auto_1fr_auto_auto_1fr_auto] gap-x-4 gap-y-6 items-center">
          <label
            htmlFor="current-token"
            className="col-span-1 text-sm text-gray-700"
          >
            Current Token :
          </label>
          <div className="col-span-2 flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              value={Data.current_token}
              id="current-token"
              type={showCurrentToken ? "text" : "password"}
              readOnly
              className="flex-1 h-9 px-3 py-2 text-sm bg-white focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrentToken(!showCurrentToken)}
              className="h-9 w-9 flex items-center justify-center bg-white text-gray-700 border-l border-gray-300"
            >
              {showCurrentToken ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Expires By */}
          <label
            htmlFor="expires-by"
            className="col-span-1 text-sm text-gray-700 text-right"
          >
            Expires by :
          </label>
          <input
            id="expires-by"
            type="text"
            readOnly
            value={Data.expiration_date}
            className="col-span-1 flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm "
          />
          <button
            type="button"
            className="col-span-1 flex items-center justify-center h-9 w-9 rounded-md text-blue-500"
            aria-label="Token information"
            onClick={() => setstateshow(true)}
          >
            <Info className="h-5 w-5" />
          </button>

          {/* New Token */}
          <label
            htmlFor="new-token"
            className="col-span-1 text-sm text-gray-700"
          >
            New Token :
          </label>
          <div className="col-span-2 flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              id="new-token"
              type={showNewToken ? "text" : "password"}
              value={Data.refresh_token}
              placeholder="Enter new token"
              className="flex-1 h-9 px-3 py-2 text-sm bg-white focus:outline-none"
              onChange={(e) =>
                setData({ ...Data, refresh_token: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowNewToken(!showNewToken)}
              className="h-9 w-9 flex items-center justify-center bg-white text-gray-700 border-l border-gray-300"
            >
              {showNewToken ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {/* {error && <p>{error}</p>} */}

          {/* Refresh Button */}
          <button
            type="button"
            className=" disabled:opacity-80  col-span-3 flex  items-center justify-center h-9 px-4 rounded-md bg-green-600 text-white text-sm font-medium gap-2"
            onClick={handleRefresh}
            disabled={Loading}
          >
            {Loading ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <Check className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {stateshow && <InstructionsModal onClose={() => setstateshow(false)} />}
    </div>
  );
}
