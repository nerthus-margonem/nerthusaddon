import {addToNiDrawList} from '../game-integration/loaders'
import {coordsToId} from '../utility-functions'

function getDarknessNiObject(opacity)
{
    return {
        draw: function (e)
        {
            const name = nerthus.worldEdit.currentWeatherEffects[i][0]
            const opacity = nerthus.worldEdit.currentWeatherEffects[i][1]
            const img = nerthus.worldEdit.weatherImages[name][nerthus.worldEdit.weatherCurrentFrameNumbers[name] + 1]

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

            const style = e.fillStyle
            e.fillStyle = '#000'
            e.globalAlpha = opacity
            e.fillRect(0 - Engine.map.offset[0], 0 - Engine.map.offset[1], Engine.map.width, Engine.map.height)
            e.globalAlpha = 1.0
            e.fillStyle = style
        },
        getOrder: function ()
        {
            return 940 // Darkness bellow lights but above everything else
        },
        update: function (e) { console.log(e)},
        frame: 0,
        frames: [
            {delay: 100},
            {delay: 100},
            {delay: 100},
            {delay: 100}
        ],
        frameAmount: 4,
        activeFrame: 0
    }
}


export function clearEffects()
{
    if (INTERFACE === 'NI')
    {

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
        addToNiDrawList(getDarknessNiObject(opacity), coordsToId(-1, -1))
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
