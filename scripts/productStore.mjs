import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const JSON_PATH = path.join(ROOT, 'src/data/products.json');
const EXCEL_PATH = path.join(ROOT, 'src/data/Articulos certificados.xlsx');

function normalizeProduct({ code, esDesc, enDesc }) {
  const trimmedCode = String(code || '').trim();
  return {
    id: trimmedCode,
    code: trimmedCode,
    esDesc: String(esDesc || '').trim(),
    enDesc: String(enDesc || '').trim(),
  };
}

export function loadProducts() {
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveProductsJson(products) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
}

function appendToExcel(product) {
  if (!fs.existsSync(EXCEL_PATH)) return;

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const existingIndex = rows.findIndex(
    (row) => String(row.Aticulo || row.Articulo || '').trim() === product.code
  );

  const rowData = {
    Aticulo: product.code,
    'Descripción ESP': product.esDesc,
    'Descripción ENG': product.enDesc,
  };

  if (existingIndex >= 0) {
    rows[existingIndex] = { ...rows[existingIndex], ...rowData };
  } else {
    rows.push(rowData);
  }

  const newSheet = XLSX.utils.json_to_sheet(rows);
  workbook.Sheets[sheetName] = newSheet;
  XLSX.writeFile(workbook, EXCEL_PATH);
}

export function addProduct(input) {
  const product = normalizeProduct(input);
  if (!product.code || !product.esDesc || !product.enDesc) {
    throw new Error('Código y descripciones son obligatorios.');
  }

  const products = loadProducts();
  const existingIndex = products.findIndex((p) => p.code === product.code);

  if (existingIndex >= 0) {
    products[existingIndex] = { ...products[existingIndex], ...product };
  } else {
    products.push(product);
  }

  saveProductsJson(products);
  appendToExcel(product);

  return product;
}
