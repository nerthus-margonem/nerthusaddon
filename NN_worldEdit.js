nerthus.worldEdit = {}
nerthus.worldEdit.collisions = []
nerthus.worldEdit.npcs = []
nerthus.worldEdit.lights = []
nerthus.worldEdit.mapImages = []
nerthus.worldEdit.additionalDrawList = []
nerthus.worldEdit.nightDimValue = -1
nerthus.worldEdit.lightDrawList = []
nerthus.worldEdit.lightTypes = {}

nerthus.worldEdit.weatherDisplayOn = false
nerthus.worldEdit.weatherCurrentFrameNumbers = {
    "rain": -1,
    "snow": -1
}
nerthus.worldEdit.weatherLastFrameNumber = {
    "rain": -1,
    "snow": -1
}
nerthus.worldEdit.weatherInterval = {
    "rain": -1,
    "snow": -1
}
nerthus.worldEdit.weatherImages = {
    "rain": [],
    "snow": []
}
nerthus.worldEdit.currentWeatherEffects = []

nerthus.worldEdit.defaultEmotionsDraw = function () {}



nerthus.worldEdit.setWeatherUrls = function ()
{
    const rainFramesCount = 3
    const snowFramesCount = 5
    const rainInterval = 100
    const snowInterval = 400


    this.weatherLastFrameNumber = {
        "rain": rainFramesCount - 1,
        "snow": snowFramesCount - 1
    }
    this.weatherInterval = {
        "rain": rainInterval,
        "snow": snowInterval
    }

    this.weatherImages.rain[0] = new Image()
    this.weatherImages.rain[0].src = nerthus.graf.rain
    for (let i = 1; i <= rainFramesCount; i++)
    {
        this.weatherImages.rain[i] = new Image()
        this.weatherImages.rain[i].src = nerthus.addon.fileUrl("img/weather/rain_frame_" + i + ".png")
    }

    this.weatherImages.snow[0] = new Image()
    this.weatherImages.snow[0].src = nerthus.graf.snow
    for (let i = 1; i <= snowFramesCount; i++)
    {
        this.weatherImages.snow[i] = new Image()
        this.weatherImages.snow[i].src = nerthus.addon.fileUrl("img/weather/snow_frame_" + i + ".png")
    }
}

nerthus.worldEdit.currentWeatherInterval = 0
nerthus.worldEdit.weatherIntervalClock = function ()
{
    nerthus.worldEdit.currentWeatherInterval += 100
    if (nerthus.worldEdit.currentWeatherInterval === 1600)
        nerthus.worldEdit.currentWeatherInterval = 0


    const len = nerthus.worldEdit.currentWeatherEffects.length
    for (let i = 0; i < len; i++)
    {
        const name = nerthus.worldEdit.currentWeatherEffects[i][0]
        if (nerthus.worldEdit.currentWeatherInterval % nerthus.worldEdit.weatherInterval[name] === 0)
        {
            nerthus.worldEdit.weatherCurrentFrameNumbers[name]++
            if (nerthus.worldEdit.weatherCurrentFrameNumbers[name] > nerthus.worldEdit.weatherLastFrameNumber[name])
                nerthus.worldEdit.weatherCurrentFrameNumbers[name] = 0
        }
    }
}

nerthus.worldEdit.setWeatherClock = function ()
{
    setInterval(this.weatherIntervalClock, 100)
}

nerthus.worldEdit.clearWeather = function ()
{
    $(".nWeather").remove()
}
nerthus.worldEdit.clearWeather_ni = function ()
{
    this.currentWeatherEffects = []
}
nerthus.worldEdit.displayWeatherEffect = function (name, opacity)
{
    $("<div class='nWeather'/>")
        .css({
            width: map.x * 32,
            height: map.y * 32,
            backgroundImage: 'url(' + nerthus.graf[name] + ')',
            zIndex: map.y * 2 + 9,
            position: "absolute",
            top: "0",
            left: "0",
            pointerEvents: 'none',
            opacity: opacity ? opacity : 1
        })
        .appendTo("#ground")
}

nerthus.worldEdit.displayWeatherEffect_ni = function (name, opacity)
{
    this.currentWeatherEffects.push([name, opacity])
}


nerthus.worldEdit.addCollision = function (x, y)
{
    g.npccol[x + 256 * y] = true
}

nerthus.worldEdit.addCollision_ni = function (x, y)
{
    Engine.map.col.set(x, y, 2)
}





nerthus.worldEdit.getCurrentWeatherPaint = function ()
{
    return {
        draw: function (e)
        {
            if (nerthus.worldEdit.weatherDisplayOn)
            {
                const len = nerthus.worldEdit.currentWeatherEffects.length
                for (let i = 0; i < len; i++)
                {
                    const name = nerthus.worldEdit.currentWeatherEffects[i][0]
                    const opacity = nerthus.worldEdit.currentWeatherEffects[i][1]
                    const img = nerthus.worldEdit.weatherImages[name][nerthus.worldEdit.weatherCurrentFrameNumbers[name] + 1]

                    //check if img has been loaded correctly to not stop entire game in case of error
                    if (img.complete && img.naturalWidth !== 0)
                    {
                        const pattern = e.createPattern(img, "repeat")
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
                }
            }
        },
        getOrder: function ()
        {
            return 940 //weather bellow lights and weather but above everything else
        }
    }
}

nerthus.worldEdit.startOtherChanging_ni = function ()
{
    const tmpEmotionsDraw = Engine.emotions.getDrawableList
    Engine.emotions.getDrawableList = function ()
    {
        let ret = tmpEmotionsDraw()
        //Darkness
        ret.push(nerthus.worldEdit.getCurrentDarknessPaint())
        //weather
        ret.push(nerthus.worldEdit.getCurrentWeatherPaint())
        return ret
    }
    this.defaultEmotionsDraw = Engine.emotions.getDrawableList
}


nerthus.worldEdit.startWorldEdit_ni = function ()
{
    this.startMapChanging_ni()
    this.startOtherChanging_ni()
}



nerthus.worldEdit.start = function ()
{
    nerthus.loadOnEveryMap(this.checkCurrentMap.bind(this))
}

nerthus.worldEdit.start_ni = function ()
{
    nerthus.onDefined("Engine.map.d.id", () =>
    {
        this.changeGameNpc = this.changeGameNpc_ni
        this.addCollision = this.addCollision_ni
        this.deleteCollision = this.deleteCollision_ni
        this.addNpc = this.addNpc_ni
        this.deleteNpc = this.deleteNpc_ni
        this.changeLight = this.changeLight_ni

        this.addLights = this.addLights_ni
        this.resetLight = this.resetLight_ni

        this.displayWeatherEffect = this.displayWeatherEffect_ni
        this.clearWeather = this.clearWeather_ni

        this.hideGameNpc = this.hideGameNpc_ni

        this.startWorldEdit_ni()

        nerthus.loadOnEveryMap(this.readdNpcList_ni.bind(this))
    })
}
