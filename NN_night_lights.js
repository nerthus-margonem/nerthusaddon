try
{

nerthus.night_lights = {}

nerthus.night_lights.types = {}

nerthus.night_lights.types.add = function(type,size)
{
    this[type] = {'url' : nerthus.addon.fileUrl("/img/night_light_" + type + ".png"), 'widthx' : size, 'height' : size}
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
          height : lt.width,
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
g.loadQueue.push({fun:nerthus.night_lights.on,data:""})

}catch(err)
{
log('night lights error: '+ err.message ,1)
}
