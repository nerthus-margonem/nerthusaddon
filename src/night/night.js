import {settings} from '../settings'
import {addToNiDrawList, loadOnEveryMap} from '../game-integration/loaders'
import {lightsOn, resetLights, turnLightsOn} from './lights'
import {coordsToId, isCurrentMapOutdoor} from '../utility-functions'
import {addSettingToPanel} from '../interface/panel'

let opacityChange = 0
const forcedParameters = {}

/**
 * @param time - Date
 * @returns {number}
 */
function timeToOpacity(time)
{
    if (!settings.night) return 0

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
        draw(e)
        {
            const style = e.fillStyle
            e.fillStyle = color
            e.globalAlpha = opacity
            e.fillRect(0 - Engine.map.offset[0], 0 - Engine.map.offset[1], Engine.map.width, Engine.map.height)
            e.globalAlpha = 1.0
            e.fillStyle = style
        },
        getOrder()
        {
            return 950 // Darkness bellow lights but above everything else
        },
        update() {},
        d: {},
        updateDATA() {},
        alwaysDraw: true,
        getFollowController()
        {
            return {
                checkFollowGlow: () => false
            }
        }
    }
}

export function setForcedParameters(opacity, color, mapId = 'default')
{
    if (!opacity || opacity === 'reset') forcedParameters[mapId] = ''
    else forcedParameters[mapId] = {
        opacity: opacity,
        color: color
    }
}

function getCurrentForcedParameters()
{
    let parameters = {
        opacity: -1,
        color: '#000'
    }
    if (forcedParameters[CURRENT_MAP_ID]) parameters = forcedParameters[CURRENT_MAP_ID]
    else if (forcedParameters.default) parameters = forcedParameters.default

    return parameters
}

function getCurrentNaturalOpacity()
{
    if (!isCurrentMapOutdoor()) return 0

    let opacity = timeToOpacity(new Date())
    opacity = opacity + opacityChange

    return opacity
}

export function changeLight(opacity = getCurrentNaturalOpacity(), color = '#000')
{
    opacity = Math.min(Math.max(0, opacity), 1)

    if (INTERFACE === 'NI')
    {
        addToNiDrawList(getDarknessNiObject(opacity, color), coordsToId(-1, -1))
        return
    }

    let $night = $('#nerthus-night')
    if (!$night.length)
        $night = $('<div id="nerthus-night"></div>').appendTo('#ground')

    $night.css({
        height: map.y * 32,
        width: map.x * 32,
        zIndex: map.y * 2 + 12,
        opacity: opacity,
        'background-color': color
    })
}


export function applyCurrentNight()
{
    let opacity = getCurrentNaturalOpacity()
    let color = '#000'

    const currentForcedParameters = getCurrentForcedParameters()
    if (currentForcedParameters.opacity !== -1)
    {
        opacity = currentForcedParameters.opacity
        color = currentForcedParameters.color
    }

    if (opacity <= 0.2) resetLights()
    else if (opacity > 0.2 && !lightsOn) turnLightsOn()


    changeLight(opacity, color)
}

export function setOpacityChange(newOpacityChange)
{
    if (!newOpacityChange) newOpacityChange = 0
    else if (newOpacityChange > 1) newOpacityChange = 1
    else if (newOpacityChange < -1) newOpacityChange = -1

    opacityChange = newOpacityChange
    applyCurrentNight()
}

export function initNightManager()
{
    loadOnEveryMap(resetLights)
    loadOnEveryMap(applyCurrentNight)

    addSettingToPanel(
        'night',
        'Pory dnia i nocy',
        'Ściemnianie mapy w zależności od pory dnia.',
        applyCurrentNight
    )
}
