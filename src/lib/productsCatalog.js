import { products as bundledProducts } from '../products.js';

const API_BASE =
  typeof window !== 'undefined' && window.location.protocol.startsWith('http')
    ? ''
    : 'http://localhost:3789';
const STORAGE_KEY = 'app-certificates-custom-products';

function readLocalProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalProducts(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function mergeProducts(baseProducts, extraProducts) {
  const merged = [...baseProducts];
  for (const item of extraProducts) {
    const index = merged.findIndex((p) => p.code === item.code);
    if (index >= 0) merged[index] = { ...merged[index], ...item };
    else merged.push(item);
  }
  return merged;
}

export function getMergedProducts(baseProducts = bundledProducts) {
  return mergeProducts(baseProducts, readLocalProducts());
}

export async function fetchCatalogProducts() {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) throw new Error('No se pudo cargar el catálogo');
    return await response.json();
  } catch {
    return getMergedProducts();
  }
}

export async function persistProduct(product) {
  const normalized = {
    id: product.code.trim(),
    code: product.code.trim(),
    esDesc: product.esDesc.trim(),
    enDesc: product.enDesc.trim(),
  };

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudo guardar el artículo');
    return { product: data, persistedToServer: true };
  } catch (error) {
    const local = readLocalProducts();
    const index = local.findIndex((p) => p.code === normalized.code);
    if (index >= 0) local[index] = normalized;
    else local.push(normalized);
    writeLocalProducts(local);
    return {
      product: normalized,
      persistedToServer: false,
      warning: error.message,
    };
  }
}
