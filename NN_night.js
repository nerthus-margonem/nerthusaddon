try
{

nerthus.night = {}
nerthus.night.opacity = function()
{
    const hour = new Date().getHours()
    if(hour <= 4)  return 0.8
    if(hour >= 21) return 0.6
    if(hour >= 18) return 0.3
    return 0
}
nerthus.night.dim = function()
{
    if(map.mainid != 0)
        return

    $("<div id=nNight />")
    .css({height  : $("#ground").css("height"),
          width   : $("#ground").css("width"),
          zIndex  : map.y + 11,
          opacity : this.opacity(),
          pointerEvents   : "none",
          backgroundColor : "black"})
    .appendTo("#ground")
    .draggable()
}

nerthus.night.lights = {}
nerthus.night.lights.types = {}

nerthus.night.lights.types.add = function(type,size)
{
    this[type] = {'url' : nerthus.addon.fileUrl("/img/night_light_" + type + ".png"), 'width' : size, 'height' : size}
}

nerthus.night.lights.add = function(lights)
{
    for(var i in lights)
        this.display(lights[i])
}

nerthus.night.lights.display = function(light)
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

nerthus.night.lights.on = function()
{
    var hour = new Date().getHours();
    if( hour <= 4 || hour > 18 )
        $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + map.id + ".json"),this.add.bind(this))
}

nerthus.night.start = function()
{
    this.lights.types.add("S","64px")
    this.lights.types.add("M","96px")
    this.lights.types.add("L","160px")
    this.lights.types.add("XL","192px")
    if(nerthus.options['night'])
    {
        nerthus.defer(this.lights.on.bind(this.lights))
        nerthus.defer(this.dim.bind(this))
    }
}


nerthus.night.lights.give_me_the_light = function()
{
    $.getScript(nerthus.addon.fileUrl("/NN_night_lights_mgr.js"))
}

nerthus.night.start()

}catch(err){log('nerthus night error: '+ err.message ,1)}
