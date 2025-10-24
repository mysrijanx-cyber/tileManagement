import * as XLSX from 'xlsx';
import { ExcelTileData } from '../types';

// Read and parse Excel file
export const readExcelFile = (file: File): Promise<ExcelTileData[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      reject(new Error('Please select a valid Excel file (.xlsx or .xls)'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      reject(new Error('File size too large. Please use a file smaller than 10MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
          throw new Error('Excel file contains no sheets');
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error('Excel sheet is empty or has no data rows');
        }

        const tiles: ExcelTileData[] = [];
        const errors: string[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2; // Account for header row
          
          try {
            // Handle different column name variations
            const name = getFieldValue(row, ['Name', 'name', 'Tile Name', 'tile_name']);
            const category = getFieldValue(row, ['Category', 'category']).toLowerCase();
            const size = getFieldValue(row, ['Size', 'size', 'Tile Size', 'tile_size']);
            const price = parseFloat(getFieldValue(row, ['Price', 'price']) || '0');
            const stock = parseInt(getFieldValue(row, ['Stock', 'stock', 'Quantity', 'quantity']) || '0');
            const tileCode = getFieldValue(row, ['Tile Code', 'tile_code', 'Code', 'code']) || 
                            `TC${Date.now()}${index}`;
            const imageUrl = getFieldValue(row, ['Image URL', 'imageUrl', 'image_url', 'Image']);
            const textureUrl = getFieldValue(row, ['Texture URL', 'textureUrl', 'texture_url', 'Texture']) || '';

            // Validation
            if (!name?.trim()) {
              errors.push(`Row ${rowNumber}: Name is required and cannot be empty`);
              return;
            }

            if (!['floor', 'wall', 'both'].includes(category)) {
              errors.push(`Row ${rowNumber}: Category must be 'floor', 'wall', or 'both'. Found: '${category}'`);
              return;
            }

            if (!size?.trim()) {
              errors.push(`Row ${rowNumber}: Size is required and cannot be empty`);
              return;
            }

            if (isNaN(price) || price < 0) {
              errors.push(`Row ${rowNumber}: Price must be a valid number greater than or equal to 0`);
              return;
            }

            if (isNaN(stock) || stock < 0) {
              errors.push(`Row ${rowNumber}: Stock must be a valid number greater than or equal to 0`);
              return;
            }

            if (!imageUrl?.trim()) {
              errors.push(`Row ${rowNumber}: Image URL is required and cannot be empty`);
              return;
            }

            if (!isValidUrl(imageUrl)) {
              errors.push(`Row ${rowNumber}: Image URL format is invalid. Must start with http:// or https://`);
              return;
            }

            if (textureUrl && !isValidUrl(textureUrl)) {
              errors.push(`Row ${rowNumber}: Texture URL format is invalid. Must start with http:// or https://`);
              return;
            }

            tiles.push({
              name: name.trim(),
              category: category as 'floor' | 'wall' | 'both',
              size: size.trim(),
              price,
              stock,
              tileCode: tileCode.trim(),
              imageUrl: imageUrl.trim(),
              textureUrl: textureUrl.trim()
            });

          } catch (error: any) {
            errors.push(`Row ${rowNumber}: Error processing row - ${error.message}`);
          }
        });

        if (errors.length > 0) {
          reject(new Error(`Validation errors found:\n${errors.join('\n')}`));
          return;
        }

        if (tiles.length === 0) {
          reject(new Error('No valid tile data found in Excel file'));
          return;
        }

        resolve(tiles);
      } catch (error: any) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file. Please try again.'));
    reader.readAsArrayBuffer(file);
  });
};

