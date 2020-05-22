import {addToNiDrawList} from '../game-integration/loaders'
import {coordsToId} from '../utility-functions'
import {settings} from '../settings'

const LIGHT_TYPE_SIZES = {S: '64px', M: '96px', L: '160px', XL: '192px'}

export let lightsOn = false

/**
 * Id of NPC's on NI that hold lights
 * @type {number[]}
 */
const lightNpcs = []

function getLightTypeUrl(lightType)
{
    return FILE_PREFIX + 'res/img/night-lights/' + lightType + '.png'
}

function getLightNiObject(img, x, y)
{
    return {
        draw: function (e)
        {
            e.drawImage(img, x - Engine.map.offset[0], y - Engine.map.offset[1])
        },
        getOrder: function ()
        {
            return 1000 // Lights always on top
        },
        update: function () {},
        d: {},
        updateDATA: function () {}
    }
}

function addLights(lights)
{
    if (settings.night)
    {
        for (const i in lights)
        {
            if (INTERFACE === 'NI')
            {
                const id = coordsToId(lights[i].x, lights[i].y)
                const image = new Image()
                image.onload = addToNiDrawList.bind(
                    null,
                    getLightNiObject(image, lights[i].x, lights[i].y),
                    id
                )
                image.src = getLightTypeUrl(lights[i].type)
                lightNpcs.push(id)
            }
            else
            {
                const lightTypeSize = LIGHT_TYPE_SIZES[lights[i].type]
                $('<div />')
                    .addClass('nerthus__night-light')
                    .css({
                        background: 'url(' + getLightTypeUrl(lights[i].type) + ')',
                        width: lightTypeSize,
                        height: lightTypeSize,
                        zIndex: map.y * 2 + 12,
                        left: lights[i].x,
                        top: lights[i].y
                    })
                    .attr('type', lights[i].type)
                    .appendTo('#ground')
                    .css('opacity', '1')
            }
        }
    }
}

export function resetLights()
{
    if (INTERFACE === 'NI')
    {
        const npcList = Engine.npcs.check()
        for (const id of lightNpcs)
        {
            delete npcList[id]
        }
        lightNpcs.splice(0, lightNpcs.length)
    }
    else
    {
        $('#ground .nerthus__night-light').remove()
    }

    lightsOn = false
}


export function turnLightsOn()
{
    resetLights()
    if (INTERFACE === 'NI')
    {
        if (typeof Engine.map.d.id === 'undefined')
            setTimeout(turnLightsOn, 500)
        else
        {
            if (AVAILABLE_MAP_FILES.lights.includes(Engine.map.d.id))
                $.getJSON(FILE_PREFIX + 'res/configs/night-lights/' + Engine.map.d.id + '.json', addLights)
            else console.log('lights not loaded - no file')
        }
    }
    else
    {
        if (AVAILABLE_MAP_FILES.lights.includes(map.id))
            $.getJSON(FILE_PREFIX + 'res/configs/night-lights/' + map.id + '.json', addLights)
        else console.log('lights not loaded - no file')
    }
    lightsOn = true
}
