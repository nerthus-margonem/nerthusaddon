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

nerthus.maps.change = function(map_url)
{
    $("#ground").css("backgroundImage","url(" + map_url + ")")
}

nerthus.maps.start = function()
{
    g.loadQueue.push({fun:nerthus.maps.seasonMaps, data:""});
}

nerthus.maps.start()

}
catch(e){log('NerthusMap Error: '+e.message,1)}

