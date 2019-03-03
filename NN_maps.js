/**
    Name: NerthusMaps
    Zawiera zmiane map na nocne oraz na sezonowe.
**/
try{

nerthus.maps = {}

nerthus.maps.seasonMaps = function()
{
    var season = nerthus.season()
    for(i in nerthus.mapsArr)
        if( nerthus.mapsArr[i][0] == season && nerthus.mapsArr[i][1] == map.id )
            nerthus.maps.change(nerthus.mapsArr[i][2])
}

nerthus.maps.seasonMaps_ni = function()
{
    let season = nerthus.season()
    for(i in nerthus.mapsArr)
    {
        if (nerthus.mapsArr[i][1] === Engine.map.d.id && (nerthus.mapsArr[i][0] === 0 || nerthus.mapsArr[i][0] === season))
        {
            nerthus.maps.change_ni(nerthus.mapsArr[i][2])
            break
        }
    }
}

nerthus.maps.change = function(map_url)
{
    $("#ground").css("backgroundImage","url(" + map_url + ")")
}

nerthus.maps.change_ni = function (map_url)
{
    let mapImage = new Image()
    mapImage.src = map_url
    let tmpMapDraw = Engine.map.draw
    nerthus.mapDraw = function (Canvas_rendering_context)
    {
        tmpMapDraw(Canvas_rendering_context)
        Canvas_rendering_context.drawImage(mapImage, 0 - Engine.map.offset[0], 0 - Engine.map.offset[1])
        if (Engine.map.goMark)
        {
            Engine.map.drawGoMark(Canvas_rendering_context)
        }
    }
    Engine.map.draw = nerthus.mapDraw
}

nerthus.maps.start = function()
{
    nerthus.defer(nerthus.maps.seasonMaps)
}

nerthus.maps.start_ni = function()
{
    nerthus.maps.seasonMaps_ni()
    API.addCallbackToEvent("clear_map_npcs",
        function ()
        {
            setTimeout(function ()
            {
                nerthus.maps.seasonMaps_ni()
            }, 500)
        })
}

}
catch(e){log('NerthusMap Error: '+e.message,1)}

