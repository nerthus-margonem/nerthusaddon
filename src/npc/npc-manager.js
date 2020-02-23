nerthus.npc = {}
nerthus.npc.list = {}


function CustomNpc(x, y, url, nick, collision, dialog)
{
    this.x = parseInt(x)
    this.y = parseInt(y)

    this.id = nerthus.worldEdit.coordsToId(x, y)

    this.nick = nick
    this.type = this.nick === "" ? 4 : 0

    this.icon = nerthus.npc.resolve_url(url)

    this.actions = 0
    this.grp = 0
    this.wt = 0

    this.collision = collision
    this.dialog = dialog
}

nerthus.npc.compose = function (npc)
{
    const click = npc.dialog ? this.dialog.open.bind(this.dialog, npc, 0) : null

    const $npc = $('<div id="npc' + npc.id + '" class="npc nerthus-npc"></div>')
        .css({
            backgroundImage: 'url(' + npc.icon + ')',
            zIndex: npc.y * 2 + 9,
            left: npc.x * 32,
            top: npc.y * 32 - 16,
            pointerEvents: npc.type === 4 ? 'none' : 'auto'
        })

    const img = new Image()
    img.onload = function ()
    {
        const width = img.width
        const height = img.height

        const tmpLeft = npc.x * 32 + 16 - Math.round(width / 2) + ((npc.type > 3 && !(width % 64)) ? -16 : 0)
        const wpos = Math.round(this.x) + Math.round(this.y) * 256
        let wat
        if (map.water && map.water[wpos])
            wat = map.water[wpos] / 4
        $npc.css({
            left: tmpLeft,
            top: npc.y * 32 + 32 - height + (wat > 8 ? 0 : 0),
            width: (tmpLeft + width > map.x * 32 ? map.x * 32 - tmpLeft : width),
            height: height - (wat > 8 ? ((wat - 8) * 4) : 0)
        })
    }
    img.src = npc.icon
    $npc.appendTo('#base')
    if (npc.nick)
        $npc.attr({
            ctip: 't_npc',
            tip: npc.nick
        })
    if (click) $npc.click(this.click_wrapper(npc, click))

    return $npc
}

nerthus.npc.compose_ni = function (npc)
{
    const data = {}
    data[npc.id] = npc

    const npath = CFG.npath
    CFG.npath = ""
    Engine.npcs.updateData(data)
    CFG.npath = npath

    this.dialog.list[npc.id] = npc.dialog
    return data
}

nerthus.npc.resolve_url = function (url)
{
    if (url.startsWith("#"))
        return nerthus.addon.fileUrl(url.slice(1))
    return url
}

nerthus.npc.click_wrapper = function (npc, click_handler)
{
    if (!click_handler)
        return
    return function (event)
    {
        if (Math.abs(npc.x - hero.x) > 1 || Math.abs(npc.y - hero.y) > 1)
            hero.mClick(event)
        else
            click_handler()
    }
}

nerthus.npc.deploy = function (npc)
{
    if (!this.is_deployable(npc)) return 1
    switch (npc.type)
    {
        case 'delete':
            if (!this.is_deletable(npc))
                return
            return nerthus.worldEdit.hideGameNpc(npc.id, npc.lvl === 0)
        case 'change':
            return nerthus.worldEdit.changeGameNpc(npc)
        default:
            const tip = npc.hasOwnProperty('tip') ? npc.tip : '<b>' + npc.name + '</b>'
            const customNpc = new this.CustomNpc(npc.x, npc.y, npc.url, tip, npc.collision, npc.dialog)

            this.list[customNpc.id] = customNpc
            const $npc = this.compose(customNpc)
            this.set_collision(customNpc)
            return $npc
    }
}

nerthus.npc.is_deployable = function (npc)
{
    return this.time.validate(npc)
        && this.days.validate(npc)
        && this.date.validate(npc)
}

nerthus.npc.is_deletable = function (npc)
{
    return npc.lvl === 0 || npc.lvl + 13 < hero.lvl
}

