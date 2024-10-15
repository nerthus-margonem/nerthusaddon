import {addToNiDrawList} from '../game-integration/loaders'
import {settings} from '../settings'
import {coordsToId} from '../utility-functions'

const LIGHT_TYPE_SIZES = {S: 64, M: 96, L: 160, XL: 192}

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

function getLightNiObject(img, x, y, lightTypeSize)
{
    return {
        draw(e)
        {
            e.drawImage(img, x - Engine.map.offset[0], y - Engine.map.offset[1])
        },
        getOrder()
        {
            return 1000 // Lights always on top
        },
        update() {},
        d: {},
        updateDATA() {},
        rx: (x + lightTypeSize / 2) / 32,
        ry: (y + lightTypeSize / 2) / 32,
        getFollowController()
        {
            return {
                checkFollowGlow: () => false
            }
        },
        isIconInvisible() { return false },
        getNick() { return '' },
        getId() { return -1 },
        drawNickOrTip() {},
        getKind() { return null }
    }
}

export function addSingleLight(lightType, x, y)
{
    const lightTypeSize = LIGHT_TYPE_SIZES[lightType]

    if (INTERFACE === 'NI')
    {
        const id = coordsToId(x, y)
        const image = new Image()
        image.onload = addToNiDrawList.bind(null, getLightNiObject(image, x, y, lightTypeSize), id)
        image.src = getLightTypeUrl(lightType)
        lightNpcs.push(id)
        return id
    }
    else
    {
        return $('<div class="nerthus__night-light" />')
            .css({
                background: 'url(' + getLightTypeUrl(lightType) + ')',
                width: lightTypeSize + 'px',
                height: lightTypeSize + 'px',
                zIndex: map.y * 2 + 13,
                left: x,
                top: y
            })
            .attr('type', lightType)
            .appendTo('#ground')
            .css('opacity', '1')
    }
}

export function addLights(lights)
{
    if (settings.night)
    {
        for (const i in lights)
        {
            addSingleLight(lights[i].type, lights[i].x, lights[i].y)
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
    if (INTERFACE === 'NI' && typeof Engine.map.d.id === 'undefined')
    {
        setTimeout(turnLightsOn, 500)
        return
    }

    if (AVAILABLE_MAP_FILES.lights.includes(CURRENT_MAP_ID))
    {
        $.getJSON(FILE_PREFIX + 'res/configs/night-lights/' + CURRENT_MAP_ID + '.json', addLights)
    }
    else
    {
        console.log('lights not loaded - no file')
    }

    lightsOn = true
}
