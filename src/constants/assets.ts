import path from 'path';

export const ALLOWED_ASSET_EXTENSION_OBJ = {
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png'
} as const;

export const ALLOWED_ASSET_EXTENSIONS = Object.values(
  ALLOWED_ASSET_EXTENSION_OBJ
);

export const ASSET_DIR = path.join(process.cwd(), 'assets');
