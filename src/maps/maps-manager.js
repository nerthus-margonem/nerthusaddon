import {loadOnEveryMap} from '../game-integration/loaders'
import {getCurrentSeason} from '../time'
import * as basicMapsUrls from '../res/map-config'
import {resolveNerthusUrl} from '../utility-functions'

export const MAP_PRIORITY = {CUSTOM: 2, CUSTOM_NO_ID: 1, BASIC: 0}

let currentTopMap

let customMapNoIdUrl
const customMapsUrls = {}

export function addToMapChangelist(url, priority, mapId)
{
    switch (priority)
    {
        case MAP_PRIORITY.CUSTOM:
            customMapsUrls[mapId] = url
            return
        case MAP_PRIORITY.CUSTOM_NO_ID:
            customMapNoIdUrl = url
            return
    }
}

export function removeFromMapChangelist(priority, mapId)
{
    switch (priority)
    {
        case MAP_PRIORITY.CUSTOM:
            delete customMapsUrls[mapId]
            return
        case MAP_PRIORITY.CUSTOM_NO_ID:
            customMapNoIdUrl = ''
            return
    }
}

function getBasicMapUrl(mapId)
{
    const season = getCurrentSeason()
    if (basicMapsUrls[season][mapId])
        return basicMapsUrls[season][mapId]
    else if (basicMapsUrls.DEFAULT[mapId])
        return basicMapsUrls.DEFAULT[mapId]
    else
        return false
}


function applyMapChange(mapId)
{
    const mapImage = new Image()

    const basicMapUrl = getBasicMapUrl(mapId)
    if (customMapsUrls[mapId])
        mapImage.src = resolveNerthusUrl(customMapsUrls[mapId])
    else if (customMapNoIdUrl)
        mapImage.src = resolveNerthusUrl(customMapNoIdUrl)
    else if (basicMapUrl)
        mapImage.src = resolveNerthusUrl(basicMapUrl)
    else
        mapImage.src = ''

    currentTopMap = mapImage

    if (INTERFACE !== 'NI')
        $('#ground').css('background', 'url(' + mapImage.src + ')')
}


function startMapChanging()
{
    //manipulation of map
    const tmpMapDraw = Engine.map.draw
    Engine.map.draw = function (canvasRenderingContext)
    {
        //draw normal map
        tmpMapDraw.call(Engine.map, canvasRenderingContext)

        //draw new maps on top of map
        if (currentTopMap)
        {
            canvasRenderingContext.drawImage(
                currentTopMap,
                0 - Engine.map.offset[0],
                0 - Engine.map.offset[1])

            //draw goMark (red X on ground that shows you where you've clicked)
            if (Engine.map.goMark)
                Engine.map.drawGoMark(canvasRenderingContext)
        }
    }
}


export function applyCurrentMapChange()
{
    if (INTERFACE === 'NI')
        applyMapChange(Engine.map.d.id)
    else
        applyMapChange(map.id)
}


export function initMapsManager()
{
    if (INTERFACE === 'NI') startMapChanging()
    loadOnEveryMap(applyCurrentMapChange)
}
