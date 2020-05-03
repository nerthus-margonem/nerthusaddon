import {addToNiDrawList} from '../game-integration/loaders'
import {coordsToId} from '../utility-functions'

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
        draw: function (e)
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
        getOrder: function ()
        {
            return 930
        },
        update: function () {},
        d: {}
    }
}


export function clearEffects()
{
    if (INTERFACE === 'NI')
    {
        Engine.npcs.updateData({
            [coordsToId(-1, -1)]: {del: true},
            [coordsToId(-1, -2)]: {del: true}
        })
    }
    else
    {
        $('.nerthus-weather').remove()
    }
}

export function displayRain(opacity)
{
    if (INTERFACE === 'NI')
    {
        if (rainInterval) clearInterval(rainInterval)
        rainInterval = setInterval(function ()
        {
            console.log(currentFrame.rain)
            currentFrame.rain += 1
            if (currentFrame.rain === 3) currentFrame.rain = 0
        }, 100)
        addToNiDrawList(getWeatherNiObject('rain', opacity), coordsToId(-1, -1))
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: 'url(' + FILE_PREFIX + 'res/img/weather/rain.gif)',
                zIndex: map.y * 2 + 9,
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
        addToNiDrawList(getWeatherNiObject('snow', opacity), coordsToId(-1, -2))
    }
    else
    {
        $('<div class="nerthus-weather"/>')
            .css({
                backgroundImage: 'url(' + FILE_PREFIX + 'res/img/weather/snow.gif)',
                zIndex: map.y * 2 + 9,
                opacity: opacity ? opacity : 1
            })
            .appendTo('#ground')
    }
}
