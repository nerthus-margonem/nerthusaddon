nerthus.worldEdit = {}
nerthus.worldEdit.collisions = []
nerthus.worldEdit.npcs = []
nerthus.worldEdit.lights = []
nerthus.worldEdit.mapImages = []
nerthus.worldEdit.additionalDrawList = []
nerthus.worldEdit.nightDimValue = -1
nerthus.worldEdit.lightDrawList = []
nerthus.worldEdit.lightTypes = {}
nerthus.worldEdit.defaultEmotionsDraw = function ()
{
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

nerthus.worldEdit.addNpc = function (x, y, url, name, collision)
{
    let tip = name ? ' tip="<b>' + name + '</b>" ctip="t_npc"' : ""
    let $npc = $('<img id="_ng-' + x + '-' + y + '" src="' + url + '"' + tip + ' alt="nerthus-npc">')
        .css("position", "absolute")
        .appendTo('#base')
        .load(function ()
        {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
            let _x = 32 * x + 16 - Math.floor($(this).width() / 2)
            let _y = 32 * y + 32 - $(this).height()
            $(this)
                .css({
                    "top": "" + _y + "px",
                    "left": "" + _x + "px",
                    "z-index": y * 2 + 9
                })
        })
    if (collision)
        this.addCollision(x, y)

    this.npcs.push([$npc, x, y, url, name])
}

nerthus.worldEdit.addNpc_ni = function (x, y, url, name, collision)
{
    let exp = /(.*\/)(?!.*\/)((.*)\.(.*))/
    let match = exp.exec(url)

    let id = 10000000 + (x * 1000) + y //id that no other game npc will have
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
        let npath = CFG.npath
        CFG.npath = match[1]
        Engine.npcs.updateData(data)
        CFG.npath = npath
    }
    else
    {
        data[id].icon = "obj/cos.gif"
        Engine.npcs.updateData(data)
        let image = new Image()
        image.src = url

        let _x = 32 * x + 16 - Math.floor(image.width / 2)
        let _y = 32 * y + 32 - image.height
        let obj = {
            image: image,
            x: _x,
            y: _y,
            id: id
        }
        nerthus.worldEdit.additionalDrawList.push(obj)
    }


    if (collision)
        this.addCollision_ni()
}

nerthus.worldEdit.deleteNpc = function (x, y)
{
    $('#_ng-' + x + '-' + y).remove()
    this.deleteCollision(x, y)
}

nerthus.worldEdit.deleteNpc_ni = function (x, y)
{
    let id = 10000000 + (x * 1000) + y //id that no other game npc will have
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

nerthus.worldEdit.changeMap = function (url, plane)
{
    let $edit
    switch (plane)
    {
        case 1:
            $edit = $("#ground")
            break
        case 0:
        default:
            $edit = $("#bground")
            break
    }
    $edit.css("backgroundImage", "url(" + url + ")")
}

nerthus.worldEdit.changeMap_ni = function (url, plane)
{
    if (url)
    {
        let img = new Image()
        img.src = url
        nerthus.worldEdit.mapImages[plane] = img
    }
    else
        delete nerthus.worldEdit.mapImages[plane]
}

nerthus.worldEdit.startMapChanging_ni = function ()
{
    //manipulation of map
    let tmpMapDraw = Engine.map.draw
    Engine.map.draw = function (Canvas_rendering_context)
    {
        //draw normal map
        tmpMapDraw(Canvas_rendering_context)

        //draw new maps on top of map
        //'for in' so that we won't try to draw empty attribute by accidental
        for (const i in nerthus.worldEdit.mapImages)
            Canvas_rendering_context.drawImage(nerthus.worldEdit.mapImages[i], 0 - Engine.map.offset[0], 0 - Engine.map.offset[1])

        //draw goMark (red X on ground that shows you where you've clicked)
        if (Engine.map.goMark)
            Engine.map.drawGoMark(Canvas_rendering_context)

        //draw additional things/png npcs after map
        for (const i in nerthus.worldEdit.additionalDrawList)
        {
            Canvas_rendering_context.drawImage(
                nerthus.worldEdit.additionalDrawList[i].image,
                nerthus.worldEdit.additionalDrawList[i].x - Engine.map.offset[0],
                nerthus.worldEdit.additionalDrawList[i].y - Engine.map.offset[1])
        }
    }

    //manipulation of other
    let tmpEmotionsDraw = Engine.emotions.getDrawableList
    Engine.emotions.getDrawableList = function ()
    {
        let ret = tmpEmotionsDraw()
        //Darkness
        ret.push({
            draw: function (e)
            {
                let style = e.strokeStyle
                e.fillStyle = "#000"
                e.globalAlpha = nerthus.worldEdit.nightDimValue
                e.fillRect(0 - Engine.map.offset[0], 0 - Engine.map.offset[1], Engine.map.width, Engine.map.height)
                e.globalAlpha = 1.0
                e.fillStyle = style
            },
            getOrder: function ()
            {
                return 950 //darkness bellow lights but above everything else
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

nerthus.worldEdit.start = function ()
{

}

nerthus.worldEdit.start_ni = function ()
{
    this.addCollision = this.addCollision_ni
    this.deleteCollision = this.deleteCollision_ni
    this.addNpc = this.addNpc_ni
    this.deleteNpc = this.deleteNpc_ni
    this.changeMap = this.changeMap_ni
    this.changeLight = this.changeLight_ni
    this.addLights = this.addLights_ni

    this.startMapChanging_ni()
    // nerthus.loadOnEveryMap(this.startMapChanging_ni.bind(this))
}