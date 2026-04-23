import React from 'react';
import { products, certificateTypes } from '../products.js';
import SearchableSelect from './SearchableSelect';

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
  const [snMode, setSnMode] = React.useState('single'); // single, range, manual
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [snSingle, setSnSingle] = React.useState('');
  const [snFrom, setSnFrom] = React.useState('');
  const [snTo, setSnTo] = React.useState('');
  const [snManual, setSnManual] = React.useState('');

  const [emissionDateDisplay, setEmissionDateDisplay] = React.useState(() =>
    formatDateToDDMMYYYY(new Date())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedType && selectedProduct) {
      let finalSN = '';
      if (snMode === 'single') finalSN = snSingle;
      else if (snMode === 'range') finalSN = `From ${snFrom} to ${snTo}`;
      else if (snMode === 'manual') finalSN = snManual;

      if (!finalSN) return alert('Por favor, introduzca el número de serie');

      const parsedDate = parseDDMMYYYY(emissionDateDisplay);
      if (!parsedDate) {
        return alert('La fecha no es válida. Use el formato dd/mm/aaaa (ejemplo: 22/04/2026).');
      }

      const type = certificateTypes.find(t => t.id === selectedType);
      const product = products.find(p => p.id === selectedProduct);
      onGenerate({ type, product, serialNumber: finalSN, date: toISODateString(parsedDate) });
    }
  };

  return (
    <div className="form-container">
      <h2>Generación de Certificados</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de Certificado:</label>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)} required>
            <option value="">Seleccione un tipo...</option>
            {certificateTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Producto / Equipo:</label>
          <SearchableSelect 
            options={products}
            value={selectedProduct}
            onChange={setSelectedProduct}
            placeholder="Escriba el código o nombre del producto..."
          />
        </div>

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

        <button type="submit" className="btn-primary">Generar Certificado</button>
      </form>
    </div>
  );
}
