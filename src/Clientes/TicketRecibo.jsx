import React from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import logo from "../assets/ophelina_logo-sinFondo.png";
import "./TicketRecibo.css";

export const mxn = (n) =>
  Number(n || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export const parseAmount = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  return Number(String(val).replace(/[^0-9.-]+/g, "")) || 0;
};

// Espera a que cargue Bodoni antes de abrir el diálogo de impresión
export const imprimirTicket = () =>
  (document.fonts?.ready || Promise.resolve()).then(() => window.print());

const Row = ({ label, value, strong, num }) => (
  <div className={`tk-row ${strong ? "tk-strong" : ""}`}>
    <span className="tk-label">{label}</span>
    <span className="tk-dots" />
    <span className={`tk-value ${num ? "tk-num" : ""}`}>{value}</span>
  </div>
);

function Sheet({ data }) {
  const impreso = new Date().toLocaleString("es-MX");
  return (
    <div className="tk-sheet">
      <header className="tk-head">
        <img className="tk-logo" src={logo} alt={data.nombreEmpresa || "Ophelina"} />
        {data.direccionEmpresa && <p>{data.direccionEmpresa}</p>}
        {data.rfcEmpresa && <p>RFC: <span className="tk-num">{data.rfcEmpresa}</span></p>}
        {data.telefonoEmpresa && <p>Tel: <span className="tk-num">{data.telefonoEmpresa}</span></p>}
      </header>

      <h2 className="tk-title">Comprobante de pago</h2>
      <hr className="tk-sep" />

      <Row label="Folio" value={data.folio} strong num />
      <Row label="Fecha de pago" value={data.fechaPago} num />
      <Row label="Vencimiento" value={data.fechaVencimiento} num />
      <Row label="Empeño" value={`#${data.empenoId}`} num />
      {data.nombreCliente && <Row label="Cliente" value={data.nombreCliente} />}

      <hr className="tk-sep" />
      <p className="tk-section">Artículo</p>
      <p className="tk-articulo">{data.articulo}</p>

      <hr className="tk-sep" />
      <p className="tk-section">{data.concepto || "Abono"}</p>
      <Row label="Capital" value={mxn(data.capital)} num />
      <Row label="Intereses" value={mxn(data.interes)} num />
      <Row label="Subtotal" value={mxn(data.capital + data.interes)} num />
      <Row label="IVA 16% (s/ intereses)" value={mxn(data.iva)} num />
      <div className="tk-total">
        <span>TOTAL PAGADO</span>
        <span className="tk-num">{mxn(data.total)}</span>
      </div>

      <hr className="tk-sep" />
      <Row label="Método" value={data.metodoPago} />
      <Row label="Referencia" value={data.referencia} num />

      <div className="tk-qr">
        <QRCodeSVG value={String(data.folio)} size={84} fgColor="#1b1a17" bgColor="transparent" />
        <small className="tk-num">{data.folio}</small>
      </div>

      <footer className="tk-foot">
        <p className="tk-thanks">Gracias por su preferencia</p>
        <p>Este recibo es comprobante de pago. Muéstralo al recoger tu artículo.</p>
        <p>* Artículo en garantía hasta 30 días después del vencimiento</p>
        <p className="tk-impreso">Impreso: <span className="tk-num">{impreso}</span></p>
      </footer>
    </div>
  );
}

export default function TicketRecibo({ data }) {
  return (
    <>
      <Sheet data={data} />
      {/* Copia que solo se ve al imprimir (fuera de #root) */}
      {createPortal(
        <div className="tk-print-only">
          <Sheet data={data} />
        </div>,
        document.body
      )}
    </>
  );
}