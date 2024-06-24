import {addToNiDrawList, removeFromNiDrawList} from '../game-integration/loaders'
import {coordsToId} from '../utility-functions'
import {clearLightnings} from './lightnings'
import {decodeGifFromUrl} from '../decodeGif'

const rainEffect = {
    id: coordsToId(-1, -10),
    url: FILE_PREFIX + 'res/img/weather/rain.gif',
    frames: {
        width: 0,
        height: 0,
        frameData: []
    },
    frameTime: 120,
    cache: [],
    cacheMapId: -1
}
const snowEffect = {
    id: coordsToId(-1, -20),
    url: FILE_PREFIX + 'res/img/weather/snow.gif',
    frames: {
        width: 0,
        height: 0,
        frameData: []
    },
    frameTime: 400,
    cache: [],
    cacheMapId: -1
}

async function cacheWeatherCanvas(effect, force = false)
{
    if (INTERFACE === 'SI')
    {
        return true
    }
    if (!force && effect.cacheMapId === Engine.map.d.id)
    {
        return true
    }

    effect.cacheMapId = Engine.map.d.id
    effect.cache = []

    if (!effect.frames.frameData.length)
    {
        try
        {
            effect.frames = await decodeGifFromUrl(effect.url)
            // Variable frame time is not supported yet.
            // Frame delay value is 10 times lower than frame time ms
            effect.frameTime = effect.frames.frameDelays[0] * 10
        } catch (err)
        {
            console.error('Error decoding gif from url while caching weather canvas: ', err)
            return false
        }
    }
    for (const frameData of effect.frames.frameData)
    {
        const canvas = document.createElement('canvas')
        canvas.width = Engine.map.width
        canvas.height = Engine.map.height
        const ctx = canvas.getContext('2d')

        const imgData = new ImageData(frameData, effect.frames.width, effect.frames.height)
        const imgCanvas = document.createElement('canvas')
        imgCanvas.width = effect.frames.width
        imgCanvas.height = effect.frames.height
        const imgCtx = imgCanvas.getContext('2d')
        imgCtx.putImageData(imgData, 0, 0)

        ctx.fillStyle = ctx.createPattern(imgCanvas, 'repeat')
        ctx.fillRect(0, 0, Engine.map.width, Engine.map.height)
        effect.cache.push(canvas)
    }
    return true
}

function getWeatherNiObject(effect, opacity)
{
    return {
        draw(e)
        {
            const cachedCanvas = effect.cache[Math.floor(Date.now() / effect.frameTime) % effect.frames.frameData.length]
            if (!cachedCanvas)
            {
                return
            }
            const alpha = e.globalAlpha
            e.globalAlpha = opacity
            e.drawImage(cachedCanvas, Math.floor(-Engine.map.offset[0]), Math.floor(-Engine.map.offset[1]))
            e.globalAlpha = alpha
        },
        getOrder()
        {
            return 930
        },
        update() {},
        d: {},
        updateDATA() {},
        alwaysDraw: true,
        getFollowController()
        {
            return {
                checkFollowGlow: () => false
            }
        },
        getNick() { return '' },
        getId() { return -1 },
        drawNickOrTip() {},
        getKind() { return null }
    }
}


export function clearEffects(clearGameEffects)
{
    if (INTERFACE === 'NI')
    {
        removeFromNiDrawList(rainEffect.id)
        removeFromNiDrawList(snowEffect.id)
        if (clearGameEffects) Engine.weather.onClear()
    }
    else
    {
        $('.nerthus-weather').remove()
        if (clearGameEffects) window.clearWeather()
    }
    clearLightnings()
}

export function displayRain(opacity = 1)
{
    if (INTERFACE === 'NI')
    {
        cacheWeatherCanvas(rainEffect)
        // We can't wait for caching to add the object,
        // because it can be removed by the next chat command
        // parsed when entering the map with existing commands
        addToNiDrawList(getWeatherNiObject(rainEffect, opacity), rainEffect.id)
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: `url(${rainEffect.url})`,
                zIndex: map.y * 2 + 10,
                opacity: opacity
            })
            .appendTo('#ground')
    }
}

export function displaySnow(opacity = 1)
{
    if (INTERFACE === 'NI')
    {
        cacheWeatherCanvas(snowEffect)
        // We can't wait for caching to add the object,
        // because it can be removed by the next chat command
        // parsed when entering the map with existing commands
        addToNiDrawList(getWeatherNiObject(snowEffect, opacity), snowEffect.id)
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: `url(${snowEffect.url})`,
                zIndex: map.y * 2 + 10,
                opacity: opacity
            })
            .appendTo('#ground')
    }
}

export function displayGameWeather(name)
{
    if (INTERFACE === 'NI')
    {
        const uppercaseWeatherName = name.charAt(0).toUpperCase() + name.slice(1)

        Engine.weather.setMapSize()
        if (!Engine.weather.mapSize) return
        Engine.weather.createObjects(uppercaseWeatherName, {})
    }
    else
    {
        window.changeWeather(name)
    }
}
