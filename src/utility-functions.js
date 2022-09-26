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
    for (let i = 0; i < reader.numFrames(); i++)
    {
        const {delay, disposal} = reader.frameInfo(i)
        decoded.frameDelays[i] = {delay}
        decoded.frameDisposal[i] = disposal

        const frameData = new Uint8ClampedArray(reader.width * reader.height * 4)
        reader.decodeAndBlitFrameRGBA(i, frameData)
        decoded.frameData[i] = frameData
    }
    return decoded
}
