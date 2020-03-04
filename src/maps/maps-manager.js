import {loadOnEveryMap} from '../game-integration/loaders'
import {changeMap} from './maps-change'

function loadCurrentSeasonMap()
{
    const season = nerthus.season()
    for (const i in nerthus.mapsArr)
        if (nerthus.mapsArr[i][1] === map.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            if (INTERFACE === 'NI')
                changeMap(nerthus.mapsArr[i][2], 0, Engine.map.d.id)
            else
                changeMap(nerthus.mapsArr[i][2], 0, map.id)

            return true
        }
    nerthus.worldEdit.changeMap(false, 0)
    return false
}

export function initMapsManager()
{
    loadOnEveryMap(loadCurrentSeasonMap)
}
