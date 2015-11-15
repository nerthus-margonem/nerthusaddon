/**
	Name: NerthusMaps
	Zawiera zmiane map na nocne oraz na sezonowe.
**/
try{

nerthus.maps = {}

nerthus.maps.seasonMaps = function()
{
    //mapy okresowe - pory roku
    var season = nerthus.season();
	for(i in nerthus.mapsArr)
	{
		if( nerthus.mapsArr[i][0] == season && nerthus.mapsArr[i][1] == map.id )
		{
			this.change(nerthus.mapsArr[i][2]);
		}
	}
}

//zmiana map, nie dotyczny map nocnych bo są w folderze którego gracze nie zasysają :/
nerthus.maps.change = function(map_url)
{
	$("#ground").css("backgroundImage","url(" + map_url + ")");
}

nerthus.maps.seasonMaps();

}
catch(e){log('NerthusMap Error: '+e.message,1)}

