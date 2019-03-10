/**
 Name: NerthusMaps
 Zawiera zmiane map na specjalne czy też sezonowe.
 **/

nerthus.maps = {}
nerthus.maps.specialMap = false
nerthus.maps.draw_ni = function ()
{
    let tmpMapDraw = nerthus.defaultMapDraw
    nerthus.mapDraw = function (Canvas_rendering_context)
    {
        tmpMapDraw(Canvas_rendering_context) // main map
        if (nerthus.maps.specialMap)
            Canvas_rendering_context.drawImage(nerthus.maps.specialMap, 0 - Engine.map.offset[0], 0 - Engine.map.offset[1])
        for (const i in nerthus.additionalDrawList)
        {
            Canvas_rendering_context.drawImage(
                nerthus.additionalDrawList[i].image,
                nerthus.additionalDrawList[i].x - Engine.map.offset[0],
                nerthus.additionalDrawList[i].y - Engine.map.offset[1])
        }
        if (Engine.map.goMark)
        {
            Engine.map.drawGoMark(Canvas_rendering_context)
        }
    }
    Engine.map.draw = nerthus.mapDraw
}

nerthus.maps.customMaps = function ()
{
    let season = nerthus.season()
    for (const i in nerthus.mapsArr)
    {
        if (nerthus.mapsArr[i][1] === map.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            return nerthus.maps.change(nerthus.mapsArr[i][2])
        }
    }
}

nerthus.maps.seasonMaps_ni = function ()
{
    let season = nerthus.season()
    for (const i in nerthus.mapsArr)
    {
        if (nerthus.mapsArr[i][1] === Engine.map.d.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            this.change_ni(nerthus.mapsArr[i][2])
            return nerthus.mapsArr[i]
        }
    }
    this.specialMap = false
    return false
}

nerthus.maps.change = function (map_url)
{
    $("#ground").css("backgroundImage", "url(" + map_url + ")")
}

nerthus.maps.change_ni = function (map_url)
{
    let mapImage = new Image()
    mapImage.src = map_url
    this.specialMap = mapImage
}

nerthus.maps.start = function ()
{
    nerthus.defer(nerthus.maps.customMaps)
}

nerthus.maps.start_ni = function ()
{
    if (Engine.map.d.id === undefined)
        setTimeout(this.start_ni.bind(this), 500)
    else
    {
        nerthus.defaultMapDraw = Engine.map.draw
        this.seasonMaps_ni()
        nerthus.loadOnEveryMap(this.seasonMaps_ni.bind(this))
        this.draw_ni()
    }
}
