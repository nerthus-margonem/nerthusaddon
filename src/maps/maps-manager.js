import {loadOnEveryMap} from '../game-integration/loaders'

function loadCurrentSeasonMap()
{
    const season = nerthus.season()
    for (const i in nerthus.mapsArr)
        if (nerthus.mapsArr[i][1] === map.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            if (INTERFACE === 'NI')
                nerthus.worldEdit.changeMap(nerthus.mapsArr[i][2], 0, Engine.map.d.id)
            else
                nerthus.worldEdit.changeMap(nerthus.mapsArr[i][2], 0, map.id)

            return true
        }
    nerthus.worldEdit.changeMap(false, 0)
    return false
}

export function initMapsManager()
{
    if (INTERFACE === 'NI')
    {
        nerthus.onDefined('Engine.map.d.id', () =>
        {
            this.customMaps_ni()
            nerthus.loadOnEveryMap(loadCurrentSeasonMap)
        })
    }
    else
    {
        loadOnEveryMap(loadCurrentSeasonMap)
    }
}
