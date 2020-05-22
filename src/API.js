import {checkPermissionLvl, hasNarrationRights} from './permissions'
import {customNpcs} from './npc/npc'
import {getWeather} from './weather/weather'
import {applyCurrentNight, changeLight} from './night/night'
import {turnLightsOn} from './night/lights'

/*
 Event names:
 - displayWeather
 - addTemporaryNpc
 - removeTemporaryNpc
 - loaded
 */
const callbacks = {}

export function callEvent(eventName, data)
{
    for (const callback in callbacks[eventName])
    {
        callbacks[eventName][callback](data)
    }
}

export function initAPI()
{
    window.nerthus = {
        loaded: false,
        addCallbackToEvent(eventName, func)
        {
            if (!callbacks[eventName]) callbacks[eventName] = []
            callbacks[eventName].push(func)
        },
        permissions: {
            checkPermissionLvl: checkPermissionLvl,
            hasNarrationRights: hasNarrationRights
        },
        weather: {
            getWeather: getWeather
        },
        night: {
            changeLight: changeLight,
            applyCurrentNight: applyCurrentNight,
            turnLightsOn: turnLightsOn
        },
        npcList: customNpcs
    }
    window.nerthus.addCallbackToEvent('loaded', function ()
    {
        window.nerthus.loaded = true
    })
}

/*
  If something is missing in API and you would want to use it,
  feel free to open an issue
 */
