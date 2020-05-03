import {settings} from '../settings'
import {addToNiDrawList, loadOnEveryMap} from '../game-integration/loaders'
import {turnLightsOn} from './lights'
import {coordsToId, isCurrentMapOutdoor} from '../utility-functions'

/**
 * @param time - Date
 * @returns {number}
 */
function timeToOpacity(time)
{
    const hour = time.getHours()
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
        },
        update: function () {},
        d: {}
    }
}

function changeLight(opacity)
{
    if (INTERFACE === 'NI')
        addToNiDrawList(getDarknessNiObject(opacity), coordsToId(-1, -1))
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
    if (isCurrentMapOutdoor())
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
}
