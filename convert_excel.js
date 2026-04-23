
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const EXCEL_PATH = 'c:/Users/Usuario/Documents/Antigravity/App_certificates/src/data/Articulos certificados.xlsx';
const OUTPUT_PATH = 'c:/Users/Usuario/Documents/Antigravity/App_certificates/src/data/products.json';

try {
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Processing ${rawData.length} records...`);
    
    const processedData = rawData.map((item, index) => ({
        id: String(item['Aticulo'] || `auto-${index}`),
        code: String(item['Aticulo'] || ''),
        esDesc: String(item['Descripción ESP'] || ''),
        enDesc: String(item['Descripción ENG'] || '')
    })).filter(p => p.code); // Filter out empty rows if any

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(processedData, null, 2));
    console.log(`Successfully converted to ${OUTPUT_PATH}`);
} catch (error) {
    console.error('Error during conversion:', error.message);
    process.exit(1);
}
