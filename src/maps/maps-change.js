/*
 * There are two types of *map you can do
 * Normal *map that should work on every map
 * And *map with mapId that should only work on map with that id
 *
 * *map with map id always beat *map without map id
 *
 * To reset map with id use *resetMap [mapId]
 * To reset map without id use *map (without arguments)
 */
nerthus.worldEdit.checkMaps = function (mapId)
{
    for (let i = this.mapImages.length - 1; 0 <= i; i--)
    {
        if (i > 1)
        {
            for (let j = this.mapImages[i].length - 1; 0 <= j; j--)
                if (this.mapImages[i][j] && (this.mapImages[i][j].mapId === mapId || isNaN(this.mapImages[i][j].mapId)))
                    return this.mapImages[i][j].img
        }
        else if (this.mapImages[i] && (this.mapImages[i].mapId === mapId || isNaN(this.mapImages[i].mapId)))
            return this.mapImages[i].img
    }
}

nerthus.worldEdit.checkCurrentMap = function ()
{
    const customMapImage = this.checkMaps(map.id)
    if (customMapImage)
        $("#ground").css("background", "url(" + customMapImage.src + ")")
    else
        $("#ground").css("background", "")
}

export function changeMap(url, layer, mapId)
{
    mapId = parseInt(mapId)

    if (layer > 1 && !this.mapImages[layer]) this.mapImages[layer] = []

    if (url)
    {
        const img = new Image()
        img.src = url

        if (layer > 1)
            this.mapImages[layer].push({
                img: img,
                mapId: mapId
            })
        else
            this.mapImages[layer] = {
                img: img,
                mapId: mapId
            }
    }
    else
    {
        if (layer > 1)
            this.mapImages[layer] = this.mapImages[layer].filter(function (el)
            {
                return el.mapId !== mapId
            })
        else
            delete this.mapImages[layer]
    }
    if (typeof map !== "undefined")
        this.checkCurrentMap()
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
        const customMapImage = nerthus.worldEdit.checkMaps(Engine.map.d.id)
        if (customMapImage)
        {
            Canvas_rendering_context.drawImage(
                customMapImage,
                0 - Engine.map.offset[0],
                0 - Engine.map.offset[1])
        }


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
}
