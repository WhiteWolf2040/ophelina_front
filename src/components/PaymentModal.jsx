// PaymentModal.jsx - VERSIÓN CORREGIDA (sin bucles)
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, sessionId, planName, onSuccess }) => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false); // 🔥 Evita verificar múltiples veces

  useEffect(() => {
    // Solo verificar si el modal está abierto, hay sessionId, y no se ha verificado antes
    if (!isOpen || !sessionId || hasVerified.current) return;

    const verifyPayment = async () => {
      try {
        setStatus('verifying');
        setMessage('Verificando tu pago...');

        const empresaId = localStorage.getItem('empresa_id');
        const planId = localStorage.getItem('pending_plan_id');
        const userEmail = localStorage.getItem('user_email');
        const negocioNombre = localStorage.getItem('negocio_nombre');

        console.log('📤 Verificando pago:', { sessionId, empresaId, planId });

        const response = await axios.post('http://127.0.0.1:8000/api/verify-payment', {
          session_id: sessionId,
          empresa_id: empresaId || 'nueva',
          plan_id: planId,
          customer_email: userEmail,
          negocio_nombre: negocioNombre
        });

        if (response.data.success) {
          localStorage.setItem('empresa_id', response.data.empresaId);
          localStorage.setItem('plan_activo', 'true');
          localStorage.setItem('fecha_fin_plan', response.data.fechaFinPlan);
          
          localStorage.removeItem('pending_plan_id');
          localStorage.removeItem('pending_plan_name');
          localStorage.removeItem('pending_plan_price');
          
          setStatus('success');
          setMessage(`¡Pago exitoso! Plan ${planName} activado correctamente.`);
          
          if (onSuccess) {
            setTimeout(() => {
              onSuccess(response.data);
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage(response.data.error || 'Error al verificar el pago. Contacta a soporte.');
        }

      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
        setMessage('Error al conectar con el servidor. Intenta de nuevo.');
      }
    };

    hasVerified.current = true; // Marcar como verificado
    verifyPayment();

    // Limpiar cuando se cierra el modal
    return () => {
      hasVerified.current = false;
    };
  }, [isOpen, sessionId, planName, onSuccess]);

  const handleClose = () => {
    hasVerified.current = false;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-icon">
          {status === 'verifying' && (
            <div className="spinner"></div>
          )}
          {status === 'success' && (
            <div className="success-icon">✅</div>
          )}
          {status === 'error' && (
            <div className="error-icon">❌</div>
          )}
        </div>

        <h2 className="modal-title">
          {status === 'verifying' && 'Verificando pago'}
          {status === 'success' && '¡Pago exitoso!'}
          {status === 'error' && 'Error en el pago'}
        </h2>

        <p className="modal-message">{message}</p>

        <div className="modal-buttons">
          {status === 'verifying' && (
            <button className="btn-disabled" disabled>
              Procesando...
            </button>
          )}
          
          {status === 'success' && (
            <button className="btn-success" onClick={handleClose}>
              Ir al Dashboard
            </button>
          )}
          
          {status === 'error' && (
            <>
              <button className="btn-secondary" onClick={handleClose}>
                Cerrar
              </button>
              <button className="btn-primary" onClick={() => window.location.href = '/planes'}>
                Ver planes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;