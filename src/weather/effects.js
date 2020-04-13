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
