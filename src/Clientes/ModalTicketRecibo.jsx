import React from "react";
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import "../DuenoPagos/Pagos.css"; 

const ModalTicketRecibo = ({ empeno, abono, index = 0, onClose }) => {
  if (!empeno || !abono) return null;

  // ✅ FUNCIÓN PARA CONVERTIR "$1,234.56" A NÚMERO REAL
  const parseAmount = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return Number(String(val).replace(/[^0-9.-]+/g, "")) || 0;
  };

  // ✅ FOLIO: Si no hay ID, usamos el ID del empeño + el index del array.
  // Así siempre será el mismo cada vez que lo abras.
  const idPago = abono.id || abono.id_pago || abono.id_amortizacion;
  const folioGenerado = idPago 
    ? `TICK-${String(idPago).padStart(6, "0")}` 
    : `TICK-${empeno.id}-${index + 1}`;

  // ✅ EXTRAER MONTOS BUSCANDO TODAS LAS POSIBLES VARIANTES DE NOMBRES
  const capital = parseAmount(abono.capital || abono.capitalPagado || abono.capital_pagado);
  const interes = parseAmount(abono.interes || abono.interesesPagados || abono.interes_pagado);
  const iva = parseAmount(abono.iva || abono.ivaPagado || abono.iva_pagado);
  const total = parseAmount(abono.monto || abono.monto_total);

  const reciboData = {
    folio: folioGenerado,
    fechaVencimiento: empeno.vencimiento || "N/A",
    capital: capital,
    interes: interes,
    iva: iva,
    subtotal: capital + interes,
    total: total,
    metodoPago: abono.metodoPago || abono.metodo_pago || "Tarjeta / Efectivo",
    referencia: abono.referencia || "N/A",
    fechaPago: abono.fecha || "N/A",
    articulo: empeno.nombre || "Artículo",
  };

  const handleImprimir = () => window.print();
  const handleCopiarFolio = () => {
    navigator.clipboard.writeText(reciboData.folio);
    alert("Folio copiado al portapapeles");
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div 
        className="popup-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '700px', padding: '24px', background: '#f4f6f8' }}
      >
        <button className="popup-close" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="recibo-header" style={{ marginBottom: '20px', paddingRight: '40px' }}>
          <div className="recibo-acciones" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className="btn-accion-recibo" onClick={handleImprimir}>
              <PrintIcon /> Imprimir Recibo
            </button>
            <button className="btn-accion-recibo" onClick={handleCopiarFolio}>
              <ContentCopyIcon /> Copiar Folio
            </button>
          </div>
        </div>

        <div className="recibo-container" id="recibo-para-imprimir">
          <div className="recibo-encabezado">
            <div className="recibo-logo">
              <ReceiptIcon className="recibo-icon" />
              <h1>OPHELINA</h1>
            </div>
          </div>

          <div className="recibo-folio">
            <div>
              <span className="folio-label">FOLIO:</span>
              <span className="folio-valor">{reciboData.folio}</span>
              <button className="btn-copy-small" onClick={handleCopiarFolio}>
                <ContentCopyIcon fontSize="small" />
              </button>
            </div>
            <div className="recibo-fechas">
              <p><span className="label">Emisión:</span> {reciboData.fechaPago}</p>
              <p><span className="label">Vencimiento:</span> {reciboData.fechaVencimiento}</p>
            </div>
          </div>

          <div className="recibo-cliente">
            <h3>INFORMACIÓN DEL EMPEÑO</h3>
            <div className="cliente-detalle">
              <p><span>Empeño:</span> #{empeno.id}</p>
              <p><span>Artículo:</span> {reciboData.articulo}</p>
              <p><span>Método:</span> {reciboData.metodoPago}</p>
            </div>
          </div>

          <div className="recibo-articulos">
            <h3>DETALLE DEL PAGO</h3>
            <table className="recibo-tabla">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Cant.</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{abono.tipo || "Abono"}</td>
                  <td className="text-center">1</td>
                  <td className="text-right">${reciboData.capital.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="recibo-desglose">
            <div className="desglose-fila">
              <span>Capital:</span>
              <span>${reciboData.capital.toFixed(2)}</span>
            </div>
            <div className="desglose-fila">
              <span>Intereses:</span>
              <span>${reciboData.interes.toFixed(2)}</span>
            </div>
            <div className="desglose-fila">
              <span>IVA (16% sobre intereses):</span>
              <span>${reciboData.iva.toFixed(2)}</span>
            </div>
            <div className="desglose-fila subtotal">
              <span>Subtotal:</span>
              <span>${reciboData.subtotal.toFixed(2)}</span>
            </div>
            <div className="desglose-fila total">
              <span>TOTAL PAGADO:</span>
              <span>${reciboData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="recibo-footer">
            <div className="recibo-qr">
              <QrCodeIcon className="qr-icon" />
              <div className="qr-placeholder">
                <small>Código de verificación</small>
                <p className="qr-folio">{reciboData.folio}</p>
              </div>
            </div>
            <div className="recibo-notas">
              <p><strong>Nota:</strong> Este recibo es comprobante de pago. Muéstralo al recoger tu artículo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTicketRecibo;