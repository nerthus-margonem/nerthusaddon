import {addToNiDrawList, removeFromNiDrawList} from '../game-integration/loaders'
import {coordsToId} from '../utility-functions'
import {clearLightnings} from './lightnings'

const rainEffectId = coordsToId(-1, -10)
const snowEffectId = coordsToId(-1, -20)

const rainFrames = []
const snowFrames = []
if (INTERFACE === 'NI')
{
    for (let i = 0; i < 3; i++)
    {
        rainFrames[i] = new Image()
        rainFrames[i].src = FILE_PREFIX + `res/img/weather/rain-frame-${i}.png`
    }

    for (let i = 0; i < 5; i++)
    {
        snowFrames[i] = new Image()
        snowFrames[i].src = FILE_PREFIX + `res/img/weather/snow-frame-${i}.png`
    }
}
const currentFrame = {
    'rain': 0,
    'snow': 0
}
let rainInterval
let snowInterval

function getWeatherNiObject(type, opacity)
{
    let frames
    if (type === 'rain') frames = rainFrames
    else if (type === 'snow') frames = snowFrames

    return {
        draw(e)
        {
            const img = frames[currentFrame[type]]

            //check if img has been loaded correctly to not stop entire game in case of error
            if (img.complete && img.naturalWidth !== 0)
            {
                const pattern = e.createPattern(img, 'repeat')
                const style = e.fillStyle
                const alpha = e.globalAlpha
                e.fillStyle = pattern
                e.globalAlpha = opacity
                e.translate(0 - Engine.map.offset[0], 0 - Engine.map.offset[1])
                e.fillRect(0, 0, Engine.map.width, Engine.map.height)
                e.translate(Engine.map.offset[0], Engine.map.offset[1])
                e.fillStyle = style
                e.globalAlpha = alpha
            }
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
        }
    }
}


export function clearEffects(clearGameEffects)
{
    if (INTERFACE === 'NI')
    {
        removeFromNiDrawList(rainEffectId)
        removeFromNiDrawList(snowEffectId)
        if (clearGameEffects) Engine.weather.onClear()
    }
    else
    {
        $('.nerthus-weather').remove()
        if (clearGameEffects) window.clearWeather()
    }
    clearLightnings()
}

export function displayRain(opacity)
{
    if (INTERFACE === 'NI')
    {
        if (rainInterval) clearInterval(rainInterval)
        rainInterval = setInterval(function ()
        {
            currentFrame.rain += 1
            if (currentFrame.rain === 3) currentFrame.rain = 0
        }, 100)
        addToNiDrawList(getWeatherNiObject('rain', opacity), rainEffectId)
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: 'url(' + FILE_PREFIX + 'res/img/weather/rain.gif)',
                zIndex: map.y * 2 + 10,
                opacity: opacity ? opacity : 1
            })
            .appendTo('#ground')
    }
}

export function displaySnow(opacity)
{
    if (INTERFACE === 'NI')
    {
        if (snowInterval) clearInterval(snowInterval)
        snowInterval = setInterval(function ()
        {
            currentFrame.snow += 1
            if (currentFrame.snow === 5) currentFrame.snow = 0
        }, 400)
        addToNiDrawList(getWeatherNiObject('snow', opacity), snowEffectId)
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: 'url(' + FILE_PREFIX + 'res/img/weather/snow.gif)',
                zIndex: map.y * 2 + 10,
                opacity: opacity ? opacity : 1
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
