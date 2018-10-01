try
{

nerthus.npc = {}
nerthus.npc.dialog = {}
nerthus.npc.dialog.decorator = {}
nerthus.npc.dialog.decorator.classes = {}
nerthus.npc.dialog.decorator.classes.LINE = "icon LINE_OPTION"
nerthus.npc.dialog.decorator.classes.EXIT = "icon LINE_EXIT"
nerthus.npc.dialog.parse_message = function(npc, index)
{
    return this.parse_placeholders(npc.dialog[index][0])
}
nerthus.npc.dialog.parse_replies = function(npc, index)
{
    var replies = []
    for(var i = 1; i < npc.dialog[index].length; i++)
        replies.push(this.parse_reply(npc.dialog[index][i], npc))
    return replies
}
nerthus.npc.dialog.parse_reply = function(row_reply, npc)
{
    var reply = this.parse_row_reply(row_reply)
    reply.text = this.parse_placeholders(reply.text)
    if(reply.to == "END")
    {
        reply.click = this.close.bind(this)
        reply.icon = this.decorator.classes.EXIT
    }
    else if(reply.to)
    {
        reply.click = this.open.bind(this, npc, reply.to)
        reply.icon = this.decorator.classes.LINE
    }
    return reply
}
nerthus.npc.dialog.parse_row_reply = function(reply)
{
    var reply = reply.split('->')
    return {text : reply[0], to : reply[1]}

}
nerthus.npc.dialog.parse_placeholders = function(text)
{
    return text.replace("#NAME", hero.nick)
}

nerthus.npc.dialog.open = function(npc, index)
{
    const message = this.parse_message(npc, index)
    const replies = this.parse_replies(npc, index)
    this.display(message, replies, npc)
    g.lock.add("nerthus_dialog")
}
nerthus.npc.dialog.display = function(message, replies, npc)
{
    $("#dlgin .message").empty().append(this.compose.message(message, npc))
    var $replies = $("#dlgin .replies").empty()
    $replies.append.apply($replies, replies.map(this.compose.reply.bind(this.compose)))
    $("#dialog").show()
}
nerthus.npc.dialog.close = function()
{
    $("#dialog").hide()
    g.lock.remove("nerthus_dialog")
}

nerthus.npc.dialog.compose = {}
nerthus.npc.dialog.compose.icon = function(type)
{
    return $("<div>").addClass(type)
}
nerthus.npc.dialog.compose.reply = function(reply)
{
    const icon = this.icon(reply.icon)
    return $("<li>").addClass(reply.icon)
                    .append(icon)
                    .append(reply.text)
                    .click(reply.click)
}
nerthus.npc.dialog.compose.message = function(message, npc)
{
    return "<h4><b>" + npc.name + "</b></h4>" + message
}

nerthus.npc.compose = function(npc)
{
    var click = npc.dialog ? this.dialog.open.bind(this.dialog, npc, 0) : null
    var $npc = $("<img>")
    .attr("src", this.resolve_url(npc.url))
    .css("position", "absolute")
    .css("z-index", npc.y * 2 + 9)
    .addClass("nerthus_npc")
    .click(this.click_wrapper(npc, click))
    .appendTo('#base')
    .load(function()
    {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
        const x = 32 * parseInt(npc.x) + 16 - Math.floor($(this).width() / 2)
        const y = 32 * parseInt(npc.y) + 32 - $(this).height()
        $(this).css({top:"" + y + "px", left: "" + x + "px"})
    })

    const tip = npc.hasOwnProperty("tip") ? npc.tip : "<b>" + npc.name + "</b>"
    if(tip)
        $npc.attr("ctip", "t_npc").attr("tip", tip)

    return $npc
}

nerthus.npc.resolve_url = function(url)
{
    if(url.startsWith("#"))
        return nerthus.addon.fileUrl(url.slice(1))
    return url
}

nerthus.npc.click_wrapper = function(npc, click_handler)
{
    if(!click_handler)
        return
    return function(event)
    {
        if (Math.abs(npc.x - hero.x) > 1 || Math.abs(npc.y - hero.y) > 1)
            hero.mClick(event);
        else
            click_handler()
    }
}

nerthus.npc.deploy = function(npc)
{
    if(!this.is_deployable(npc))
        return
    this.compose(npc)
    this.set_collision(npc)
}

nerthus.npc.is_deployable = function(npc)
{
    return this.time.validate(npc)
        && this.days.validate(npc)
        && this.date.validate(npc)
}

nerthus.npc.time = {}
nerthus.npc.time.validate = function(npc)
{
    if(!npc.time)
        return true

    const start = this.parse_to_date(npc.time.split("-")[0])
    const end = this.parse_to_date(npc.time.split("-")[1])
    const now = new Date()
    if(start > end)
        return start <= now || now <= end
    return start <= now && now <= end
}
nerthus.npc.time.parse_to_date = function(time_str)
{
    time_str = time_str.split(":")
    var date = new Date()
    date.setHours(time_str[0], time_str[1] || 0)
    return date
}

nerthus.npc.days = {}
nerthus.npc.days.validate = function(npc)
{
    if(!npc.days)
        return true

    const day_of_week = new Date().getDay()
    return npc.days.indexOf(day_of_week) > -1
}

nerthus.npc.date = {}
nerthus.npc.date.parse_to_date = function(date_str) //DD.MM.YYYY
{
    date_str = date_str.split(".")
    var date = new Date()
    const day = date_str[0] || date.getDay()
    const month = date_str[1] ? parseInt(date_str[1]) - 1 : date.getMonth() //month 0-11
    const year = date_str[2] || date.getFullYear()
    date.setFullYear(year, month, day)
    return date
}
nerthus.npc.date.validate = function(npc)
{
    if(!npc.date)
        return true

    const begin = this.parse_to_date(npc.date.split("-")[0])
    const end = this.parse_to_date(npc.date.split("-")[1])
    const now = new Date()
    return begin <= now && now <= end
}

nerthus.npc.set_collision = function(npc)
{
    if(npc.collision)
        g.npccol[parseInt(npc.x) + 256 * parseInt(npc.y)] = true
}

nerthus.npc.load_npcs = function()
{
    var file_with_npc = nerthus.addon.fileUrl("/npcs/map_" + map.id + ".json")
    this.load_npcs_from_file(file_with_npc)
}

nerthus.npc.load_npcs_from_file = function(url)
{
    $.getJSON(url, function(npcs){npcs.forEach(nerthus.npc.deploy.bind(nerthus.npc))})
}

nerthus.npc.start = function()
{
    nerthus.defer(this.load_npcs.bind(this))
}

nerthus.npc.start()

}catch(e) {log('nerthus npc: ' + e.message, 1);}
