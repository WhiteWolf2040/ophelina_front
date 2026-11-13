// components/AppModal.jsx - VERSIÓN REDISEÑADA
import React, { useEffect } from "react";
import "./AppModal.css";

// Iconos MUI reales por tipo
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

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
      if (e.key === "Enter" && onConfirm) {
        // Solo dispara Enter si no hay input (para evitar doble submit)
        if (type !== "prompt") onConfirm();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onConfirm, onCancel, type]);

  if (!isOpen) return null;

  // Icono real por tipo
  const iconMap = {
    success: <CheckCircleIcon />,
    error: <CancelIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />,
    prompt: <HelpOutlineIcon />,
  };

  // Etiqueta corta por tipo (para el badge superior)
  const labelMap = {
    success: 'Éxito',
    error: 'Error',
    warning: 'Atención',
    info: 'Información',
    prompt: 'Ingresa un valor',
  };

  return (
    <div className="appmodal-overlay" onClick={onCancel}>
      <div
        className={`appmodal-box appmodal-${type}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="appmodal-title"
      >
        {/* Botón cerrar arriba a la derecha */}
        <button
          className="appmodal-close-btn"
          onClick={onCancel}
          aria-label="Cerrar"
          type="button"
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* Header con icono + badge */}
        <div className="appmodal-header">
          <div className={`appmodal-icon-wrapper appmodal-icon-${type}`}>
            {iconMap[type]}
          </div>
          <span className={`appmodal-badge appmodal-badge-${type}`}>
            {labelMap[type]}
          </span>
        </div>

        {/* Título */}
        {title && (
          <h3 className="appmodal-title" id="appmodal-title">
            {title}
          </h3>
        )}

        {/* Mensaje */}
        {message && <p className="appmodal-message">{message}</p>}

        {/* Input para prompts */}
        {type === "prompt" && (
          <div className="appmodal-input-group">
            {inputLabel && <label className="appmodal-input-label">{inputLabel}</label>}
            <input
              autoFocus
              type={inputType}
              value={inputValue}
              placeholder={inputPlaceholder}
              onChange={(e) => onInputChange?.(e.target.value)}
              className="appmodal-input"
            />
          </div>
        )}

        {/* Acciones */}
        <div className="appmodal-actions">
          {showCancel && (
            <button
              className="appmodal-btn appmodal-btn-cancel"
              onClick={onCancel}
              type="button"
            >
              {cancelText}
            </button>
          )}
          <button
            className={`appmodal-btn appmodal-btn-${type}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppModal;