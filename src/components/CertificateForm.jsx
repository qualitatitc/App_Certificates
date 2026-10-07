import React from 'react';
import {
  certificateTypes,
  declarationDocumentRefRequiredTypeIds,
  serialNumberOptionalTypeIds,
  DOCUMENT_REF_INVOICE,
  DOCUMENT_REF_DELIVERY,
} from '../products.js';
import { fetchCatalogProducts, persistProduct } from '../lib/productsCatalog.js';
import SearchableSelect from './SearchableSelect';

const LOOSE_PARTS_CERT_ID = 'cert_conf_piezas_sueltas';

function formatDateToDDMMYYYY(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/** Acepta dd/mm/aaaa o separadores - y . */
function parseDDMMYYYY(str) {
  const parts = str.trim().split(/[/.\-]/).filter(Boolean);
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

function toISODateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function CertificateForm({ onGenerate }) {
  const [selectedType, setSelectedType] = React.useState('');
  const [snMode, setSnMode] = React.useState('single');
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [snSingle, setSnSingle] = React.useState('');
  const [snFrom, setSnFrom] = React.useState('');
  const [snTo, setSnTo] = React.useState('');
  const [snManual, setSnManual] = React.useState('');
  const [productsList, setProductsList] = React.useState([]);
  const [productInputMode, setProductInputMode] = React.useState('database');
  const [manualCode, setManualCode] = React.useState('');
  const [manualEsDesc, setManualEsDesc] = React.useState('');
  const [manualEnDesc, setManualEnDesc] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [emissionDateDisplay, setEmissionDateDisplay] = React.useState(() =>
    formatDateToDDMMYYYY(new Date())
  );

  const [invoiceOrDeliveryNote, setInvoiceOrDeliveryNote] = React.useState('');
  const [documentRefType, setDocumentRefType] = React.useState(DOCUMENT_REF_INVOICE);

  const isLoosePartsCert = selectedType === LOOSE_PARTS_CERT_ID;

  React.useEffect(() => {
    let active = true;
    fetchCatalogProducts().then((items) => {
      if (active) setProductsList(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const resetProductFields = () => {
    setSelectedProduct('');
    setProductInputMode('database');
    setManualCode('');
    setManualEsDesc('');
    setManualEnDesc('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) return;

    let finalSN = '';
    if (snMode === 'single') finalSN = snSingle;
    else if (snMode === 'range') finalSN = `From ${snFrom} to ${snTo}`;
    else if (snMode === 'manual') finalSN = snManual;

    if (!finalSN && !serialNumberOptionalTypeIds.includes(selectedType)) {
      return alert('Por favor, introduzca el número de serie');
    }

    if (declarationDocumentRefRequiredTypeIds.includes(selectedType)) {
      const inv = invoiceOrDeliveryNote.trim();
      if (!inv) {
        return alert('Por favor, introduzca el número de factura o albarán');
      }
    }

    const parsedDate = parseDDMMYYYY(emissionDateDisplay);
    if (!parsedDate) {
      return alert('La fecha no es válida. Use el formato dd/mm/aaaa (ejemplo: 22/04/2026).');
    }

    setIsSubmitting(true);

    try {
      let product;

      if (isLoosePartsCert && productInputMode === 'manual') {
        const code = manualCode.trim();
        const esDesc = manualEsDesc.trim();
        const enDesc = manualEnDesc.trim();

        if (!code || !esDesc || !enDesc) {
          return alert('Por favor, complete el código y las descripciones en español e inglés.');
        }

        const result = await persistProduct({ code, esDesc, enDesc });
        product = result.product;

        const refreshed = await fetchCatalogProducts();
        setProductsList(refreshed);

        if (!result.persistedToServer) {
          alert(
            'El artículo se ha guardado solo en este navegador. Abra la app con "Abrir App.bat" para actualizar también products.json y el Excel.'
          );
        }
      } else {
        if (!selectedProduct) {
          return alert('Por favor, seleccione un producto o pieza.');
        }
        product = productsList.find((p) => p.id === selectedProduct);
        if (!product) {
          return alert('No se encontró el producto seleccionado.');
        }
      }

      const type = certificateTypes.find((t) => t.id === selectedType);
      const payload = {
        type,
        product,
        serialNumber: finalSN,
        date: toISODateString(parsedDate),
      };

      if (declarationDocumentRefRequiredTypeIds.includes(selectedType)) {
        payload.invoiceOrDeliveryNote = invoiceOrDeliveryNote.trim();
        payload.documentRefType = documentRefType;
      }

      onGenerate(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Generación de Certificados</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de Certificado:</label>
          <select
            value={selectedType}
            onChange={(e) => {
              const v = e.target.value;
              setSelectedType(v);
              resetProductFields();
              if (!declarationDocumentRefRequiredTypeIds.includes(v)) {
                setInvoiceOrDeliveryNote('');
                setDocumentRefType(DOCUMENT_REF_INVOICE);
              }
            }}
            required
          >
            <option value="">Seleccione un tipo...</option>
            {certificateTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {isLoosePartsCert && (
          <div className="form-group">
            <label>Origen de los datos de la pieza:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="productInputMode"
                  checked={productInputMode === 'database'}
                  onChange={() => setProductInputMode('database')}
                />
                Base de datos
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="productInputMode"
                  checked={productInputMode === 'manual'}
                  onChange={() => setProductInputMode('manual')}
                />
                Manual
              </label>
            </div>
          </div>
        )}

        {isLoosePartsCert && productInputMode === 'manual' ? (
          <>
            <div className="form-group animate-fade-in">
              <label>Código:</label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ej. 12-345"
                autoComplete="off"
                required
              />
            </div>
            <div className="form-group animate-fade-in">
              <label>Descripción (español):</label>
              <input
                type="text"
                value={manualEsDesc}
                onChange={(e) => setManualEsDesc(e.target.value)}
                placeholder="Descripción en español"
                autoComplete="off"
                required
              />
            </div>
            <div className="form-group animate-fade-in">
              <label>Descripción (inglés):</label>
              <input
                type="text"
                value={manualEnDesc}
                onChange={(e) => setManualEnDesc(e.target.value)}
                placeholder="Description in English"
                autoComplete="off"
                required
              />
            </div>
          </>
        ) : (
          <div className="form-group">
            <label>
              {isLoosePartsCert ? 'Pieza:' : 'Producto / Equipo:'}
            </label>
            <SearchableSelect
              options={productsList}
              value={selectedProduct}
              onChange={setSelectedProduct}
              placeholder={
                isLoosePartsCert
                  ? 'Escriba el código o nombre de la pieza...'
                  : 'Escriba el código o nombre del producto...'
              }
            />
          </div>
        )}

        {!serialNumberOptionalTypeIds.includes(selectedType) && (
        <>
        <div className="form-group">
          <label>Modo de Número de Serie:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" value="single" checked={snMode === 'single'} onChange={() => setSnMode('single')} /> Único
            </label>
            <label className="radio-label">
              <input type="radio" value="range" checked={snMode === 'range'} onChange={() => setSnMode('range')} /> Rango
            </label>
            <label className="radio-label">
              <input type="radio" value="manual" checked={snMode === 'manual'} onChange={() => setSnMode('manual')} /> Lista
            </label>
          </div>
        </div>

        {snMode === 'single' && (
          <div className="form-group animate-fade-in">
            <label>Número de Serie:</label>
            <input
              type="text"
              value={snSingle}
              onChange={e => setSnSingle(e.target.value)}
              placeholder="Ej. 123456"
            />
          </div>
        )}

        {snMode === 'range' && (
          <div className="form-row animate-fade-in">
            <div className="form-group">
              <label>Desde:</label>
              <input
                type="text"
                value={snFrom}
                onChange={e => setSnFrom(e.target.value)}
                placeholder="100"
              />
            </div>
            <div className="form-group">
              <label>Hasta:</label>
              <input
                type="text"
                value={snTo}
                onChange={e => setSnTo(e.target.value)}
                placeholder="110"
              />
            </div>
          </div>
        )}

        {snMode === 'manual' && (
          <div className="form-group animate-fade-in">
            <label>Lista de Números de Serie:</label>
            <textarea
              value={snManual}
              onChange={e => setSnManual(e.target.value)}
              placeholder="Introduzca un número por línea o separados por comas..."
              rows="4"
            />
          </div>
        )}
        </>
        )}

        {declarationDocumentRefRequiredTypeIds.includes(selectedType) && (
          <>
            <div className="form-group animate-fade-in">
              <label>Documento de referencia:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="documentRef"
                    checked={documentRefType === DOCUMENT_REF_INVOICE}
                    onChange={() => setDocumentRefType(DOCUMENT_REF_INVOICE)}
                  />
                  Factura
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="documentRef"
                    checked={documentRefType === DOCUMENT_REF_DELIVERY}
                    onChange={() => setDocumentRefType(DOCUMENT_REF_DELIVERY)}
                  />
                  Albarán
                </label>
              </div>
            </div>
            <div className="form-group animate-fade-in">
              <label>
                {documentRefType === DOCUMENT_REF_INVOICE
                  ? 'Número de factura:'
                  : 'Número de albarán:'}
              </label>
              <input
                type="text"
                value={invoiceOrDeliveryNote}
                onChange={(e) => setInvoiceOrDeliveryNote(e.target.value)}
                placeholder={
                  documentRefType === DOCUMENT_REF_INVOICE
                    ? 'Ej. F-2026-0123'
                    : 'Ej. A-456'
                }
                required
                autoComplete="off"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Fecha de Emisión (dd/mm/aaaa):</label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="dd/mm/aaaa"
            value={emissionDateDisplay}
            onChange={(e) => setEmissionDateDisplay(e.target.value)}
            maxLength={10}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Generar Certificado'}
        </button>
      </form>
    </div>
  );
}
