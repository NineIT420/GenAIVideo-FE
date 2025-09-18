import { X } from "lucide-react";
import React from "react";

export default function InstructionsModal({ onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[55]"
        onClick={onClose} // كمان ممكن تعمل close لو ضغط على الخلفية
      ></div>

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Refresh Token Instructions
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close instructions"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 text-sm text-gray-700">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Open
              <a
                href="https://developers.google.com/oauthplayground/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google OAuth Playground
              </a>
            </li>
            <li>Login with your channels account</li>
            <li>Click on settings on the top right</li>
            <li>Make sure Use your own OAuth credentials is ticked</li>
            <li>
              In Step 1, choose
              <br />
              under the Youtube Data API option
            </li>
            <li>Click Authorize APIs</li>
            <li>In Step 2, click on Exchange authorization code for tokens</li>
            <li>You should now see the generated refresh token...</li>
          </ol>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          {/* Footer */}
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 duration-200 text-sm font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
