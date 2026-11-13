import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import TicketRecibo, { parseAmount } from "./TicketRecibo";
import CloseIcon from "@mui/icons-material/Close";

const ModalTicketRecibo = ({ empeno, abono, index = 0, onClose }) => {
  // Cerrar con la tecla Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!empeno || !abono) return null;

  const idPago = abono.id || abono.id_pago || abono.id_amortizacion;
  const folio = idPago
    ? `TICK-${String(idPago).padStart(6, "0")}`
    : `TICK-${empeno.id}-${index + 1}`;

  const capital = parseAmount(abono.capital || abono.capitalPagado || abono.capital_pagado);
  const interes = parseAmount(abono.interes || abono.interesesPagados || abono.interes_pagado);
  const iva = parseAmount(abono.iva || abono.ivaPagado || abono.iva_pagado);
  const total = parseAmount(abono.monto || abono.monto_total) || capital + interes + iva;

  const data = {
    nombreEmpresa: "Ophelina",
    folio,
    empenoId: empeno.id,
    fechaPago: abono.fecha || "N/A",
    fechaVencimiento: empeno.vencimiento || "N/A",
    articulo: empeno.nombre || "Artículo",
    concepto: abono.tipo || "Abono",
    capital,
    interes,
    iva,
    total,
    metodoPago: abono.metodoPago || abono.metodo_pago || "Tarjeta / Efectivo",
    referencia: abono.referencia || "N/A",
  };

  return createPortal(
    <div className="tk-overlay" onClick={onClose}>
      <button className="tk-close" onClick={onClose} aria-label="Cerrar">
        <CloseIcon />
      </button>
      <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
        <TicketRecibo data={data} />
      </div>
    </div>,
    document.body
  );
};

export default ModalTicketRecibo;