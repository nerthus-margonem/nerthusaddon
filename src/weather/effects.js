import {addToNiDrawList, removeFromNiDrawList} from '../game-integration/loaders'
import {coordsToId} from '../utility-functions'
import {clearLightnings} from './lightnings'

const rainEffect = {
    id: coordsToId(-1, -10),
    frames: [],
    frameTime: 100,
    cache: [],
    cacheMapId: -1
}
const snowEffect = {
    id: coordsToId(-1, -20),
    frames: [],
    frameTime: 400,
    cache: [],
    cacheMapId: -1
}
if (INTERFACE === 'NI')
{
    for (let i = 0; i < 3; i++)
    {
        rainEffect.frames[i] = new Image()
        rainEffect.frames[i].src = FILE_PREFIX + `res/img/weather/rain-frame-${i}.png`
    }

    for (let i = 0; i < 5; i++)
    {
        snowEffect.frames[i] = new Image()
        snowEffect.frames[i].src = FILE_PREFIX + `res/img/weather/snow-frame-${i}.png`
    }
}

function cacheWeatherCanvas(effect, force = false)
{
    if (INTERFACE === 'SI')
    {
        return
    }

    if (!force && effect.cacheMapId === Engine.map.d.id)
    {
        return
    }
    effect.cacheMapId = Engine.map.d.id
    effect.cache = []
    for (const frameImg of effect.frames)
    {
        const canvas = document.createElement('canvas')
        canvas.width = Engine.map.width
        canvas.height = Engine.map.height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = ctx.createPattern(frameImg, 'repeat')
        ctx.fillRect(0, 0, Engine.map.width, Engine.map.height)
        effect.cache.push(canvas)
    }
}

function getWeatherNiObject(effect, opacity)
{
    return {
        draw(e)
        {
            const cachedCanvas = effect.cache[Math.floor(Date.now() / effect.frameTime) % effect.frames.length]
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
        addToNiDrawList(getWeatherNiObject(rainEffect, opacity), rainEffect.id)
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: 'url(' + FILE_PREFIX + 'res/img/weather/rain.gif)',
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
        addToNiDrawList(getWeatherNiObject(snowEffect, opacity), snowEffect.id)
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: 'url(' + FILE_PREFIX + 'res/img/weather/snow.gif)',
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
