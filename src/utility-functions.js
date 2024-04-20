import {GifReader} from 'omggif'
import {default as exceptionMaps} from '../res/configs/map-exceptions.json'

export const GIF_FRAME_DISPOSAL = {
    NON_SPECIFIED: 0,
    DO_NOT_DISPOSE: 1,
    RESTORE_TO_BACKGROUND: 2,
    RESTORE_TO_PREVIOUS: 3
}

/**
 * Function that takes coordinates and turns them to nerthus-specific ID.
 * NI requires such id in several cases, and really big number makes sure,
 * that (game npcs usually have id's that are few millions lower than that)
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
export function coordsToId(x, y)
{
    return 50000000 + (x * 1000) + y
}

export function resolveUrl(url)
{
    if (url.startsWith('/')) url = 'https://micc.garmory-cdn.cloud' + url
    return url.replace(/^#/, FILE_PREFIX)
}

export function pseudoRandom(seed)
{
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
}

export function isMapOutdoor(map)
{
    return !!((map.mainid === 0 && !exceptionMaps.indoor.includes(map.id))
        || exceptionMaps.outdoor.includes(map.id)
    )
}

export function isCurrentMapOutdoor()
{
    if (INTERFACE === 'NI')
    {
        return isMapOutdoor(Engine.map.d)
    }
    else
    {
        return isMapOutdoor(map)
    }
}

export function addDraggable($elm, handle = false)
{
    $elm.draggable({
        handle,
        start()
        {
            const lock = window.g ? window.g.lock : window.Engine.lock
            lock.add('nerthus-panel-drag')
        },
        stop()
        {
            const lock = window.g ? window.g.lock : window.Engine.lock
            lock.remove('nerthus-panel-drag')
        }
    })
}

export function sanitizeText(text)
{
    const element = document.createElement('div')
    element.innerText = text
    return element.innerHTML
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