nerthus.npc.is_deletable_ni = function (npc)
{
    return npc.lvl === 0 || npc.lvl + 13 < Engine.hero.d.lvl
}

nerthus.npc.time = {}
nerthus.npc.time.validate = function (npc)
{
    if (!npc.time)
        return true

    const start = this.parse_to_date(npc.time.split("-")[0])
    const end = this.parse_to_date(npc.time.split("-")[1])
    const now = new Date()
    if (start > end)
        return start <= now || now <= end
    return start <= now && now <= end
}
nerthus.npc.time.parse_to_date = function (time_str)
{
    time_str = time_str.split(":")
    var date = new Date()
    date.setHours(time_str[0], time_str[1] || 0)
    return date
}

nerthus.npc.days = {}
nerthus.npc.days.validate = function (npc)
{
    if (!npc.days)
        return true

    const day_of_week = new Date().getDay()
    return npc.days.indexOf(day_of_week) > -1
}

nerthus.npc.date = {}
nerthus.npc.date.parse_to_date = function(date_str) //DD.MM.YYYY
{
    date_str = date_str.split(".")
    let date = new Date()
    const day = date_str[0] || date.getDay()
    const month = date_str[1] ? parseInt(date_str[1]) - 1 : date.getMonth() //month 0-11
    const year = date_str[2] || date.getFullYear()
    date.setFullYear(year, month, day)
    return date
}
nerthus.npc.date.validate = function (npc)
{
    if (!npc.date)
        return true

    const begin = this.parse_to_date(npc.date.split('-')[0])
    const end = this.parse_to_date(npc.date.split('-')[1])

    const now = new Date()
    if (begin > end)
        begin.setTime(begin.getTime() - 31556952000) //1 year prior, for winter dates for example 21.11-20.03

    return begin <= now && now <= end
}

nerthus.npc.set_collision = function(npc)
{
    if(npc.collision)
        g.npccol[parseInt(npc.x) + 256 * parseInt(npc.y)] = true
}

nerthus.npc.set_collision_ni = function(npc)
{
    if(npc.collision)
        Engine.map.col.set(parseInt(npc.x), parseInt(npc.y), 2)
}


nerthus.npc.reset_npcs = function ()
{
    $(".nerthus-npc").remove()
}

nerthus.npc.load_npcs = function ()
{
    const file_with_npc = nerthus.addon.fileUrl("/npcs/map_" + map.id + ".json")
    this.load_npcs_from_file(file_with_npc)
}

nerthus.npc.load_npcs_ni = function ()
{
    if (Engine.map.d.id === undefined)
        setTimeout(this.load_npcs_ni.bind(this), 500)
    else
    {
        const file_with_npc = nerthus.addon.fileUrl("npcs/map_" + Engine.map.d.id + ".json")
        this.load_npcs_from_file(file_with_npc)
    }
}

nerthus.npc.load_npcs_from_file = function (url)
{
    $.getJSON(url, function (npcs)
    {
        if (npcs)
            npcs.forEach(nerthus.npc.deploy.bind(nerthus.npc))
    })
}

nerthus.npc.start = function ()
{
    nerthus.loadOnEveryMap(function ()
    {
        nerthus.npc.reset_npcs()
        nerthus.npc.load_npcs()
    })
}

nerthus.npc.start_ni = function ()
{
    nerthus.onDefined("Engine.map", () =>
    {
        this.set_collision = this.set_collision_ni
        this.compose = this.compose_ni
        this.load_npcs = this.load_npcs_ni
        this.is_deletable = this.is_deletable_ni
        this.dialog.parse_placeholders = this.dialog.parse_placeholders_ni
        this.dialog.open = this.dialog.open_ni

        const _nerthg = _g
        window._g = function (task, callback, payload)
        {
            let id = nerthus.npc.dialog.check(task)
            if (id > 0)
                nerthus.npc.dialog.open_ni(id, 0)
            _nerthg(task, callback, payload)
        }

        this.load_npcs()
        nerthus.loadOnEveryMap(this.load_npcs.bind(this))
    })
}
