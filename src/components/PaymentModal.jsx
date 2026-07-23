// components/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../config/api';  // ← IMPORTAR api
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, sessionId, planName, planId, onSuccess }) => {
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && sessionId && !verified && !verifying) {
            console.log('🔍 Modal abierto - Verificando pago...');
            verifyPayment();
        }
    }, [isOpen, sessionId]);

    const verifyPayment = async () => {
        try {
            setVerifying(true);
            setError(null);
        console.log('🚀🚀🚀 verifyPayment INICIADO');
        console.log('📌 sessionId:', sessionId);
        console.log('📌 planName:', planName);
        console.log('📌 planId:', planId);
        console.log('🔑 Token:', localStorage.getItem('token') ? 'SÍ' : 'NO');
            
            // ✅ USAR API DIRECTAMENTE (el interceptor agrega el token)
            const response = await api.post('/stripe/verify-payment', {
                session_id: sessionId
            });
            
            console.log('📊 Respuesta del backend:', response.data);
            
            if (response.data.success) {
                setVerified(true);
                console.log('✅ Pago verificado correctamente');
                
                // Guardar información del plan
                localStorage.setItem('plan_id', response.data.data.plan_id);
                localStorage.setItem('plan_nombre', response.data.data.plan_nombre);
                
                // Notificar éxito
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                
                // Cerrar modal automáticamente después de 3 segundos
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setError(response.data.message || 'Error al verificar el pago');
            }
        } catch (error) {
            console.error('❌ Error al verificar pago:', error);
            console.error('❌ Detalles del error:', error.response?.data);
            
            // Si es error 401, redirigir al login
            if (error.response?.status === 401) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            } else {
                setError(error.response?.data?.message || 'Error de conexión al verificar el pago');
            }
        } finally {
            setVerifying(false);
        }
    };

    // Si no está abierto, no renderizar nada
    if (!isOpen) return null;

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal-container">
                <button className="payment-modal-close" onClick={onClose}>✕</button>
                
                <div className="payment-modal-content">
                    <h2>Verificando tu pago</h2>
                    
                    {verifying && (
                        <div className="payment-loading">
                            <div className="spinner"></div>
                            <p>Verificando tu suscripción <strong>{planName || 'Premium'}</strong>...</p>
                            <p className="payment-subtext">Por favor espera un momento</p>
                        </div>
                    )}
                    
                    {verified && (
                        <div className="payment-success">
                            <div className="success-icon">✅</div>
                            <h3>¡Pago confirmado!</h3>
                            <p>Tu plan <strong>{planName || 'Premium'}</strong> ha sido activado correctamente.</p>
                            <p className="payment-subtext">Redirigiendo al dashboard...</p>
                            <button className="btn-primary" onClick={onClose}>
                                Ir al Dashboard
                            </button>
                        </div>
                    )}
                    
                    {error && !verified && !verifying && (
                        <div className="payment-error">
                            <div className="error-icon">❌</div>
                            <h3>Error al verificar el pago</h3>
                            <p>{error}</p>
                            <div className="payment-actions">
                                <button className="btn-retry" onClick={verifyPayment}>
                                    Reintentar
                                </button>
                                <button className="btn-secondary" onClick={onClose}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;