// Helper function to get field value from different possible column names
const getFieldValue = (row: any, fieldNames: string[]): string => {
  for (const fieldName of fieldNames) {
    if (row[fieldName] !== undefined && row[fieldName] !== null) {
      return String(row[fieldName]).trim();
    }
  }
  return '';
};

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Download Excel template
export const downloadExcelTemplate = () => {
  const templateData = [
    {
      'Name': 'Marble White Elite',
      'Category': 'both',
      'Size': '60x60 cm',
      'Price': 2500,
      'Stock': 100,
      'Tile Code': 'MWE001',
      'Image URL': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=500',
      'Texture URL': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=500'
    },
    {
      'Name': 'Dark Wood Pattern',
      'Category': 'floor',
      'Size': '20x120 cm',
      'Price': 1800,
      'Stock': 50,
      'Tile Code': 'DWP002',
      'Image URL': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      'Texture URL': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
    },
    {
      'Name': 'Modern Gray Stone',
      'Category': 'both',
      'Size': '30x60 cm',
      'Price': 2200,
      'Stock': 75,
      'Tile Code': 'MGS003',
      'Image URL': 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=500',
      'Texture URL': 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=500'
    },
    {
      'Name': 'Ceramic Subway White',
      'Category': 'wall',
      'Size': '10x30 cm',
      'Price': 1200,
      'Stock': 200,
      'Tile Code': 'CSW004',
      'Image URL': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500',
      'Texture URL': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500'
    },
    {
      'Name': 'Polished Concrete',
      'Category': 'floor',
      'Size': '80x80 cm',
      'Price': 2800,
      'Stock': 25,
      'Tile Code': 'PC005',
      'Image URL': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=500',
      'Texture URL': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=500'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  
  // Set column widths for better readability
  const wscols = [
    { wch: 25 }, // Name
    { wch: 12 }, // Category
    { wch: 15 }, // Size
    { wch: 10 }, // Price
    { wch: 8 },  // Stock
    { wch: 15 }, // Tile Code
    { wch: 50 }, // Image URL
    { wch: 50 }  // Texture URL
  ];
  ws['!cols'] = wscols;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tiles');
  
  // Add instructions sheet
  const instructionsData = [
    { 
      'Field Name': 'Name', 
      'Required': 'Yes', 
      'Description': 'Tile product name', 
      'Example': 'Marble White Elite',
      'Notes': 'Should be unique and descriptive'
    },
    { 
      'Field Name': 'Category', 
      'Required': 'Yes', 
      'Description': 'Where tile can be used', 
      'Example': 'both',
      'Notes': 'Must be: floor, wall, or both'
    },
    { 
      'Field Name': 'Size', 
      'Required': 'Yes', 
      'Description': 'Tile dimensions', 
      'Example': '60x60 cm',
      'Notes': 'Include units (cm, mm, inches)'
    },
    { 
      'Field Name': 'Price', 
      'Required': 'Yes', 
      'Description': 'Price per piece in rupees', 
      'Example': '2500',
      'Notes': 'Numbers only, no currency symbols'
    },
    { 
      'Field Name': 'Stock', 
      'Required': 'Yes', 
      'Description': 'Available quantity', 
      'Example': '100',
      'Notes': 'Whole numbers only'
    },
    { 
      'Field Name': 'Tile Code', 
      'Required': 'No', 
      'Description': 'Unique identifier', 
      'Example': 'MWE001',
      'Notes': 'Auto-generated if empty'
    },
    { 
      'Field Name': 'Image URL', 
      'Required': 'Yes', 
      'Description': 'Main product image link', 
      'Example': 'https://example.com/image.jpg',
      'Notes': 'Must be valid HTTP/HTTPS URL'
    },
    { 
      'Field Name': 'Texture URL', 
      'Required': 'No', 
      'Description': 'Texture pattern image link', 
      'Example': 'https://example.com/texture.jpg',
      'Notes': 'Optional, but recommended for 3D view'
    }
  ];
  
  const instructionsWs = XLSX.utils.json_to_sheet(instructionsData);
  const instrCols = [
    { wch: 15 }, // Field Name
    { wch: 10 }, // Required
    { wch: 30 }, // Description
    { wch: 30 }, // Example
    { wch: 35 }  // Notes
  ];
  instructionsWs['!cols'] = instrCols;
  
  XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instructions');
  
  // Add common sizes reference
  const sizesData = [
    { 'Category': 'Floor Tiles', 'Common Sizes': '30x30 cm, 40x40 cm, 60x60 cm, 80x80 cm, 100x100 cm' },
    { 'Category': 'Wall Tiles', 'Common Sizes': '20x20 cm, 25x40 cm, 30x30 cm, 30x60 cm' },
    { 'Category': 'Subway Tiles', 'Common Sizes': '7.5x15 cm, 10x30 cm, 6x25 cm' },
    { 'Category': 'Wood Look', 'Common Sizes': '15x90 cm, 20x120 cm, 25x150 cm' },
    { 'Category': 'Large Format', 'Common Sizes': '60x120 cm, 75x75 cm, 120x120 cm' }
  ];
  
  const sizesWs = XLSX.utils.json_to_sheet(sizesData);
  XLSX.utils.book_append_sheet(wb, sizesWs, 'Common Sizes');
  
  XLSX.writeFile(wb, 'tile_upload_template.xlsx');
};

// Validate tile data
export const validateTileData = (tiles: ExcelTileData[]): { valid: ExcelTileData[], errors: string[] } => {
  const valid: ExcelTileData[] = [];
  const errors: string[] = [];
  const usedCodes = new Set<string>();
  const usedNames = new Set<string>();

  tiles.forEach((tile, index) => {
    const rowNumber = index + 2;
    const rowErrors: string[] = [];

    // Name validation
    if (!tile.name?.trim()) {
      rowErrors.push(`Row ${rowNumber}: Name is required`);
    } else if (usedNames.has(tile.name.toLowerCase())) {
      rowErrors.push(`Row ${rowNumber}: Duplicate tile name "${tile.name}"`);
    } else {
      usedNames.add(tile.name.toLowerCase());
    }

    // Category validation
    if (!['floor', 'wall', 'both'].includes(tile.category)) {
      rowErrors.push(`Row ${rowNumber}: Invalid category "${tile.category}"`);
    }

    // Size validation
    if (!tile.size?.trim()) {
      rowErrors.push(`Row ${rowNumber}: Size is required`);
    }

    // Price validation
    if (tile.price < 0) {
      rowErrors.push(`Row ${rowNumber}: Price cannot be negative`);
    }

    // Stock validation
    if (tile.stock < 0) {
      rowErrors.push(`Row ${rowNumber}: Stock cannot be negative`);
    }

    // Tile code validation
    if (tile.tileCode && usedCodes.has(tile.tileCode)) {
      rowErrors.push(`Row ${rowNumber}: Duplicate tile code "${tile.tileCode}"`);
    } else if (tile.tileCode) {
      usedCodes.add(tile.tileCode);
    }

    // URL validations
    if (!tile.imageUrl?.trim()) {
      rowErrors.push(`Row ${rowNumber}: Image URL is required`);
    } else if (!isValidUrl(tile.imageUrl)) {
      rowErrors.push(`Row ${rowNumber}: Invalid Image URL format`);
    }

    if (tile.textureUrl && !isValidUrl(tile.textureUrl)) {
      rowErrors.push(`Row ${rowNumber}: Invalid Texture URL format`);
    }

    if (rowErrors.length === 0) {
      valid.push(tile);
    } else {
      errors.push(...rowErrors);
    }
  });

  return { valid, errors };
};

// Additional helper functions
export const getExcelColumnLetter = (columnIndex: number): string => {
  let result = '';
  while (columnIndex >= 0) {
    result = String.fromCharCode(65 + (columnIndex % 26)) + result;
    columnIndex = Math.floor(columnIndex / 26) - 1;
  }
  return result;
};

export const formatExcelError = (error: string, row: number, column?: number): string => {
  const location = column ? `${getExcelColumnLetter(column)}${row}` : `Row ${row}`;
  return `${location}: ${error}`;
};

// Export data back to Excel
export const exportTilesToExcel = (tiles: any[], filename: string = 'tiles_export.xlsx') => {
  const exportData = tiles.map(tile => ({
    'Name': tile.name,
    'Category': tile.category,
    'Size': tile.size,
    'Price': tile.price,
    'Stock': tile.stock,
    'Tile Code': tile.tileCode || '',
    'Image URL': tile.imageUrl,
    'Texture URL': tile.textureUrl || '',
    'In Stock': tile.inStock ? 'Yes' : 'No',
    'Created': tile.createdAt ? new Date(tile.createdAt).toLocaleDateString() : '',
    'Updated': tile.updatedAt ? new Date(tile.updatedAt).toLocaleDateString() : ''
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tiles');
  
  XLSX.writeFile(wb, filename);
};

// Convert CSV to Excel format
export const csvToExcel = (csvContent: string, filename: string = 'converted.xlsx') => {
  const lines = csvContent.split('\n');
  const data = lines.map(line => line.split(','));
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  XLSX.writeFile(wb, filename);
};