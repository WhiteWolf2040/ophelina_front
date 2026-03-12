import React, { useState, useEffect } from 'react';
import "./Tarjetero.css";
import Navbar from "../ClientesNav/Navbar";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Tarjetero = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSensitiveData, setShowSensitiveData] = useState({});
  const [cards, setCards] = useState([
    {
      id: 1,
      cardNumber: '1234 5678 9012 3456',
      cvv: '123',
      holderName: 'Suemy Gamboa',
      expiration: '01/80',
      brand: 'visa'
    }
  ]);

  const [editForm, setEditForm] = useState({
    cardNumber: '',
    cvv: '',
    holderName: '',
    expiration: ''
  });

  const [newCardForm, setNewCardForm] = useState({
    cardNumber: '',
    cvv: '',
    holderName: '',
    expiration: '',
    brand: 'visa'
  });

  // Cerrar modales con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowEditModal(false);
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Inicializar estado de visibilidad para todas las tarjetas
  useEffect(() => {
    const initialVisibility = {};
    cards.forEach(card => {
      initialVisibility[card.id] = false;
    });
    setShowSensitiveData(initialVisibility);
  }, [cards]);

  // Función para alternar visibilidad de datos sensibles
  const toggleVisibility = (cardId) => {
    setShowSensitiveData(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Función para dividir el número de tarjeta en dos líneas
  const splitCardNumber = (number) => {
    const parts = number.split(' ');
    return {
      line1: `${parts[0]} ${parts[1]}`,
      line2: `${parts[2]} ${parts[3]}`
    };
  };

  // Mascarar número de tarjeta
  const maskCardNumber = (number, show) => {
    if (show) return number;
    const lastFour = number.replace(/\s/g, '').slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  // Mascarar CVV
  const maskCVV = (cvv, show) => {
    if (show) return cvv;
    return '•'.repeat(cvv.length);
  };

  const handleEditClick = (card) => {
    setSelectedCard(card);
    setEditForm({
      cardNumber: card.cardNumber,
      cvv: card.cvv,
      holderName: card.holderName,
      expiration: card.expiration
    });
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setNewCardForm({
      cardNumber: '',
      cvv: '',
      holderName: '',
      expiration: '',
      brand: 'visa'
    });
    setShowAddModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedCards = cards.map(card => 
      card.id === selectedCard.id ? { ...card, ...editForm } : card
    );
    setCards(updatedCards);
    setShowEditModal(false);
    setSelectedCard(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newCard = {
      id: cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1,
      ...newCardForm
    };
    setCards([...cards, newCard]);
    setShowAddModal(false);
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
      const updatedCards = cards.filter(card => card.id !== cardId);
      setCards(updatedCards);
      setShowEditModal(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="tar-container">
        {/* Header */}
        <div className="tar-header">
          <h1>Administra y consulta tus tarjetas</h1>
          
          {/* Botón de agregar que aparece solo cuando no hay tarjetas */}
          {cards.length === 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '1rem',
              marginBottom: '2rem'
            }}>
              <button 
                className="tar-btn-add"
                onClick={handleAddClick}
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem',
                  background: 'var(--tar-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--tar-primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--tar-primary)'}
              >
                <AddIcon /> Agregar Nueva Tarjeta
              </button>
            </div>
          )}
        </div>

        {/* Mensaje cuando no hay tarjetas */}
        {cards.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--tar-glass-bg)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            color: 'var(--tar-text-gray)',
            fontSize: '1.1rem'
          }}>
            No tienes tarjetas guardadas. ¡Agrega una para comenzar!
          </div>
        )}

        {/* Tarjetas */}
        {cards.map(card => {
          const cardLines = splitCardNumber(card.cardNumber);
          const isVisible = showSensitiveData[card.id] || false;
          
          return (
            <div key={card.id} className="tar-card-container">
              {/* Lado Izquierdo - Tarjeta de crédito */}
              <div className="tar-card-left">
                <div className="tar-card">
                  <div className="tar-chip"></div>
                  <div className="tar-number">
                    <span className="tar-number-line1">{cardLines.line1}</span>
                    <span className="tar-number-line2">{cardLines.line2}</span>
                  </div>
                  <div className="tar-footer">
                    <div className="tar-holder">
                      {card.holderName.toUpperCase()}
                    </div>
                    <div className="tar-expiry">
                      {card.expiration}
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción debajo de la tarjeta */}
                <div className="tar-card-actions">
                  <button 
                    className="tar-btn-edit"
                    onClick={() => handleEditClick(card)}
                  >
                    ✎ Editar
                  </button>
                  <button 
                    className="tar-btn-delete"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <DeleteIcon fontSize="small" /> Eliminar
                  </button>
                </div>
              </div>

              {/* Lado Derecho - Información con ojito */}
              <div className="tar-card-right">
                <div className="tar-info-panel">
                  <div className="tar-info-header" style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    marginBottom: '1rem',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    paddingBottom: '0.5rem'
                  }}>
                    <button 
                      onClick={() => toggleVisibility(card.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#2c3e70',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {isVisible ? (
                        <>
                          <VisibilityOffIcon fontSize="small" /> Ocultar detalles
                        </>
                      ) : (
                        <>
                          <VisibilityIcon fontSize="small" /> Mostrar detalles
                        </>
                      )}
                    </button>
                  </div>

                  <div className="tar-info-row">
                    <span className="tar-info-label">NOMBRE COMPLETO</span>
                    <span className="tar-info-value">{card.holderName}</span>
                  </div>
                  
                  <div className="tar-info-row">
                    <span className="tar-info-label">NÚMERO DE TARJETA</span>
                    <span className="tar-info-value">{maskCardNumber(card.cardNumber, isVisible)}</span>
                  </div>
                  
                  <div className="tar-info-row">
                    <span className="tar-info-label">CVV</span>
                    <span className="tar-info-value tar-cvv-masked">{maskCVV(card.cvv, isVisible)}</span>
                  </div>
                  
                  <div className="tar-info-row">
                    <span className="tar-info-label">NAME SURNAME</span>
                    <span className="tar-info-value">{card.holderName.toUpperCase()}</span>
                  </div>
                  
                  <div className="tar-info-row">
                    <span className="tar-info-label">VALID THRU</span>
                    <span className="tar-info-value">{card.expiration}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Edición */}
      {showEditModal && selectedCard && (
        <div className="tar-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="tar-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Editar Tarjeta</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="tar-form-group">
                <label>Número de tarjeta</label>
                <input
                  type="text"
                  value={editForm.cardNumber}
                  onChange={(e) => setEditForm({...editForm, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="tar-form-row">
                <div className="tar-form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    value={editForm.cvv}
                    onChange={(e) => setEditForm({...editForm, cvv: e.target.value})}
                    placeholder="123"
                    maxLength="4"
                    required
                  />
                </div>
                <div className="tar-form-group">
                  <label>Vencimiento</label>
                  <input
                    type="text"
                    value={editForm.expiration}
                    onChange={(e) => setEditForm({...editForm, expiration: e.target.value})}
                    placeholder="MM/AA"
                    required
                  />
                </div>
              </div>

              <div className="tar-form-group">
                <label>Nombre del titular</label>
                <input
                  type="text"
                  value={editForm.holderName}
                  onChange={(e) => setEditForm({...editForm, holderName: e.target.value})}
                  required
                />
              </div>

              <div className="tar-modal-actions">
                <div className="tar-modal-actions-row">
                  <button type="submit" className="tar-btn-save">
                    Guardar cambios
                  </button>
                  <button 
                    type="button" 
                    className="tar-btn-delete-modal"
                    onClick={() => handleDeleteCard(selectedCard.id)}
                  >
                    <DeleteIcon fontSize="small" /> Eliminar
                  </button>
                </div>
                <button 
                  type="button" 
                  className="tar-btn-cancel" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Agregar Tarjeta */}
      {showAddModal && (
        <div className="tar-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="tar-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Agregar Nueva Tarjeta</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="tar-form-group">
                <label>Número de tarjeta</label>
                <input
                  type="text"
                  value={newCardForm.cardNumber}
                  onChange={(e) => setNewCardForm({...newCardForm, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="tar-form-row">
                <div className="tar-form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    value={newCardForm.cvv}
                    onChange={(e) => setNewCardForm({...newCardForm, cvv: e.target.value})}
                    placeholder="123"
                    maxLength="4"
                    required
                  />
                </div>
                <div className="tar-form-group">
                  <label>Vencimiento</label>
                  <input
                    type="text"
                    value={newCardForm.expiration}
                    onChange={(e) => setNewCardForm({...newCardForm, expiration: e.target.value})}
                    placeholder="MM/AA"
                    required
                  />
                </div>
              </div>

              <div className="tar-form-group">
                <label>Nombre del titular</label>
                <input
                  type="text"
                  value={newCardForm.holderName}
                  onChange={(e) => setNewCardForm({...newCardForm, holderName: e.target.value})}
                  required
                />
              </div>

              <div className="tar-form-group">
                <label>Marca</label>
                <select 
                  value={newCardForm.brand}
                  onChange={(e) => setNewCardForm({...newCardForm, brand: e.target.value})}
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                </select>
              </div>

              <div className="tar-modal-actions">
                <button type="submit" className="tar-btn-save">
                  <AddIcon fontSize="small" /> Agregar tarjeta
                </button>
                <button type="button" className="tar-btn-cancel" onClick={() => setShowAddModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Tarjetero;