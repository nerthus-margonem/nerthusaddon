nerthus.night = {}

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
    nerthus.worldEdit.changeDefaultLight(map.mainid === 0 ? opacity : 0)
}

nerthus.night.dim_ni = function (opacity)
{
    nerthus.worldEdit.changeLight(Engine.map.d.mainid === 0 ? opacity : 0)
}

nerthus.night.lights = {}
nerthus.night.lights.types = {}

nerthus.night.lights.types.add = function (type, size)
{
    nerthus.worldEdit.lightTypes[type] = {
        'url': nerthus.addon.fileUrl("/img/night_light_" + type + ".png"),
        'width': size,
        'height': size
    }
}

nerthus.night.lights.on = function()
{
    $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + map.id + ".json"),nerthus.worldEdit.addLights.bind(this))
}

nerthus.night.lights.on_ni = function()
{
    if (typeof Engine.map.d.id === "undefined")
        setTimeout(this.on_ni.bind(this), 500)
    else
    {
        nerthus.worldEdit.lightDrawList = []
        $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + Engine.map.d.id + ".json"), nerthus.worldEdit.addLights.bind(this))

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
        let hour = new Date().getHours()
        if( hour <= 4 || hour > 18 )
        {
            nerthus.defer(this.lights.on.bind(this.lights))
            nerthus.defer(this.dim.bind(this, this.opacity()))
        }
    }
}

nerthus.night.run_ni = function ()
{
    if (nerthus.options["night"])
    {
        let hour = new Date().getHours()
        if (hour <= 4 || hour > 18)
        {
            nerthus.night.dim_ni(nerthus.night.opacity())
            nerthus.night.lights.on_ni()
        }
    }
}

nerthus.night.start_ni = function ()
{
    if (typeof Engine.map.d.id === "undefined")
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
                this.dim_ni(this.opacity())
                this.lights.on_ni()
            }
        }
        this.run_ni()
        nerthus.loadOnEveryMap(this.run_ni.bind(this))
    }
}


nerthus.night.lights.give_me_the_light = function()
{
    $.getScript(nerthus.addon.fileUrl("/NN_night_lights_mgr.js"))
}
