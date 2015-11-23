try
{

nerthus.night = function()
{
	var hour = new Date().getHours();
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

nerthus.night_lights = {}
nerthus.night_lights.types = {}

nerthus.night_lights.types.add = function(type,size)
{
    this[type] = {'url' : nerthus.addon.fileUrl("/img/night_light_" + type + ".png"), 'width' : size, 'height' : size}
}

nerthus.night_lights.add = function(lights)
{
    for(var i in lights)
        this.display(lights[i])
}

nerthus.night_lights.display = function(light)
{
    var lt = this.types[light.type]
    return $('<div/>')
    .css({background:'url('+ lt.url +')',
          width : lt.width,
          height : lt.height,
          zIndex : 280,
          position:'absolute',
          left : parseInt(light.x),
          top : parseInt(light.y),
          pointerEvents : "none"})
    .addClass("nightLight")
    .attr("type", light.type)
    .appendTo("#ground")
}

nerthus.night_lights.on = function()
{
    var hour = new Date().getHours();
    if( hour < 4 || hour > 18 )
        $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + map.id + ".json"),function(lights){nerthus.night_lights.add(lights)})
}

nerthus.night_lights.types.add("S","64px")
nerthus.night_lights.types.add("M","96px")
nerthus.night_lights.types.add("L","160px")
nerthus.night_lights.types.add("XL","192px")

if(parseInt(nerthus.settings[0]))
{
    g.loadQueue.push({fun:nerthus.night_lights.on, data:""})
    g.loadQueue.push({fun:nerthus.night, data:""});
}

}catch(err){log('nerthus night error: '+ err.message ,1)}
