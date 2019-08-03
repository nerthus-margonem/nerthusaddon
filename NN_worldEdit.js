nerthus.worldEdit = {}
nerthus.worldEdit.collisions = []
nerthus.worldEdit.npcs = []
nerthus.worldEdit.lights = []
nerthus.worldEdit.mapImages = []
nerthus.worldEdit.additionalDrawList = []
nerthus.worldEdit.nightDimValue = -1
nerthus.worldEdit.lightDrawList = []
nerthus.worldEdit.lightTypes = {}
nerthus.worldEdit.npcHideList = []

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

    this.weatherImages.rain[0] = new Image
    this.weatherImages.rain[0].src = nerthus.graf.rain
    for (let i = 1; i <= rainFramesCount; i++)
    {
        this.weatherImages.rain[i] = new Image
        this.weatherImages.rain[i].src = nerthus.addon.fileUrl("img/weather/rain_frame_" + i + ".png")
    }

    this.weatherImages.snow[0] = new Image
    this.weatherImages.snow[0].src = nerthus.graf.snow
    for (let i = 1; i <= snowFramesCount; i++)
    {
        this.weatherImages.snow[i] = new Image
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

nerthus.worldEdit.deleteCollision = function (x, y)
{
    delete g.npccol[x + 256 * y]
}

nerthus.worldEdit.deleteCollision_ni = function (x, y)
{
    Engine.map.col.unset(x, y, 2)
}

nerthus.worldEdit.addNpc = function (x, y, url, name, collision, map_id)
{
    if (typeof map_id === "undefined" || parseInt(map_id) === map.id)
    {
        const tip = name ? ' tip="<b>' + name + '</b>" ctip="t_npc"' : ""
        const $npc = $('<img id="_ng-' + x + '-' + y + '" src="' + url + '"' + tip + ' alt="nerthus-npc">')
            .css("position", "absolute")
            .appendTo('#base')
            .load(function ()
            {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
                const _x = 32 * x + 16 - Math.floor($(this).width() / 2)
                const _y = 32 * y + 32 - $(this).height()
                $(this)
                    .css({
                        "top": "" + _y + "px",
                        "left": "" + _x + "px",
                        "z-index": y * 2 + 9
                    })
            })
        if (collision)
            this.addCollision(x, y)

        this.npcs.push([$npc, x, y, url, name, collision, map_id])
    }
}

nerthus.worldEdit.addNpc_ni = function (x, y, url, name, collision, map_id)
{
    this.npcs.push([x, y, url, name, collision, map_id])
    if (typeof map_id === "undefined" || parseInt(map_id) === Engine.map.d.id)
        this.paintNpc_ni(x, y, url, name, collision, map_id)
}

nerthus.worldEdit.paintNpc_ni = function (x, y, url, name, collision, map_id)
{
    const exp = /(.*\/)(?!.*\/)((.*)\.(.*))/
    const match = exp.exec(url)

    const id = 10000000 + (x * 1000) + y //id that no other game npc will have
    let data = {}
    data[id] = {
        actions: 0,
        grp: 0,
        nick: name,
        type: name === "" ? 4 : 0,
        wt: 0,
        x: x,
        y: y
    }
    if (match[4] === "gif")
    {
        data[id].icon = match[2]
        const npath = CFG.npath
        CFG.npath = match[1]
        Engine.npcs.updateData(data)
        CFG.npath = npath
    }
    else
    {
        data[id].icon = "obj/cos.gif"
        Engine.npcs.updateData(data)
        const image = new Image()
        image.src = url

        const _x = 32 * x + 16 - Math.floor(image.width / 2)
        const _y = 32 * y + 32 - image.height
        const obj = {
            image: image,
            x: _x,
            y: _y,
            id: id,
            map_id: map_id
        }
        nerthus.worldEdit.additionalDrawList.push(obj)
    }


    if (collision && (typeof map_id === "undefined" || parseInt(map_id) === Engine.map.d.id))
        this.addCollision_ni(x, y)
    else
        this.deleteCollision_ni(x, y, 2) //apparently NI adds default collision when adding NPC
}


nerthus.worldEdit.readdNpcList_ni = function ()
{
    this.npcs.forEach(function (npc)
    {
        console.log(npc)
        console.log(parseInt(npc[5]))
        console.log(Engine.map.d.id)
        if (typeof npc[5] === "undefined" || parseInt(npc[5]) === Engine.map.d.id)
            nerthus.worldEdit.paintNpc_ni(npc[0], npc[1], npc[2], npc[3], npc[4], npc[5])
    })
}

nerthus.worldEdit.deleteNpc = function (x, y, map_id)
{
    if (typeof map_id === "undefined" || parseInt(map_id) === map.id)
    {
        $('#_ng-' + x + '-' + y).remove()
        this.deleteCollision(x, y)
    }
}

nerthus.worldEdit.deleteNpc_ni = function (x, y, map_id)
{
    if (typeof map_id === "undefined" || parseInt(map_id) === Engine.map.d.id)
    {
        const id = 10000000 + (x * 1000) + y //id that no other game npc will have
        let data = {}
        data[id] = {
            del: 1,
            id: id.toString()
        }
        Engine.npcs.updateData(data)
        for (const i in nerthus.worldEdit.additionalDrawList)
        {
            if (nerthus.worldEdit.additionalDrawList[i].id === id)
                delete nerthus.worldEdit.additionalDrawList[i]
        }
        this.deleteCollision_ni(x, y)
    }


    for (let i = 0; i < this.npcs.length; i++)
        if (this.npcs[i][0] === x && this.npcs[i][1] === y)
            if (typeof map_id === "undefined" || parseInt(map_id) === parseInt(this.npcs[i][5]))
                this.npcs.splice(i, 1)
}

nerthus.worldEdit.changeMap = function (url, layer)
{
    //never change $("#bground") backgroundImage, as it's default one and we don't want to display black map
    if (url)
    {
        const img = new Image()
        img.src = url
        this.mapImages[layer] = img
    }
    else
    {
        delete this.mapImages[layer]

        this.mapImages = this.mapImages.filter(function (el)
        {
            return el != null
        })
    }

    const mapImagesLen = this.mapImages.length
    if (mapImagesLen > 0)
        $("#ground").css("backgroundImage", "url(" + this.mapImages[mapImagesLen - 1].src + ")")
}

nerthus.worldEdit.changeMap_ni = function (url, layer)
{
    if (url)
    {
        let img = new Image()
        img.src = url
        this.mapImages[layer] = img
    }
    else
    {

        delete this.mapImages[layer]

        this.mapImages = this.mapImages.filter(function (el)
        {
            return el != null
        })
    }
}

nerthus.worldEdit.startMapChanging_ni = function ()
{
    //manipulation of map
    const tmpMapDraw = Engine.map.draw
    Engine.map.draw = function (Canvas_rendering_context)
    {
        //draw normal map
        tmpMapDraw.call(Engine.map, Canvas_rendering_context)

        //draw new maps on top of map

        const mapImagesLength = nerthus.worldEdit.mapImages.length
        /*
        // currently on SI there is no (programmed) way of displaying more than 1 layer.
        // So this part of code, while better than current one, is commented out to remain consistent.

        for (let i = 0; i < mapImagesLen; i++)
            Canvas_rendering_context.drawImage(nerthus.worldEdit.mapImages[i], 0 - Engine.map.offset[0], 0 - Engine.map.offset[1])
         */
        if (mapImagesLength > 0)
            Canvas_rendering_context.drawImage(
                nerthus.worldEdit.mapImages[mapImagesLength - 1],
                0 - Engine.map.offset[0],
                0 - Engine.map.offset[1])


        //draw goMark (red X on ground that shows you where you've clicked)
        if (Engine.map.goMark)
            Engine.map.drawGoMark(Canvas_rendering_context)

        //draw additional things/png npcs after map
        const drawListLength = nerthus.worldEdit.additionalDrawList.length
        for (let i = 0; i < drawListLength; i++)
        {
            if (typeof nerthus.worldEdit.additionalDrawList[i].map_id === "undefined" ||
                nerthus.worldEdit.additionalDrawList[i].map_id === Engine.map.d.id)

                Canvas_rendering_context.drawImage(
                    nerthus.worldEdit.additionalDrawList[i].image,
                    nerthus.worldEdit.additionalDrawList[i].x - Engine.map.offset[0],
                    nerthus.worldEdit.additionalDrawList[i].y - Engine.map.offset[1])
        }
    }

    //manipulation of other
    const tmpEmotionsDraw = Engine.emotions.getDrawableList
    Engine.emotions.getDrawableList = function ()
    {
        let ret = tmpEmotionsDraw()
        //Darkness
        ret.push({
            draw: function (e)
            {
                const style = e.fillStyle
                e.fillStyle = "#000"
                e.globalAlpha = nerthus.worldEdit.nightDimValue === -1 ? 0 : nerthus.worldEdit.nightDimValue
                e.fillRect(0 - Engine.map.offset[0], 0 - Engine.map.offset[1], Engine.map.width, Engine.map.height)
                e.globalAlpha = 1.0
                e.fillStyle = style
            },
            getOrder: function ()
            {
                return 950 //darkness bellow lights but above everything else
            }
        })
        //weather
        ret.push({
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
        })
        return ret
    }
    this.defaultEmotionsDraw = Engine.emotions.getDrawableList
}

nerthus.worldEdit.resetLightChanging_ni = function ()
{
    let tmpEmotionsDraw = this.defaultEmotionsDraw
    Engine.emotions.getDrawableList = function ()
    {
        let ret = tmpEmotionsDraw()
        //Lights
        let lightListLen = nerthus.worldEdit.lightDrawList.length || 0
        for (let i = 0; i < lightListLen; i++)
        {
            ret.push({
                draw: function (e)
                {
                    e.drawImage(
                        nerthus.worldEdit.lightDrawList[i].image,
                        nerthus.worldEdit.lightDrawList[i].x - Engine.map.offset[0],
                        nerthus.worldEdit.lightDrawList[i].y - Engine.map.offset[1])
                },
                getOrder: function ()
                {
                    //todo: make it bellow maploading
                    return 1000 //light always on top
                }
            })

        }
        return ret
    }
}

nerthus.worldEdit.addLights = function (lights)
{
    nerthus.worldEdit.lightDrawList = []
    for (const i in lights)
    {
        let lt = nerthus.worldEdit.lightTypes[lights[i].type]
        $('<div></div>')
            .css({
                background: 'url(' + lt.url + ')',
                width: lt.width,
                height: lt.height,
                zIndex: map.y * 2 + 12,
                position: 'absolute',
                left: parseInt(lights[i].x),
                top: parseInt(lights[i].y),
                pointerEvents: "none"
            })
            .addClass("nightLight")
            .attr("type", lights[i].type)
            .appendTo("#ground")
    }
}

nerthus.worldEdit.addLights_ni = function (lights)
{
    nerthus.worldEdit.lightDrawList = []
    for (const i in lights)
    {
        let lt = nerthus.worldEdit.lightTypes[lights[i].type]

        let image = new Image()
        image.src = lt.url
        let obj = {
            image: image,
            x: parseInt(lights[i].x),
            y: parseInt(lights[i].y)
        }
        nerthus.worldEdit.lightDrawList.push(obj)
    }
    nerthus.worldEdit.resetLightChanging_ni()
}

nerthus.worldEdit.changeDefaultLight = function (opacity)
{
    if (opacity && nerthus.worldEdit.nightDimValue === -1)
    {
        opacity = 0
        const hour = new Date().getHours()
        if (hour >= 18) opacity = 0.3
        if (hour >= 21) opacity = 0.6
        if (hour <= 4) opacity = 0.8
        if (map.mainid !== 0)
            opacity = 0

        let $ground = $("#ground")

        $("<div id=nNight></div>")
            .css({
                height: $ground.css("height"),
                width: $ground.css("width"),
                zIndex: map.y * 2 + 11,
                opacity: opacity,
                pointerEvents: "none",
                backgroundColor: "black"
            })
            .appendTo("#ground")
            .draggable()
    }
}

nerthus.worldEdit.changeLight = function (opacity)
{
    if (typeof opacity === "undefined")
    {
        opacity = 0
        const hour = new Date().getHours()
        if (hour >= 18) opacity = 0.3
        if (hour >= 21) opacity = 0.6
        if (hour <= 4) opacity = 0.8
        if (map.mainid !== 0)
            opacity = 0
    }

    let $ground = $("#ground")
    let $night = $("#nNight")
    if (!$night.get(0))
        $night = $("<div id=nNight></div>")

    $night
        .css({
            height: $ground.css("height"),
            width: $ground.css("width"),
            zIndex: map.y * 2 + 11,
            opacity: opacity,
            pointerEvents: "none",
            backgroundColor: "black"
        })
        .appendTo("#ground")
        .draggable()
    nerthus.worldEdit.nightDimValue = opacity
}

nerthus.worldEdit.changeLight_ni = function (opacity)
{
    if (typeof opacity === "undefined")
    {
        opacity = 0
        const hour = new Date().getHours()
        if (hour >= 18) opacity = 0.3
        if (hour >= 21) opacity = 0.6
        if (hour <= 4) opacity = 0.8
        if (Engine.map.d.mainid !== 0)
            opacity = 0
    }

    nerthus.worldEdit.nightDimValue = opacity
}


nerthus.worldEdit.hideGameNpc = function (id)
{
    nerthus.worldEdit.npcHideList.push(id)

    const $style = $("#Nerthus-npc-hiding")
    if (nerthus.options.hideNpcs)
        if ($style[0])
            $style.append("#npc" + id + "{display: none}")
}
nerthus.worldEdit.startNpcHiding = function ()
{
    $("head").append("<style id='Nerthus-npc-hiding'></style>")
    const $style = $("#Nerthus-npc-hiding")

    const len = nerthus.worldEdit.npcHideList.length
    for (let id = 0; id < len; id++)
        $style.append("#npc" + nerthus.worldEdit.npcHideList[id] + "{display: none}")
}

nerthus.worldEdit.startNpcHiding_ni = function ()
{
    const tmpNpcDraw = Engine.npcs.getDrawableList
    Engine.npcs.getDrawableList = function ()
    {
        let ret = tmpNpcDraw()
        let retLen = ret.length
        const listLen = nerthus.worldEdit.npcHideList.length
        for (let i = 0; i < retLen; i++)
        {
            for (let j = 0; j < listLen; j++)
            {
                if (ret[i].d.id === nerthus.worldEdit.npcHideList[j])
                {
                    ret.splice(i, 1)
                    retLen = retLen - 1
                    break
                }
            }

        }
        return ret
    }
}

nerthus.worldEdit.hideGameNpc_ni = function (id)
{
    nerthus.worldEdit.npcHideList.push(id.toString())
}


nerthus.worldEdit.purgeNpcList = function ()
{
    this.npcHideList = []
}

nerthus.worldEdit.start = function ()
{
    if (nerthus.options.hideNpcs)
        nerthus.defer(this.startNpcHiding.bind(this))
}

nerthus.worldEdit.start_ni = function ()
{
    if (typeof Engine.map.d.id === "undefined")
        setTimeout(nerthus.worldEdit.start_ni.bind(this), 500)
    else
    {
        this.addCollision = this.addCollision_ni
        this.deleteCollision = this.deleteCollision_ni
        this.addNpc = this.addNpc_ni
        this.deleteNpc = this.deleteNpc_ni
        this.changeMap = this.changeMap_ni
        this.changeLight = this.changeLight_ni
        this.addLights = this.addLights_ni

        this.displayWeatherEffect = this.displayWeatherEffect_ni
        this.clearWeather = this.clearWeather_ni

        this.hideGameNpc = this.hideGameNpc_ni

        if (nerthus.options.hideNpcs)
            this.startNpcHiding_ni()
        this.startMapChanging_ni()

        nerthus.loadOnEveryMap(this.readdNpcList_ni.bind(this))
    }
}