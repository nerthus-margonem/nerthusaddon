import {settings} from '../settings'
import {Simple1DNoise} from './noise'
import {addWidget} from '../widgets'
import {default as weatherDescriptions} from '../../res/descriptions/weather.json'
import {clearEffects, displayRain, displaySnow} from './effects'
import {default as climates} from '../../res/configs/climates.json'
import {isCurrentMapOutdoor} from '../utility-functions'
import {loadOnEveryMap} from '../game-integration/loaders'
import {setOpacityChange} from '../night/night'
import {callEvent} from '../API'

const CHARACTERISTIC = Object.freeze({HUMIDITY: 'humidity', CLOUDINESS: 'cloudiness', TEMPERATURE: 'temperature'})
const GAME_WEATHERS = Object.freeze(['fish', 'light', 'latern', 'bat'])

const climateNoises = {
    [CHARACTERISTIC.HUMIDITY]: {},
    [CHARACTERISTIC.CLOUDINESS]: {},
    [CHARACTERISTIC.TEMPERATURE]: {}
}

let $widget

const forcedWeathers = {
    default: ''
}


function getClimateNoise(climate, type)
{
    if (!climate) climate = 'default'
    if (!climateNoises[type][climate])
    {
        let multiplier
        switch (type)
        {
            case CHARACTERISTIC.HUMIDITY:
                multiplier = 42
                break
            case CHARACTERISTIC.CLOUDINESS:
                multiplier = 666
                break
            case CHARACTERISTIC.TEMPERATURE:
                multiplier = 2020
                break
        }
        climateNoises[type][climate] = new Simple1DNoise(climates.seeds[climate] * multiplier)
    }
    return climateNoises[type][climate]
}

function getMapsClimate(mapId)
{
    for (const climateName in climates.maps)
        if (climates.maps[climateName].indexOf(mapId) >= 0)
            return climateName
    return false
}

function getClimateVariation(characteristic, date, climate)
{
    if (!characteristic[climate]) climate = 'default'

    const now = new Date()
    const start = new Date(now.getFullYear(), 3, 20) // start of spring
    if (start > now) start.setUTCFullYear(now.getFullYear() - 1)
    const day = Math.ceil((now - start) / (1000 * 60 * 60 * 24))
    const firstSeason = Math.floor(day / 90)
    const secondSeason = firstSeason === 3 ? 0 : firstSeason + 1
    return characteristic[climate][firstSeason] * (1 - ((day / 90) - firstSeason)) +
        characteristic[climate][secondSeason] * ((day / 90) - firstSeason)
}

function getClimateCloudiness(date, climate)
{
    const pointInTime = date.getTime() / 3600000

    const ret = getClimateNoise(climate, CHARACTERISTIC.CLOUDINESS).getVal(pointInTime) *
        getClimateVariation(climates.characteristics.cloudiness, date, climate)

    return ret > 1 ? 1 : ret
}

function getClimateHumidity(date, climate)
{
    const pointInTime = date.getTime() / 3600000

    const ret = getClimateNoise(climate, CHARACTERISTIC.HUMIDITY).getVal(pointInTime) *
        getClimateVariation(climates.characteristics.humidity, date, climate)

    return ret > 1 ? 1 : ret
}

function getGlobalTemperature(date, climate)
{
    const month = date.getUTCMonth()
    const day = date.getUTCDate()

    // f(x) = 15 * Math.sin(0.52 * x - 1.5) + 9 is a graph that resembles average temperature graph in poland
    // https://en.climate-data.org/north-america/united-states-of-america/ohio/poland-137445/#climate-graph
    const x = month + (day / 31) //minor difference in 28 day month probably not noticeable
    const dayTemperature = 15 * Math.sin(0.52 * x - 1.5) + 9

    const pointInTime = date.getTime() / 3600000
    const hourTemperatureChange = getClimateNoise(climate, CHARACTERISTIC.TEMPERATURE).getVal(pointInTime) * 14 - 7

    return dayTemperature + hourTemperatureChange
}


