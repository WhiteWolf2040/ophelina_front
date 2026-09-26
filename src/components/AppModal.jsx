import React, { useEffect } from "react";
import "./AppModal.css";

/**
 * Modal reutilizable:
 *  - type: "info" | "success" | "error" | "prompt"
 *  - Campos de prompt: inputLabel, inputType, inputPlaceholder, inputValue, onInputChange
 *  - Botones: confirmText, cancelText, onConfirm, onCancel
 */
const AppModal = ({
  isOpen,
  type = "info",
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  showCancel = false,
  inputLabel,
  inputType = "text",
  inputPlaceholder = "",
  inputValue = "",
  onInputChange,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape" && onCancel) onCancel();
      if (e.key === "Enter" && onConfirm) onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const iconMap = {
    success: "✓",
    error: "✕",
    info: "i",
    prompt: "?",
  };

  return (
    <div className="appmodal-overlay" onClick={onCancel}>
      <div
        className={`appmodal-box appmodal-${type}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={`appmodal-icon appmodal-icon-${type}`}>
          {iconMap[type]}
        </div>

        {title && <h3 className="appmodal-title">{title}</h3>}
        {message && <p className="appmodal-message">{message}</p>}

        {type === "prompt" && (
          <div className="appmodal-input-group">
            {inputLabel && <label>{inputLabel}</label>}
            <input
              autoFocus
              type={inputType}
              value={inputValue}
              placeholder={inputPlaceholder}
              onChange={(e) => onInputChange?.(e.target.value)}
            />
          </div>
        )}

        <div className="appmodal-actions">
          {showCancel && (
            <button className="appmodal-btn appmodal-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            className={`appmodal-btn appmodal-btn-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppModal;