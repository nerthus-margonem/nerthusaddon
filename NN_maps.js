/**
    Name: NerthusMaps
    Zawiera zmiane map na specjalne czy też sezonowe.
**/

nerthus.maps = {}

nerthus.maps.customMaps = function ()
{
    let season = nerthus.season()
    for (const i in nerthus.mapsArr)
        if (nerthus.mapsArr[i][1] === map.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            nerthus.worldEdit.changeMap(nerthus.mapsArr[i][2], 0)
            return true
        }
    nerthus.worldEdit.changeMap(false, 0)
    return false
}

nerthus.maps.customMaps_ni = function ()
{
    let season = nerthus.season()
    for (const i in nerthus.mapsArr)
        if (nerthus.mapsArr[i][1] === Engine.map.d.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            nerthus.worldEdit.changeMap(nerthus.mapsArr[i][2], 0)
            return true
        }
    nerthus.worldEdit.changeMap(false, 0)
    return false
}

nerthus.maps.start = function ()
{
    nerthus.loadOnEveryMap(this.customMaps.bind(this))
}

nerthus.maps.start_ni = function ()
{
    nerthus.onDefined("Engine.map.d.id", () =>
    {
        this.customMaps_ni()
        nerthus.loadOnEveryMap(this.customMaps_ni.bind(this))
    })
}