function getClimateTemperature(date, climate)
{
    return getGlobalTemperature(date, climate) + getClimateVariation(climates.characteristics.temperature, date, climate)
}

function getCurrentRegionCharacteristic(date) // todo naming???
{
    let humidity = 0
    let cloudiness = 0
    let temperature = 0
    const adjacentClimates = []
    const gatewaysIds = []
    let currentMapClimate
    if (INTERFACE === 'NI')
    {
        for (let mapId in Engine.map.gateways.townnames)
        {
            mapId = parseInt(mapId)
            const mapClimate = getMapsClimate(mapId)
            if (mapClimate && gatewaysIds.indexOf(mapId) < 0)
            {
                adjacentClimates.push(mapClimate)
                gatewaysIds.push(mapId)
            }
        }
        currentMapClimate = getMapsClimate(Engine.map.d.id)
    }
    else
    {
        for (let mapId in g.gwIds)
        {
            if (typeof g.gw[g.gwIds[mapId]] !== 'undefined') // some fast map switchers don't reset g.gwIds
            {
                mapId = parseInt(mapId)
                const mapClimate = getMapsClimate(mapId)
                if (mapClimate && gatewaysIds.indexOf(mapId) < 0)
                {
                    adjacentClimates.push(mapClimate)
                    gatewaysIds.push(mapId)
                }
            }
        }
        currentMapClimate = getMapsClimate(map.id)
    }

    let adjacentHumidity = 0
    let adjacentCloudiness = 0
    let adjacentTemperature = 0
    const adjacentAmount = adjacentClimates.length

    if (adjacentAmount === 0 && !currentMapClimate && !isCurrentMapOutdoor()) return false
    else if (adjacentAmount > 0)
    {
        for (let i = 0; i < adjacentAmount; i++)
        {
            adjacentHumidity += getClimateHumidity(date, adjacentClimates[i])
            adjacentCloudiness += getClimateCloudiness(date, adjacentClimates[i])
            adjacentTemperature += getClimateTemperature(date, adjacentClimates[i])
        }
        adjacentHumidity /= adjacentAmount
        adjacentCloudiness /= adjacentAmount
        adjacentTemperature /= adjacentAmount

        if (currentMapClimate)
        {
            humidity = 0.5 * getClimateHumidity(date, currentMapClimate) + 0.5 * adjacentHumidity
            cloudiness = 0.5 * getClimateCloudiness(date, currentMapClimate) + 0.5 * adjacentCloudiness
            temperature = 0.5 * getClimateTemperature(date, currentMapClimate) + 0.5 * adjacentTemperature
        }
        else
        {
            humidity = adjacentHumidity
            cloudiness = adjacentCloudiness
            temperature = adjacentTemperature
        }
    }
    else
    {
        humidity = getClimateHumidity(date, currentMapClimate)
        cloudiness = getClimateCloudiness(date, currentMapClimate)
        temperature = getClimateTemperature(date, currentMapClimate)
    }

    return {
        [CHARACTERISTIC.HUMIDITY]: humidity,
        [CHARACTERISTIC.CLOUDINESS]: cloudiness,
        [CHARACTERISTIC.TEMPERATURE]: temperature
    }
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
    'rain-light': 0.5,
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

const CLOUDS_STRENGTH = {
    'day-cloud-small': 0.1,
    'rain-light': 0.1,
    'day-cloud-big': 0.15,
    'day-rain': 0.15,
    'rain': 0.15,
    'day-storm': 0.15,
    'overcast': 0.2,
    'storm': 0.2
}


export function getWeather(date)
{
    const characteristics = getCurrentRegionCharacteristic(date)
    if (characteristics)
    {
        if (characteristics.temperature > 25) // really hot, less cloudiness and humidity
        {
            characteristics.cloudiness *= 0.8
            characteristics.humidity *= 0.8
        }

        let cloudinessPart
        if (characteristics.cloudiness <= 0.15) cloudinessPart = 0
        else if (characteristics.cloudiness <= 0.35) cloudinessPart = 1
        else if (characteristics.cloudiness <= 0.60) cloudinessPart = 2
        else cloudinessPart = 3

        let humidityPart
        if (characteristics.humidity <= 0.25) humidityPart = 0
        else if (characteristics.humidity <= 0.50) humidityPart = 1
        else if (characteristics.humidity <= 0.75) humidityPart = 2
        else humidityPart = 3

        let weather = WEATHER_TABLE[cloudinessPart][humidityPart]

        if (characteristics.temperature < -3)
            weather = weather
                .replace('rain', 'snow')
                .replace(/^storm$/, 'snow-storm')
                .replace(/^day-storm$/, 'day-snow')
        else if (characteristics.temperature < 5)
            weather = weather
                .replace('rain', 'rain-with-snow')
                .replace(/^day-storm$/, 'day-rain-with-snow')

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
            temperature: characteristics.temperature,
            humidity: characteristics.humidity,
            cloudiness: characteristics.cloudiness
        }
    }
    else return {name: 'indoor'}
}

