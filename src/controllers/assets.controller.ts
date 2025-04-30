import { ALLOWED_ASSET_EXTENSION_OBJ, ASSET_DIR } from '@/constants/assets';
import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';

export default class AssetController {
  constructor() {
    this.initializeAssetDirectory();
  }

  private initializeAssetDirectory(): void {
    if (!fs.existsSync(ASSET_DIR)) {
      fs.mkdirSync(ASSET_DIR, { recursive: true });
    }
  }

  public static async getImageByQuery(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const { filename } = req.query as { filename: string };
    const imageFilePath = path.join(ASSET_DIR, filename);

    try {
      if (!fs.existsSync(imageFilePath)) {
        reply.code(404);

        return {
          message: 'File not found'
        };
      }

      const fileExtension = path
        .extname(filename)
        .toLowerCase()
        .slice(1) as keyof typeof ALLOWED_ASSET_EXTENSION_OBJ;
      const contentType = `image/${ALLOWED_ASSET_EXTENSION_OBJ[fileExtension]}`;

      reply.type(contentType);

      return fs.createReadStream(imageFilePath);
    } catch (error) {
      req.log.error(error);
      reply.code(500);
    }
  }
}
