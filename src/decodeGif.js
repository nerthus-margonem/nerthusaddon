import {GifReader} from 'omggif'

export const GIF_FRAME_DISPOSAL = {
    NON_SPECIFIED: 0,
    DO_NOT_DISPOSE: 1,
    RESTORE_TO_BACKGROUND: 2,
    RESTORE_TO_PREVIOUS: 3
}

export function decodeGif(data)
{
    const reader = new GifReader(data)

    const decoded = {
        frameDelays: [],
        frameData: [],
        frameDisposal: [],
        width: reader.width,
        height: reader.height
    }
    let oldFrame = new Uint8ClampedArray(reader.width * reader.height * 4)
    for (let i = 0; i < reader.numFrames(); i++)
    {
        const frameInfo = reader.frameInfo(i)
        decoded.frameDelays[i] = frameInfo.delay
        decoded.frameDisposal[i] = frameInfo.disposal

        // Draw a frame on top of old frame
        const frame = new Uint8ClampedArray(oldFrame)
        reader.decodeAndBlitFrameRGBA(i, frame)
        decoded.frameData[i] = frame

        // Dispose drawn frame for next draw
        switch (decoded.frameDisposal[i])
        {
            case GIF_FRAME_DISPOSAL.NON_SPECIFIED:
            case GIF_FRAME_DISPOSAL.DO_NOT_DISPOSE:
            {
                oldFrame = frame
                break
            }
            case GIF_FRAME_DISPOSAL.RESTORE_TO_BACKGROUND:
            {
                // Copy the frame and clear the area it painted to transparency
                oldFrame = new Uint8ClampedArray(frame)
                for (let i = frameInfo.x; i < frameInfo.x + frameInfo.width; i++)
                {
                    for (let j = frameInfo.y; j < frameInfo.y + frameInfo.height; j++)
                    {
                        for (let k = 0; k < 4; k++)
                        {
                            oldFrame[4 * i + 4 * (j * reader.width) + k] = 0
                        }
                    }
                }
                break
            }
            case GIF_FRAME_DISPOSAL.RESTORE_TO_PREVIOUS:
            {
                oldFrame = new Uint8ClampedArray(oldFrame)
            }
        }
    }
    return decoded
}