export function displayWeather(weatherName = getWeather(new Date()).name)
{
    const startingWeatherName = weatherName
    if (forcedWeathers.default) weatherName = forcedWeathers.default
    if (INTERFACE === 'NI')
    {
        if (forcedWeathers[Engine.map.d.id]) weatherName = forcedWeathers[Engine.map.d.id]
    }
    else
    {
        if (forcedWeathers[map.id]) weatherName = forcedWeathers[map.id]
    }

    // if the weather is forced, clear special effects
    if (startingWeatherName !== weatherName)
    {
        if (INTERFACE === 'NI')
        {
            Engine.weather.onClear()
        }
        else
        {
            window.clearWeather()
        }
    }

    clearEffects()
    if (weatherName === 'indoor')
    {
        $widget.css('display', 'none')
        setOpacityChange(0)
    }
    else if (GAME_WEATHERS.includes(weatherName))
    {
        $widget.css('display', 'none')
        setOpacityChange(0)

        if (INTERFACE === 'NI')
        {
            const uppercaseWeatherName = weatherName.charAt(0).toUpperCase() + weatherName.slice(1)
            Engine.weather.createWeather(uppercaseWeatherName)
        }
        else
        {
            window.changeWeather(weatherName)
        }
    }
    else
    {
        $widget.css('display', 'flex')
            .children('.nerthus__widget-image')
            .css('background-image', 'url(' + FILE_PREFIX + 'res/img/weather/icons/' + weatherName + '.png)')

        const descId = Math.floor(Math.random() * weatherDescriptions[weatherName].length)
        $widget.children('.nerthus__widget-desc')
            .text(weatherDescriptions[weatherName][descId])

        if (isCurrentMapOutdoor())
        {
            if (RAIN_STRENGTH[weatherName]) displayRain(RAIN_STRENGTH[weatherName])
            if (SNOW_STRENGTH[weatherName]) displaySnow(SNOW_STRENGTH[weatherName])
        }
        setOpacityChange(CLOUDS_STRENGTH[weatherName.replace('night', 'day')])
    }

    callEvent('displayWeather', weatherName)
}

export function setForcedWeather(weatherName, mapId = 'default')
{
    if (!weatherName || weatherName === 'reset') forcedWeathers[mapId] = ''
    else if (GAME_WEATHERS.includes(weatherName) || weatherDescriptions[weatherName])
    {
        forcedWeathers[mapId] = weatherName
    }
}

function startChangeTimer()
{
    const date = new Date()
    const hour = Math.floor((date.getUTCHours()) + 1)
    date.setUTCHours(hour, 0, 0)
    const timeout = date - new Date()
    setTimeout(function ()
    {
        displayWeather()
        startChangeTimer()
    }, timeout)
}

export function initWeather()
{
    if (settings.weather)
    {
        $widget = addWidget('weather')
        loadOnEveryMap(displayWeather)
        startChangeTimer()

        loadOnEveryMap(function ()
        {
            for (let i = 0; i < 20; i++)
            {
                let date = new Date().getTime()
                date += 1000 * 60 * 60 * i
                let newDate = new Date(date)
                console.log(getWeather(newDate))
            }
        })
    }
}
