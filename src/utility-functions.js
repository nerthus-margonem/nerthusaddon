import {default as exceptionMaps} from '../res/configs/map-exceptions.json'

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

export function addDraggable($elm)
{
    $elm.draggable({
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

export function getCurrentMapId()
{
    if (INTERFACE === 'NI')
    {
        return Engine.map.d.id
    }
    else
    {
        return map.id
    }
}
