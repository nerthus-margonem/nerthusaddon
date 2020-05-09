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
    let opacity
    if (hour < 12)
        opacity = -Math.pow(0.14 * hour - 1.29, 2) + 1
    else
        opacity = -Math.pow(0.1 * hour - 1.57, 2) + 1

    if (opacity < 0.3) opacity = 0.3
    else if (opacity > 1) opacity = 1

    return 1 - opacity
}

function getDarknessNiObject(opacity, color)
{
    return {
        draw: function (e)
        {
            const style = e.fillStyle
            e.fillStyle = color
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
        d: {},
        updateDATA: function () {}
    }
}

export function changeLight(opacity, color = '#000')
{
    if (INTERFACE === 'NI')
        addToNiDrawList(getDarknessNiObject(opacity, color), coordsToId(-1, -1))
    else
    {
        let $night = $('#nerthus-night')
        if (!$night.length)
            $night = $('<div id="nerthus-night"></div>').appendTo('#ground')

        $night.css({
            height: map.y * 32,
            width: map.x * 32,
            zIndex: map.y * 2 + 11,
            opacity: opacity,
            'background-color': color
        })
    }
}

export function checkAndApplyNight()
{
    if (settings.night)
    {
        const date = new Date()
        const dimValue = timeToOpacity(date)
        if (dimValue)
        {
            if (isCurrentMapOutdoor())
                changeLight(dimValue)
            else
                changeLight(0)

            turnLightsOn()
        }
    }
}

export function initNightManager()
{
    loadOnEveryMap(checkAndApplyNight)
}
