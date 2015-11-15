/**
	Name: NerthusMaps
	Zawiera zmiane map na nocne oraz na sezonowe.
**/
try{

nerthus.maps = {}

nerthus.maps.colOR = function(a,b)
{
    var retVal='';
    for(i=0;i<a.length;i++)
    {
        if(a[i]=='1' || b[i]=='1')	{retVal+='1';}
        else{retVal+='0'}
    }
    return retVal;
}

//zwraca ciąg odpowiadający kolizji, inCol - wartość colizji, x,y - kordy do zmiany, val - wartość 1-on 0-off
nerthus.maps.colChange = function(inCol,x,y,val)
{
    var retCol='';
    var a = y * map.x + x;
    for( i=0 ; i<inCol.length ; i++ )
    {
        if( i == a ){ retCol += val }
        else{ retCol += inCol[i] }
    }
    message('changed');
    return retCol;
}
		
//zmiana map, nie dotyczny map nocnych bo są w folderze którego gracze nie zasysają :/
nerthus.maps.mapChange = function(mapName)
{
	if( hero.mpath.indexOf(location.host) < 0 )
	{
		mapName = "file:///" + hero.mpath + mapName;				
	}
	$("#ground").css("backgroundImage","url(" + mapName + ")");
}

nerthus.maps.seasonMaps: function()
{
    //mapy okresowe - pory roku	
    var tmpSeason = nerthus.season();
	for(i in nerthus.mapsArr)
	{
		if( nerthus.mapsArr[i][0] == tmpSeason && nerthus.mapsArr[i][1] == map.id )
		{
			if(nerthus.mapsArr[i][3]==1)
			{this.mapChange(nerthus.mapsArr[i][2]);}
			else
			{$("#ground").css("backgroundImage","url("+nerthus.mapsArr[i][2]+")");}
		}
	}
}
		
nerthus.maps.seasonMaps();

}
catch(e){log('NerthusMap Error: '+e.message,1)}

