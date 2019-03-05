/**
 Name: NerthusMaps
 Zawiera zmiane map na specjalne czy też sezonowe.
 **/
try {

nerthus.maps = {}

nerthus.maps.customMaps = function ()
{
    let season = nerthus.season()
    for (const i in nerthus.mapsArr)
    {
        if (nerthus.mapsArr[i][1] === map.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            nerthus.maps.change(nerthus.mapsArr[i][2])
            return nerthus.mapsArr[i]
        }
    }
}

nerthus.maps.change = function (map_url)
{
    $("#ground").css("backgroundImage", "url(" + map_url + ")")
}

nerthus.maps.start = function ()
{
    nerthus.defer(nerthus.maps.customMaps)
}

} catch (e) { log("NerthusMap Error: " + e.message, 1) }

