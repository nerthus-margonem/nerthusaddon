/**
	Name: NerthusNight
	Zawiera skrypt od nocy
**/
try{

nerthus.night = function()
{
	var hour = nerthus.date.getHours();
	if( hour >= 4 && hour<18 ){ return; }
	//czy mapa główna czy wnętrze
	if(map.mainid==0)
	{
        var nNightOpacity = 0;
		if(hour>=18 && hour<21) nNightOpacity = 0.3;
		if(hour>=21 && hour<24) nNightOpacity = 0.6;
		if(hour>=0 && hour<4)   nNightOpacity = 0.8;

        $("<div id=nNight />")
        .css({height  : $("#ground").css("height"),
              width   : $("#ground").css("width"),
              zIndex  : map.y + 11,
              opacity : nNightOpacity,
              pointerEvents   : "none",
              backgroundColor : "black"})
        .appendTo("#ground")
        .draggable()
	}
}
nerthus.night();

}catch(e){log('NerthusNight Error: '+e.description,1);}	
