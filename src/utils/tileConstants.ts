// ═══════════════════════════════════════════════════════════════
// ✅ TILE SURFACE & MATERIAL CONSTANTS
// Production Ready v1.0 - TypeScript Fixed
// ═══════════════════════════════════════════════════════════════

/**
 * Predefined Tile Surface Finish Options
 */
export const TILE_SURFACES = [
  'Polished',
  'Step Side',
  'Matt',
  'Carving',
  'High Gloss',
  'Metallic',
  'Sugar',
  'Glue',
  'Punch'
];

/**
 * Predefined Tile Material Options
 */
export const TILE_MATERIALS = [
  'Slabs',
  'GVT & PGVT',
  'Double Charge',
  'Counter Tops',
  'Full Body',
  'Ceramic',
  'Mosaic',
  'Subway'
];

/**
 * Validate if surface value is valid
 * @param surface - Surface value to validate
 * @returns boolean
 */
export const isValidTileSurface = (surface: string): boolean => {
  if (!surface || typeof surface !== 'string') return false;
  return TILE_SURFACES.includes(surface.trim());
};

/**
 * Validate if material value is valid
 * @param material - Material value to validate
 * @returns boolean
 */
export const isValidTileMaterial = (material: string): boolean => {
  if (!material || typeof material !== 'string') return false;
  return TILE_MATERIALS.includes(material.trim());
};

/**
 * Get surface icon
 */
export const getSurfaceIcon = (): string => '🔘';

/**
 * Get material icon
 */
export const getMaterialIcon = (): string => '🧱';

/**
 * Get all surface options (for dropdowns)
 */
export const getSurfaceOptions = (): string[] => [...TILE_SURFACES];

/**
 * Get all material options (for dropdowns)
 */
export const getMaterialOptions = (): string[] => [...TILE_MATERIALS];