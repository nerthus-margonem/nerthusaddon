import {addToNIdrawList} from '../game-integration/loaders'

const LIGHT_TYPES = {S: '64px', M: '96px', L: '160px', XL: '192px'}

function getLightTypeUrl(lightType)
{
    return FILE_PREFIX + '/img/night_light_' + lightType + '.png'
}

function getLightNiObject(img)
{
    return {
        draw: function (e)
        {
            e.drawImage(img, 0 - Engine.map.offset[0], 0 - Engine.map.offset[1])
        },
        getOrder: function ()
        {
            return 1000 // Lights always on top
        }
    }
}

function addLights(lights)
{
    if (INTERFACE === 'NI')
    {
        for (const i in lights)
        {
            const lightType = LIGHT_TYPES[lights[i].type]

            const image = new Image()
            image.onload = addToNIdrawList.bind(null, getLightNiObject(image))
            image.src = getLightTypeUrl(lightType)
        }
    }
    else
    {
        for (const i in lights)
        {
            const lightType = LIGHT_TYPES[lights[i].type]
            $('<div />')
                .css({
                    background: 'url(' + getLightTypeUrl(lightType) + ')',
                    width: lightType.width,
                    height: lightType.height,
                    zIndex: map.y * 2 + 12,
                    position: 'absolute',
                    left: parseInt(lights[i].x),
                    top: parseInt(lights[i].y),
                    pointerEvents: 'none'
                })
                .addClass('nightLight')
                .attr('type', lights[i].type)
                .appendTo('#ground')
        }
    }

}

function resetLights()
{
    if (INTERFACE === 'SI')
        $('#ground .nightLight').remove()
}


export function turnLightsOn()
{
    if (INTERFACE === 'NI')
    {
        if (typeof Engine.map.d.id === 'undefined')
            setTimeout(turnLightsOn, 500)
        else
        {
            //TODO only those who exist
            $.getJSON(FILE_PREFIX + '/night_lights/map_' + map.id + '.json', addLights)
        }
    }
    else
    {
        resetLights()
        //TODO only those who exist
        $.getJSON(FILE_PREFIX + '/night_lights/map_' + map.id + '.json', addLights)
    }
}
