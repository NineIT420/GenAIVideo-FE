import React from "react";

import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, size = "medium" }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: "modal-small",
    medium: "modal-medium",
    large: "modal-large",
    "extra-large": "modal-extra-large",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
