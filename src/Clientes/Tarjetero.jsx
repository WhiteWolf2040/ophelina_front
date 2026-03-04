import React, { useState } from 'react';
import "./Tarjetero.css";
import Navbar from "../ClientesNav/Navbar";

const Tarjetero = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
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

  // Función para dividir el número de tarjeta en dos líneas
  const splitCardNumber = (number) => {
    const parts = number.split(' ');
    return {
      line1: `${parts[0]} ${parts[1]}`,
      line2: `${parts[2]} ${parts[3]}`
    };
  };

  // Mascarar número de tarjeta
  const maskCardNumber = (number) => {
    const lastFour = number.replace(/\s/g, '').slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  // Mascarar CVV
  const maskCVV = (cvv) => {
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
      id: cards.length + 1,
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
        </div>

        {/* Botones principales */}
        <div className="tar-main-actions">
          <button className="tar-btn-add" onClick={handleAddClick}>
            + Agregar tarjeta
          </button>
          <button 
            className="tar-btn-edit-main" 
            onClick={() => cards.length > 0 && handleEditClick(cards[0])}
            disabled={cards.length === 0}
          >
            ✎ Editar tarjeta
          </button>
        </div>

        {/* Tarjeta Principal */}
        {cards.map(card => {
          const cardLines = splitCardNumber(card.cardNumber);
          
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
              </div>

              {/* Lado Derecho - Información (Efecto Cristal) - SIN BOTONES */}
              <div className="tar-card-right">
                <div className="tar-info-panel">
                  <div className="tar-info-row">
                    <span className="tar-info-label">NOMBRE COMPLETO</span>
                    <span className="tar-info-value">{card.holderName}</span>
                  </div>
                  
                  <div className="tar-info-row">
                    <span className="tar-info-label">NÚMERO DE TARJETA</span>
                    <span className="tar-info-value">{maskCardNumber(card.cardNumber)}</span>
                  </div>
                  
                  <div className="tar-info-row">
                    <span className="tar-info-label">CVV</span>
                    <span className="tar-info-value tar-cvv-masked">{maskCVV(card.cvv)}</span>
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

      {/* Modal de Edición con botón de eliminar */}
      {showEditModal && selectedCard && (
        <div className="tar-modal-overlay">
          <div className="tar-modal-content">
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

              <div className="tar-modal-actions" style={{ gap: '1rem' }}>
                <button type="submit" className="tar-btn-save" style={{ flex: 2 }}>
                  Guardar cambios
                </button>
                <button 
                  type="button" 
                  className="tar-btn-delete" 
                  onClick={() => handleDeleteCard(selectedCard.id)}
                  style={{ flex: 1 }}
                >
                  Eliminar
                </button>
              </div>
              
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <button 
                  type="button" 
                  className="tar-btn-cancel" 
                  onClick={() => setShowEditModal(false)}
                  style={{ width: '100%' }}
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
        <div className="tar-modal-overlay">
          <div className="tar-modal-content">
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
                <button type="submit" className="tar-btn-save">Agregar tarjeta</button>
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