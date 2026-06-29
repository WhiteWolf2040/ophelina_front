import React, { useEffect } from 'react';
import { stripeService } from '../services/stripeService';

const PaymentModal = ({ isOpen, onClose, sessionId, planName, onSuccess }) => {
  useEffect(() => {
    if (isOpen && sessionId) {
      const verifyPayment = async () => {
        try {
          const empresaId = localStorage.getItem('empresa_id');
          const planId = localStorage.getItem('pending_plan_id');
          
          console.log('📤 Verificando pago:', { 
            sessionId, 
            empresaId, 
            planId: planId 
          });
          
          const response = await stripeService.verifyPayment({
            session_id: sessionId,
            empresa_id: empresaId,
            plan_id: planId
          });
          
          console.log('✅ Respuesta:', response);
          
          if (response.success) {
            // Actualizar estado local
            localStorage.setItem('user_plan', response.planId);
            localStorage.setItem('plan_activo', 'true');
            localStorage.removeItem('pending_plan_id');
            
            if (onSuccess) {
              onSuccess(response);
            }
            
            alert(`¡Pago exitoso! Plan activado correctamente.`);
            
            setTimeout(() => {
              if (onClose) onClose();
              window.location.reload();
            }, 2000);
          } else {
            alert('Error al verificar el pago: ' + (response.error || 'Intenta de nuevo'));
          }
        } catch (error) {
          console.error('❌ Error:', error);
          alert('Error al verificar el pago');
        }
      };
      
      verifyPayment();
    }
  }, [isOpen, sessionId, onSuccess, onClose]);

  if (!isOpen) return null;

  const plan = localStorage.getItem('pending_plan_name') || planName || 'Premium';

  return (
    <div className="payment-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div className="payment-modal" style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        minWidth: '300px'
      }}>
        <h2>🔄 Procesando tu pago...</h2>
        <p>Verificando tu suscripción al plan <strong>{plan}</strong></p>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PaymentModal;
