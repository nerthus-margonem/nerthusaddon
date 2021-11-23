import {loadOnEveryMap} from './game-integration/loaders'
import {getCurrentSeason} from './time'
import {default as basicMapsUrls} from '../res/configs/maps.json'
import {resolveUrl} from './utility-functions'
import {changeCustomStyle, removeCustomStyle} from './interface/css-manager'

export const MAP_PRIORITY = {CUSTOM: 2, CUSTOM_NO_ID: 1, BASIC: 0}

const currentMapImage = new Image()

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
    else if (basicMapsUrls.default[mapId])
        return basicMapsUrls.default[mapId]
    else
        return false
}


function applyMapChange(mapId)
{
    const mapImage = new Image()

    const basicMapUrl = getBasicMapUrl(mapId)
    if (customMapsUrls[mapId])
        mapImage.src = resolveUrl(customMapsUrls[mapId])
    else if (customMapNoIdUrl)
        mapImage.src = resolveUrl(customMapNoIdUrl)
    else if (basicMapUrl)
        mapImage.src = resolveUrl(basicMapUrl)

    currentMapImage.src = mapImage.src

    if (INTERFACE === 'SI')
    {
        // this way it's more robust than simply changing element's style
        if (mapImage.src)
            changeCustomStyle(
                'map-background-image',
                `#ground {
                    background-image: url(${mapImage.src}) !important; 
                    background-color: transparent !important;
                }`.replace(/ /g,'')
            )
        else
            removeCustomStyle('map-background-image')
    }
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
        if (currentMapImage.complete)
        {
            canvasRenderingContext.drawImage(
                currentMapImage,
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
        applyMapChange(window.map.id)
}


export function initMapsManager()
{
    if (INTERFACE === 'NI') startMapChanging()
    loadOnEveryMap(applyCurrentMapChange)
}
