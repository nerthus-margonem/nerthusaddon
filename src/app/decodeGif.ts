import { GifReader } from "omggif";

enum GIF_FRAME_DISPOSAL {
  NON_SPECIFIED = 0,
  DO_NOT_DISPOSE = 1,
  RESTORE_TO_BACKGROUND = 2,
  RESTORE_TO_PREVIOUS = 3,
}

export interface DecodedGif {
  frameDelays: number[];
  frameData: Uint8ClampedArray<ArrayBuffer>[];
  frameDisposal: number[];
  width: number;
  height: number;
}

export async function decodeGifFromUrl(url: string): Promise<DecodedGif> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const array = new Uint8Array(buffer);
  return decodeGif(array);
}

export function decodeGif(data: Uint8Array): DecodedGif {
  const reader = new GifReader(data);

  const decoded: DecodedGif = {
    frameDelays: [],
    frameData: [],
    frameDisposal: [],
    width: reader.width,
    height: reader.height,
  };
  let oldFrame = new Uint8ClampedArray(reader.width * reader.height * 4);
  for (let i = 0; i < reader.numFrames(); i++) {
    const frameInfo = reader.frameInfo(i);
    decoded.frameDelays[i] = frameInfo.delay;
    decoded.frameDisposal[i] = frameInfo.disposal;

    // Draw a frame on top of the old frame
    const frame = new Uint8ClampedArray(oldFrame);
    reader.decodeAndBlitFrameRGBA(i, frame);
    decoded.frameData[i] = frame;

    // Dispose drawn frame for the next draw
    switch (decoded.frameDisposal[i]) {
      case GIF_FRAME_DISPOSAL.NON_SPECIFIED:
      case GIF_FRAME_DISPOSAL.DO_NOT_DISPOSE: {
        oldFrame = frame;
        break;
      }
      case GIF_FRAME_DISPOSAL.RESTORE_TO_BACKGROUND: {
        // Copy the frame and clear the area it painted to transparency
        oldFrame = new Uint8ClampedArray(frame);
        const endY = Math.min(frameInfo.y + frameInfo.height, reader.height);
        for (let y = frameInfo.y; y < endY; y++) {
          const row = y * reader.width;
          oldFrame.fill(
            0,
            4 * (row + frameInfo.x),
            4 * (row + frameInfo.x + frameInfo.width),
          );
        }
        break;
      }
      case GIF_FRAME_DISPOSAL.RESTORE_TO_PREVIOUS: {
        // Next oldFrame is the same as current oldFrame
        break;
      }
    }
  }
  return decoded;
}
