try
{

nerthus.night = {}
nerthus.night.dimValue = 0
nerthus.night.allAdded_ni = false
nerthus.night.opacity = function()
{
    const hour = new Date().getHours()
    if(hour <= 4)  return 0.8
    if(hour >= 21) return 0.6
    if(hour >= 18) return 0.3
    return 0
}

nerthus.night.dim = function(opacity)
{
    if(map.mainid != 0)
        return

    $("<div id=nNight />")
    .css({height  : $("#ground").css("height"),
          width   : $("#ground").css("width"),
          zIndex  : map.y * 2 + 11,
          opacity : opacity,
          pointerEvents   : "none",
          backgroundColor : "black"})
    .appendTo("#ground")
    .draggable()
}

nerthus.night.dim_ni = function (opacity)
{
    if (Engine.map.d.mainid === 0)
        nerthus.night.dimValue = opacity
    else
        nerthus.night.dimValue = 0
}

nerthus.night.lights = {}
nerthus.night.lights.types = {}

nerthus.night.lights.types.add = function(type,size)
{
    this[type] = {'url' : nerthus.addon.fileUrl("/img/night_light_" + type + ".png"), 'width' : size, 'height' : size}
}

nerthus.night.lights.add = function(lights)
{
    for(let i in lights)
        this.display(lights[i])
}

nerthus.night.lights.add_ni = function (lights)
{
    for (const i in lights)
        nerthus.lightDrawList.push(this.display(lights[i]))
    nerthus.night.allAdded_ni = false
    nerthus.night.setNight_ni()
}

nerthus.night.lights.display = function(light)
{
    var lt = this.types[light.type]
    return $('<div/>')
    .css({background:'url('+ lt.url +')',
          width : lt.width,
          height : lt.height,
          zIndex : map.y * 2 + 12,
          position:'absolute',
          left : parseInt(light.x),
          top : parseInt(light.y),
          pointerEvents : "none"})
    .addClass("nightLight")
    .attr("type", light.type)
    .appendTo("#ground")
}

nerthus.night.lights.display_ni = function(light)
{
    let lt = this.types[light.type]

    let image = new Image()
    image.src = lt.url
    let obj = {
        image: image,
        x: parseInt(light.x),
        y: parseInt(light.y)
    }
    if(!nerthus.lightDrawList)
        nerthus.lightDrawList = []
    return obj
}

nerthus.night.lights.on = function()
{
    $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + map.id + ".json"),this.add.bind(this))
}

nerthus.night.lights.on_ni = function()
{
    if (Engine.map.d.id === undefined)
        setTimeout(nerthus.night.lights.on_ni.bind(this), 500)
    else
    {
        nerthus.lightDrawList = []
        $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + Engine.map.d.id + ".json"), this.add_ni.bind(this))

    }
}

nerthus.night.setNight_ni = function () {
    let gateways = Engine.map.gateways.getDrawableItems
    Engine.map.gateways.getDrawableItems = function () {
        let ret = gateways()
        if(!nerthus.night.allAdded_ni) //to not run unnecessary code every second
        {
            //Darkness
            ret.push({
                draw: function (e)
                {
                    e.globalAlpha = nerthus.night.dimValue;
                    e.fillRect(0 - Engine.map.offset[0], 0 - Engine.map.offset[1], Engine.map.width, Engine.map.height);
                    e.globalAlpha = 1.0;
                },
                update: function ()
                {
                },
                getOrder: function ()
                {
                    return 950 //darkness bellow lights but above everything else
                },
                d: {},
                tip: "",
                removeHightlight: function ()
                {
                }
            })
            //Lights
            if (nerthus.lightDrawList)
            {
                let lightListLen = nerthus.lightDrawList.length || 0
                for (let i = 0; i < lightListLen; i++)
                {
                    if (!nerthus.lightDrawList[i].added)
                    {
                        ret.push({
                            draw: function (e)
                            {
                                e.drawImage(
                                    nerthus.lightDrawList[i].image,
                                    nerthus.lightDrawList[i].x - Engine.map.offset[0],
                                    nerthus.lightDrawList[i].y - Engine.map.offset[1])
                            },
                            update: function ()
                            {
                            },
                            getOrder: function ()
                            {
                                return 1000 //light always on top
                            },
                            d: {},
                            tip: "",
                            removeHightlight: function ()
                            {
                            }
                        })
                        nerthus.lightDrawList[i].added = true
                    }
                }
            }
            nerthus.night.allAdded_ni = true
        }

        return ret
    }

}

nerthus.night.start = function()
{
    this.lights.types.add("S","64px")
    this.lights.types.add("M","96px")
    this.lights.types.add("L","160px")
    this.lights.types.add("XL","192px")
    if(nerthus.options['night'])
    {
        var hour = new Date().getHours()
        if( hour <= 4 || hour > 18 )
        {
            nerthus.defer(this.lights.on.bind(this.lights))
            nerthus.defer(this.dim.bind(this, this.opacity()))
        }
    }
}

nerthus.night.start_ni = function ()
{
    if (Engine.map.d.id === undefined)
        setTimeout(nerthus.night.start_ni.bind(this), 500)
    else
    {
        nerthus.night.lights.display = nerthus.night.lights.display_ni

        this.lights.types.add("S", "64px")
        this.lights.types.add("M", "96px")
        this.lights.types.add("L", "160px")
        this.lights.types.add("XL", "192px")
        if (nerthus.options["night"])
        {
            let hour = new Date().getHours()
            if (hour <= 4 || hour > 18)
            {
                this.lights.on_ni()
                this.dim_ni(this.opacity())
                nerthus.night.allAdded_ni = false
                nerthus.night.setNight_ni()
            }
        }
        API.addCallbackToEvent("clear_map_npcs",
            function ()
            {
                setTimeout(function ()
                {
                    if (nerthus.options["night"])
                    {
                        let hour = new Date().getHours()
                        if (hour <= 4 || hour > 18)
                        {
                            nerthus.night.dim_ni(nerthus.night.opacity())
                            nerthus.night.lights.on_ni()
                            nerthus.night.allAdded_ni = false
                        }
                    }
                }, 500)
            })
    }
}


nerthus.night.lights.give_me_the_light = function()
{
    $.getScript(nerthus.addon.fileUrl("/NN_night_lights_mgr.js"))
}

}catch(err){log('nerthus night error: '+ err.message ,1)}
