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
    nerthus.worldEdit.changeLight(map.mainid === 0 || map.id === 1862 ? opacity : 0)
}

nerthus.night.dim_ni = function (opacity)
{
    nerthus.worldEdit.changeLight(Engine.map.d.mainid === 0 || Engine.map.d.id === 1862  ? opacity : 0)
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
    this.reset()
    const hour = new Date().getHours()
    if (hour <= 4 || hour > 18)
        $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + map.id + ".json"), nerthus.worldEdit.addLights.bind(this))
}

nerthus.night.lights.reset = function ()
{
    nerthus.worldEdit.resetLight()
}


nerthus.night.lights.on_ni = function()
{
    if (typeof Engine.map.d.id === "undefined")
        setTimeout(this.on_ni.bind(this), 500)
    else
    {
        const hour = new Date().getHours()
        if (hour <= 4 || hour > 18)
        {
            nerthus.worldEdit.lightDrawList = []
            $.getJSON(nerthus.addon.fileUrl("/night_lights/map_" + Engine.map.d.id + ".json"), nerthus.worldEdit.addLights.bind(this))
        }
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
        nerthus.loadOnEveryMap(this.run.bind(this))
    }

}

nerthus.night.run = function ()
{
    if (nerthus.options["night"])
    {
        nerthus.night.dim(nerthus.night.opacity())
        nerthus.night.lights.on()
    }
}

nerthus.night.start_ni = function ()
{
    nerthus.onDefined("Engine.map.d.id", () =>
    {
        nerthus.night.dim = nerthus.night.dim_ni
        nerthus.night.lights.display = nerthus.night.lights.display_ni
        nerthus.night.lights.on = nerthus.night.lights.on_ni

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
        this.run()
        nerthus.loadOnEveryMap(this.run.bind(this))
    })
}


nerthus.night.lights.give_me_the_light = function()
{
    $.getScript(nerthus.addon.fileUrl("/NN_night_lights_mgr.js"))
}
