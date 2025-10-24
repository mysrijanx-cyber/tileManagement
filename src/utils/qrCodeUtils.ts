

import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Tile } from '../types';

export const generateTileQRCode = async (tile: Tile): Promise<string> => {
  try {
    const qrData = {
      type: 'tile_viewer',
      tileId: tile.id,
      name: tile.name,
      category: tile.category,
      size: tile.size,
      price: tile.price,
      stock: tile.stock,
      sellerId: tile.sellerId,
      showroomId: tile.showroomId,
      tileCode: tile.tileCode,
      url: `${window.location.origin}/tile/${tile.id}`,
      roomSelectUrl: `${window.location.origin}/room-select/${tile.id}`,
      timestamp: new Date().toISOString()
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateBulkQRCodes = async (
  tiles: Tile[], 
  onProgress?: (progress: number) => void
): Promise<{ [tileId: string]: string }> => {
  const qrCodes: { [tileId: string]: string } = {};
  const total = tiles.length;
  
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    try {
      qrCodes[tile.id] = await generateTileQRCode(tile);
      
      // Progress callback
      if (onProgress) {
        onProgress(((i + 1) / total) * 100);
      }
      
      // Add small delay to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Failed to generate QR code for tile ${tile.id}:`, error);
    }
  }
  
  return qrCodes;
};

export const downloadQRCodesAsZip = async (
  tiles: Tile[], 
  businessName: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  const zip = new JSZip();
  const qrFolder = zip.folder('qr_codes');
  
  // Create enhanced CSV content
  const csvHeader = 'Tile Name,Tile Code,Size,Category,Price (₹),Stock,In Stock,QR Code File,Image URL,Texture URL,Created Date\n';
  let csvContent = csvHeader;
  
  const total = tiles.length;
  
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    
    if (tile.qrCode) {
      try {
        // Convert base64 to blob
        const qrCodeBlob = await fetch(tile.qrCode).then(res => res.blob());
        const fileName = `${(tile.tileCode || tile.name).replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
        
        qrFolder?.file(fileName, qrCodeBlob);
        
        // Add to CSV with all details
        csvContent += `"${tile.name}","${tile.tileCode || 'N/A'}","${tile.size}","${tile.category}","${tile.price}","${tile.stock}","${tile.inStock ? 'Yes' : 'No'}","${fileName}","${tile.imageUrl}","${tile.textureUrl || 'N/A'}","${tile.createdAt}"\n`;
        
        // Progress callback
        if (onProgress) {
          onProgress(((i + 1) / total) * 50); // 50% for processing
        }
      } catch (error) {
        console.error(`Error processing QR code for ${tile.name}:`, error);
      }
    }
  }
  
  // Add CSV to zip
  zip.file('tile_inventory.csv', csvContent);
  
  // Add comprehensive instructions
  const instructions = `
QR Code Package for ${businessName}
=====================================

📦 PACKAGE CONTENTS:
├── qr_codes/           → Individual QR code images
├── tile_inventory.csv  → Complete tile database
└── SETUP_GUIDE.txt     → This instruction file

🚀 QUICK SETUP GUIDE:

1. PRINT QR CODES:
   - Minimum size: 2x2 inches (5x5 cm)
   - Use high-quality printer (300 DPI or higher)
   - Print on durable sticker paper
   - Test print one QR code first

2. PLACEMENT:
   - Attach QR codes to physical tiles
   - Place in easily scannable locations
   - Avoid curved surfaces or corners
   - Ensure good lighting at placement area

3. CUSTOMER INSTRUCTIONS:
   - Inform customers about QR feature
   - Provide simple scanning instructions
   - Place "Scan QR Code" signage if needed

📱 HOW IT WORKS:

Customer Journey:
1. Customer sees tile in your showroom
2. Scans QR code with mobile camera
3. Tile information page opens instantly
4. Selects room type (Living/Bathroom/Kitchen/etc.)
5. Views tile in 3D room visualization
6. Can rotate, zoom, and interact with 3D view
7. Save favorites or share with family
8. Contact you directly for purchase

🔧 TECHNICAL FEATURES:

- Each QR code contains unique tile data
- Works with any QR scanner app
- No app installation required
- Fast loading 3D visualization
- Mobile-optimized interface
- Offline basic information access

📊 ANALYTICS AVAILABLE:

Track customer engagement:
- QR scan counts per tile
- Popular room selections
- Time spent in 3D view
- Customer interaction patterns
- Peak engagement hours

🆘 SUPPORT:

If you need assistance:
- Contact technical support
- Check online documentation
- Community forums available

💡 MARKETING TIPS:

- Promote QR feature to customers
- Use in social media marketing
- Include in business cards
- Mention in advertisements
- Train staff about the feature

Business: ${businessName}
Generated: ${new Date().toLocaleString()}
Total Tiles: ${tiles.length}
QR Codes: ${tiles.filter(t => t.qrCode).length}

© ${new Date().getFullYear()} Tile Visualization System
  `;
  
  zip.file('SETUP_GUIDE.txt', instructions);
  
  // Add quick reference card
  const quickRef = `
📱 QUICK REFERENCE CARD
======================

QR CODE SIZES:
• Minimum: 2x2 inches (5x5 cm)
• Recommended: 3x3 inches (7.5x7.5 cm)
• Maximum: 4x4 inches (10x10 cm)

PLACEMENT BEST PRACTICES:
✅ DO:
- Use corners or edges of tiles
- Ensure flat surface placement
- Keep QR codes clean and visible
- Test scan before customer display

❌ DON'T:
- Place on curved surfaces
- Cover with glass or plastic
- Use in dark areas
- Make them too small

CUSTOMER SCANNING TIPS:
1. Hold phone 6-8 inches from QR code
2. Ensure good lighting
3. Keep camera steady
4. Most phones auto-detect QR codes
5. If not, use camera app or QR scanner

TROUBLESHOOTING:
• Blurry QR codes → Reprint larger size
• Won't scan → Check lighting/distance
• Slow loading → Check internet connection
• Wrong tile shown → Verify QR placement

Generated: ${new Date().toLocaleDateString()}
  `;
  
  zip.file('QUICK_REFERENCE.txt', quickRef);
  
  // Generate and download zip
  if (onProgress) onProgress(75);
  
  const content = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  
  if (onProgress) onProgress(100);
  
  const fileName = `${businessName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Package_${new Date().toISOString().split('T')[0]}.zip`;
  saveAs(content, fileName);
};

export const validateQRCode = async (qrData: string): Promise<boolean> => {
  try {
    const parsed = JSON.parse(qrData);
    return parsed.type === 'tile_viewer' && parsed.tileId && parsed.url;
  } catch {
    return false;
  }
};

export const getQRCodeAnalytics = (tiles: Tile[]) => {
  const total = tiles.length;
  const withQR = tiles.filter(t => t.qrCode).length;
  const withoutQR = total - withQR;
  
  return {
    total,
    withQR,
    withoutQR,
    percentage: total > 0 ? Math.round((withQR / total) * 100) : 0
  };
};