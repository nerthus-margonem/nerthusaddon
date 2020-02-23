
const LIGHT_TYPES = {S: '64px', M: '96px', L: '160px', XL: '192px'}

function getLightTypeUrl(lightType)
{
    return FILE_PREFIX + "/img/night_light_" + lightType + ".png"
}

export function turnLightsOn() {

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