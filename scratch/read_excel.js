
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

try {
    const workbook = XLSX.readFile('c:/Users/Usuario/Documents/Antigravity/App_certificates/src/data/Articulos certificados.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
} catch (error) {
    console.error('Error reading Excel file:', error.message);
}
