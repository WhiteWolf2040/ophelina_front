const ModalConfirmar = ({ onClose, onConfirm, mensaje }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icono">⚠️</div>
        <h3>Confirmar</h3>
        <p>{mensaje}</p>
        <p className="advertencia">Esta acción no se puede deshacer</p>
        
        <div className="modal-botones">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirmar-eliminar" onClick={onConfirm}>
            Sí, continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmar;