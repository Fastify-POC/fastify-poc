import { Readable } from 'stream';

export function destroyStream(stream: Readable): void {
  if (!stream.destroyed) {
    stream.destroy();
  }
}
