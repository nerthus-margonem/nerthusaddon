import {checkPermissionLvl, hasNarrationRights} from './permissions'
import {customNpcs, loadNpcsFromFile} from './npc/npc'
import {getWeather} from './weather/weather'
import {applyCurrentNight, changeLight} from './night/night'
import {turnLightsOn} from './night/lights'
import {addNpc, addNpcToList} from './npc/npc-actions/add'
import {addToMapChangelist, applyCurrentMapChange, removeFromMapChangelist} from './maps'
import {hideGameNpc} from './npc/npc-actions/hide'

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
        npcList: customNpcs,
        npc: {
            npcList: customNpcs,
            addNpc: addNpc,
            addNpcToList: addNpcToList,
            hideGameNpc: hideGameNpc,
            loadNpcsFromFile: loadNpcsFromFile
        },
        map: {
            addToMapChangelist: addToMapChangelist,
            removeFromMapChangelist: removeFromMapChangelist,
            applyCurrentMapChange: applyCurrentMapChange
        }
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
