import {default as exceptionMaps} from '../../res/configs/map-exceptions'
import {settings} from '../settings'
import {addToNIdrawList, loadOnEveryMap} from '../game-integration/loaders'
import {turnLightsOn} from './lights'

/**
 * @param time - Date
 * @returns {number}
 */
function timeToOpacity(time)
{
    const hour = time.getHours()
    //const hour = new Date().getHours()
    if (hour <= 4) return 0.8
    if (hour >= 21) return 0.6
    if (hour >= 18) return 0.3
    return 0
}

function getDarknessNiObject(opacity)
{
    return {
        draw: function (e)
        {
            const style = e.fillStyle
            e.fillStyle = '#000'
            e.globalAlpha = opacity
            e.fillRect(0 - Engine.map.offset[0], 0 - Engine.map.offset[1], Engine.map.width, Engine.map.height)
            e.globalAlpha = 1.0
            e.fillStyle = style
        },
        getOrder: function ()
        {
            return 950 // Darkness bellow lights but above everything else
        }
    }
}

function changeLight(opacity)
{
    if (INTERFACE === 'NI')
        addToNIdrawList(getDarknessNiObject(opacity))
    else
    {
        let $night = $('#nerthus-night')
        if (!$night.length)
            $night = $('<div id="nerthus-night"></div>').appendTo('#ground')

        $night.css({
            height: map.y * 32,
            width: map.x * 32,
            zIndex: map.y * 2 + 11,
            opacity: opacity
        })
    }
}

function dim(opacity)
{
    let id
    let mainid
    if (INTERFACE === 'NI')
    {
        console.log('DIM NI MAP: ' + Engine.map.d.id)
        mainid = Engine.map.d.mainid
        id = Engine.map.d.id
    }
    else
    {
        mainid = map.mainid
        id = map.id
    }
    if ((mainid === 0 && !exceptionMaps.indoor.includes(id)) || exceptionMaps.outdoor.includes(id))
        changeLight(opacity)
    else
        changeLight(0)
}

function checkAndApplyNight()
{
    if (settings['night'])
    {
        const date = new Date()
        const dimValue = timeToOpacity(date)
        if (dimValue)
        {
            dim(dimValue)
            turnLightsOn()
        }
    }
}

export function initNightManager()
{
    loadOnEveryMap(checkAndApplyNight)
    // if (INTERFACE === 'NI')
    // {
    //     onDefined('Engine.map.d.id', () =>
    //     {
    //         checkAndApplyNight()
    //         loadOnEveryMap(checkAndApplyNight)
    //     })
    // }
    // else
    // {
    //     loadOnEveryMap(checkAndApplyNight)
    // }
}
