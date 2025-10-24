/*
  # Add QR Code support to tiles table

  1. New Columns
    - `qr_code` - Base64 encoded QR code image data
    - `qr_code_url` - Optional URL for QR code access

  2. Updates
    - Add columns to existing tiles table
    - Update indexes for better performance
*/

-- Add QR code columns to tiles table
-- upadted

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tiles' AND column_name = 'qr_code'
  ) THEN
    ALTER TABLE tiles ADD COLUMN qr_code text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tiles' AND column_name = 'qr_code_url'
  ) THEN
    ALTER TABLE tiles ADD COLUMN qr_code_url text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tiles_qr_code ON tiles(qr_code) WHERE qr_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tiles_qr_code_url ON tiles(qr_code_url) WHERE qr_code_url IS NOT NULL;

DROP POLICY IF EXISTS "QR codes are publicly accessible" ON tiles;

CREATE POLICY "QR codes are publicly accessible"
  ON tiles
  FOR SELECT
  TO public
  USING (qr_code IS NOT NULL OR qr_code_url IS NOT NULL);