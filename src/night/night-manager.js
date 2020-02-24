import * as exceptionMaps from '../res/outdoor-map-exceptions'
import {settings} from '../settings'
import {addToNIdrawList, loadOnEveryMap, onDefined} from '../game-integration/loaders'
import {turnLightsOn} from './lights'

/**
 * @param time - Date
 * @returns {number}
 */
function timeToOpacity(time)
{
    return 0.6
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
        mainid = Engine.map.d.mainid
        id = Engine.map.d.id
    }
    else
    {
        mainid = map.mainid
        id = map.id
    }
    if (mainid === 0 && !exceptionMaps.indoor.contains(id) || exceptionMaps.outdoor.contains(id))
    {
        changeLight(opacity)
    }

}


function checkAndApplyNight()
{
    if (settings['night'])
    {
        const date = new Date()
        const dimValue = timeToOpacity(date)
        if (dimValue)
        {
            dim()
            turnLightsOn()
        }
    }
}

export function initNightManager()
{
    if (INTERFACE === 'NI')
    {
        onDefined('Engine.map.d.id', () =>
        {
            checkAndApplyNight()
            loadOnEveryMap(checkAndApplyNight)
        })
    }
    else
    {
        checkAndApplyNight()
        loadOnEveryMap(checkAndApplyNight)
    }
}

//
// nerthus.night.lights.give_me_the_light = function ()
// {
//     $.getScript(nerthus.addon.fileUrl('/NN_night_lights_mgr.js'))
// }
