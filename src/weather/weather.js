import {settings} from '../settings'
import {Simple1DNoise} from './noise'
import {addWidget} from '../widgets'
import {default as weatherDescriptions} from '../../res/descriptions/weather.json'
import {clearEffects, displayRain, displaySnow} from './effects'

// TODO
// better humidity (less?)
// map climates


const cloudinessNoise = new Simple1DNoise(2020)

function getCloudiness(date)
{
    const pointInTime = date.getTime() / 3600000

    return cloudinessNoise.getVal(pointInTime)
}

const humidityNoise = new Simple1DNoise(420)

function getHumidity(date)
{
    const pointInTime = date.getTime() / 3600000

    return humidityNoise.getVal(pointInTime)
}

const temperatureNoise = new Simple1DNoise(666)

function getGlobalTemperature(date)
{
    const month = date.getUTCMonth()
    const day = date.getUTCDate()

    // f(x) = 15 * Math.sin(0.52 * x - 1.5) + 9 is a graph that resembles average temperature graph in poland
    // https://en.climate-data.org/north-america/united-states-of-america/ohio/poland-137445/#climate-graph
    const x = month + (day / 31) //minor difference in 28 day month probably not noticeable
    console.log(x)
    const dayTemperature = 15 * Math.sin(0.52 * x - 1.5) + 9
    // 7 w dół i w górę
    const pointInTime = date.getTime() / 3600000
    const hourTemperatureChange = temperatureNoise.getVal(pointInTime) * 14 - 7
    console.log(dayTemperature)
    console.log(hourTemperatureChange)

    return dayTemperature + hourTemperatureChange
}

function getRegionalTemperatureDiff()
{
    return 0
}

function getTemperature(date)
{
    return getGlobalTemperature(date) + getRegionalTemperatureDiff(date)
}

/**
 * Table holding names of weathers based on cloudiness and humidity thresholds.
 * First variable (rows) is cloudiness and second (columns) is humidity
 * There should be 52.5% to get a value without any rain if both variables are random.
 * @type {string[][]}
 */
const WEATHER_TABLE =
    [   //   15%             20%               25%           40%
        ['clear-day', 'day-cloud-small', 'day-cloud-big', 'overcast'  ], // 25%
        ['clear-day', 'day-cloud-small', 'day-cloud-big', 'rain-light'], // 25%
        ['clear-day', 'day-cloud-small', 'day-rain'     , 'rain'      ], // 25%
        ['clear-day', 'day-rain'       , 'day-storm'    , 'storm'     ]  // 25%
    ]

const RAIN_STRENGTH = {
    'day-rain': 0.6,
    'day-storm': 1,
    'rain': 0.9,
    'storm': 1
}

const SNOW_STRENGTH = {
    'day-snow': 1,
    'day-rain-with-snow': 1,
    'snow': 1,
    'snow-storm': 1
}

export function getWeather(date)
{
    const cloudiness = getCloudiness(date)
    let cloudinessPart
    if (cloudiness <= 0.15) cloudinessPart = 0
    else if (cloudiness <= 0.35) cloudinessPart = 1
    else if (cloudiness <= 0.60) cloudinessPart = 2
    else cloudinessPart = 3

    const humidity = getHumidity(date)
    let humidityPart
    if (humidity <= 0.25) humidityPart = 0
    else if (humidity <= 0.50) humidityPart = 1
    else if (humidity <= 0.75) humidityPart = 2
    else humidityPart = 3

    let weather = WEATHER_TABLE[cloudinessPart][humidityPart]

    const temperature = getTemperature(date)
    if (temperature < -3)
        weather = weather
            .replace('rain', 'snow')
            .replace(/^storm$/, 'snow-storm')
            .replace(/^day-storm$/, 'day-snow')
    else if (temperature < 5)
        weather = weather
            .replace('rain', 'rain-with-snow')
            .replace(/^day-storm$/, 'day-rain-with-snow')
    else if (temperature > 25) // really hot, less cloudiness and humidity
        weather = WEATHER_TABLE[cloudinessPart - 0.2][humidityPart - 0.2]

    let rain = 0
    if (RAIN_STRENGTH[weather]) rain = RAIN_STRENGTH[weather]

    let snow = 0
    if (SNOW_STRENGTH[weather]) snow = SNOW_STRENGTH[weather]

    if (date.getHours() < 6 || date.getHours() > 20)
        weather = weather.replace('day', 'night')

    return {
        name: weather,
        rainStrength: rain,
        snowStrength: snow,
        temperature: temperature,
        humidity: humidity,
        cloudiness: cloudiness
    }
}

function startChangeTimer($widget)
{
    const date = new Date()
    const hour = Math.floor((date.getUTCHours()) + 1)
    date.setUTCHours(hour, 0, 0)
    const timeout = date - new Date()
    setTimeout(function ()
    {
        const currentWeather = getWeather(new Date())
        $widget.children('.nerthus__widget-image')
            .css('background-image', FILE_PREFIX + 'res/img/weather/icons/' + currentWeather.name + '.png')
        $widget.children('nerthus__widget-desc')
            .text(weatherDescriptions[currentWeather.name][0])

        clearEffects()
        if (currentWeather.rainStrength) displayRain(currentWeather.rainStrength)
        if (currentWeather.snowStrength) displaySnow(currentWeather.snowStrength)

        startChangeTimer($widget)
    }, timeout)
}

export function initWeather()
{
    if (settings.weather)
    {
        const currentWeather = getWeather(new Date())
        console.log(currentWeather)
        const $widget = addWidget(
            'weather',
            FILE_PREFIX + 'res/img/weather/icons/' + currentWeather.name + '.png',
            weatherDescriptions[currentWeather.name][0]
        )

        clearEffects()
        if (currentWeather.rainStrength) displayRain(currentWeather.rainStrength)
        if (currentWeather.snowStrength) displaySnow(currentWeather.snowStrength)
        for (let i = 0; i < 20; i++)
        {
            let date = new Date(2019, 0, 27).getTime()
            date += 1000 * 60 * 60 * i
            let newDate = new Date(date)
            console.log(getWeather(newDate))
        }
        startChangeTimer($widget)
    }
}
