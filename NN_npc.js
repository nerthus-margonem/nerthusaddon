nerthus.npc = {}
nerthus.npc.list = {}
nerthus.npc.dialog = {}
nerthus.npc.dialog.list = {}
nerthus.npc.dialog.decorator = {}
nerthus.npc.dialog.decorator.classes = {}
nerthus.npc.dialog.decorator.classes.LINE = "icon LINE_OPTION"
nerthus.npc.dialog.decorator.classes.EXIT = "icon LINE_EXIT"

nerthus.npc.CustomNpc = function (x, y, url, nick, collision, dialog)
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

nerthus.npc.dialog.parse_message = function(npc, index)
{
    return this.parse_placeholders(npc.dialog[index][0])
}
nerthus.npc.dialog.parse_replies = function (npc, index)
{
    let replies = []
    for (let i = 1; i < npc.dialog[index].length; i++)
        replies.push(this.parse_reply(npc.dialog[index][i], npc))
    return replies
}

nerthus.npc.dialog.parse_replies_ni = function (dialog, id)
{
    let replies = []
    for (let i = 1; i < dialog.length; i++)
        replies.push(this.parse_reply(dialog[i], id))
    return replies
}

nerthus.npc.dialog.parse_reply = function (row_reply, npc)
{
    let reply = this.parse_row_reply(row_reply)
    reply.text = this.parse_placeholders(reply.text)
    if (reply.to === "END")
    {
        reply.click = function ()
        {
            nerthus.npc.dialog.close()
            nerthus.npc.dialog.removeScroll()
        }
        reply.icon = this.decorator.classes.EXIT
    }
    else if (reply.to)
    {
        reply.click = function ()
        {
            nerthus.npc.dialog.removeScroll()
            nerthus.npc.dialog.open(npc, reply.to)
            nerthus.npc.dialog.addScroll()
            $("#dlgin").scrollTop(0)
        }
        reply.icon = this.decorator.classes.LINE
    }
    return reply
}

nerthus.npc.dialog.parse_row_reply = function (reply)
{
    reply = reply.split('->')
    return {text: reply[0], to: reply[1]}
}

nerthus.npc.dialog.parse_placeholders = function (text)
{
    return text.replace("#NAME", hero.nick)
}

nerthus.npc.dialog.parse_placeholders_ni = function (text)
{
    return text.replace("#NAME", Engine.hero.d.nick)
}

nerthus.npc.dialog.open = function (npc, index)
{
    const message = this.parse_message(npc, index)
    const replies = this.parse_replies(npc, index)
    this.display(message, replies, npc)
    g.lock.add("nerthus_dialog")

    map.resizeView(512,192)
}

nerthus.npc.dialog.open_ni = function (id, index)
{
    let dialog = this.list[id][index]
    const message = this.parse_placeholders(dialog[0])
    const replies = this.parse_replies_ni(dialog, id)
    this.display_ni(message, replies, id)
    Engine.lock.add("nerthus_dialog")
}

nerthus.npc.dialog.addScroll = function ()
{
    clearInterval(g.talk.scrollCheckInterval)
    g.talk.scrollCheckInterval = setInterval(function ()
    {
        if ($('#talkscroll').length) return
        if ($('#dlgin').height() < ($('#dlgin .message').innerHeight() + $('#dlgin .replies').innerHeight()))
        {
            $('#dlgin').css({'margin-right': 20})
            addScrollbar('dlgin', 490, 'talkscroll')
        }
    }, 100)
    if ($('#dlgin').height() < ($('#dlgin .message').innerHeight() + $('#dlgin .replies').innerHeight()))
    {
        $('#dlgin').css({'margin-right': 20})
        addScrollbar('dlgin', 490, 'talkscroll')
    }
}
nerthus.npc.dialog.removeScroll = function ()
{
    removeScrollbar('dlgin', 'talkscroll');
}

nerthus.npc.dialog.display = function (message, replies, npc)
{
    $("#dlgin .message").empty().append(this.compose.message(message, npc))
    var $replies = $("#dlgin .replies").empty()
    $replies.append.apply($replies, replies.map(this.compose.reply.bind(this.compose)))
    this.addScroll()
    $("#dialog").show()
}

nerthus.npc.dialog.parseInnerDialog_ni = function (message, replies)
{
    let innerDial = "<p class=\"npc-message\">" + message + "</p><ul class=\"answers\">"
    let repliesLen = replies.length
    for (let i = 0; i < repliesLen; i++)
    {
        let line_option = "line_option"

        if (replies[i].to === "END")
            line_option = "line_exit"
        innerDial +=
            "<li class=\"answer dialogue-window-answer " + line_option + "\">" +
            "<div class=\"icon " + line_option + "\"></div>" +
            "<span class=\"answer-text\">" + (i + 1) + ". " + replies[i].text + "</span>" +
            "</li>"
    }
    return innerDial
}

nerthus.npc.dialog.addEventToAnswer = function (answer, $dialWin, replies, index, id)
{
    if (replies[index])
        $(answer).click(function ()
        {
            if (replies[index].to === "END")
                nerthus.npc.dialog.close_ni()
            else
                nerthus.npc.dialog.open_ni(id, replies[index].to)
            $(".scroll-wrapper", $dialWin).trigger("update")
        })
}

nerthus.npc.dialog.display_ni = function (message, replies, id)
{
    const innerDial = this.parseInnerDialog_ni(message, replies)

    let $dialWin = $(".dialogue-window")
    if ($dialWin.length === 0)
    {
        const dial =
            "<div class=\"dialogue-window\">" +
                "<div class=\"background\">" +
                    "<div class=\"upper-left\"></div>" +
                    "<div class=\"upper-right\"></div>" +
                    "<div class=\"top\"></div>" +
                    "<div class=\"left\"></div>" +
                    "<div class=\"right\"></div>" +
                    "<div class=\"bottom\"></div>" +
                "</div>" +
                "<div class=\"content\">" +
                    "<div class=\"inner scroll-wrapper scrollable\">" +
                    "<div class=\"scroll-pane\">" +
                    innerDial +
                "</ul></div>" +
                "<div class=\"scrollbar-wrapper\">" +
                    "<div class=\"background\" style=\"pointer-events: none;\"></div>" +
                    "<div class=\"arrow-up\"></div>" +
                    "<div class=\"arrow-down\"></div>" +
                    "<div class=\"track\">" +
                        "<div class=\"handle ui-draggable ui-draggable-handle\" style=\"top: 0;\"></div>" +
                "</div></div></div></div>" +
                "<header><div class=\"h_content\">" + nerthus.npc.list[id].name + "</div></header>" +
            "</div>"
        $dialWin = $(dial).appendTo(".bottom.positioner")
        $('.scroll-wrapper', $dialWin).addScrollBar({track: true})

        setTimeout(function ()
        {
            $dialWin.addClass("is-open")
        }, 10) //NI animation
    }
    else
    {
        $(".dialogue-window").addClass("is-open")
        $(".content .inner.scroll-wrapper .scroll-pane", $dialWin).empty().append(innerDial)
    }

    $(".content .inner.scroll-wrapper .scroll-pane .answers .answer", $dialWin).each(function (index)
    {
        nerthus.npc.dialog.addEventToAnswer(this, $dialWin, replies, index, id)
    })

}

nerthus.npc.dialog.close = function ()
{
    $("#dialog").hide()
    g.lock.remove("nerthus_dialog")
    map.resizeView(512,512);
}

nerthus.npc.dialog.close_ni = function ()
{
    $(".dialogue-window").removeClass("is-open")
    Engine.lock.remove("nerthus_dialog")
}

nerthus.npc.dialog.compose = {}
nerthus.npc.dialog.compose.icon = function(type)
{
    return $("<div>").addClass(type)
}
nerthus.npc.dialog.compose.reply = function (reply)
{
    const icon = this.icon(reply.icon)
    return $("<li>")
        .addClass(reply.icon)
        .append(icon)
        .append(reply.text)
        .click(reply.click)
}
nerthus.npc.dialog.compose.message = function(message, npc)
{
    return "<h4>" + npc.nick + "</h4>" + message
}

nerthus.npc.compose = function (npc)
{
    const click = npc.dialog ? this.dialog.open.bind(this.dialog, npc, 0) : null
    const $npc = $("<img src='" + npc.icon + "'>")
        .css({
            position: "absolute",
            zIndex: npc.y * 2 + 9
        })
        .attr("id", "npc" + npc.id)
        .addClass("nerthus_npc")
        .appendTo('#base')
        .load(function ()
        {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
            const x = 32 * parseInt(npc.x) + 16 - Math.floor($(this).width() / 2)
            const y = 32 * parseInt(npc.y) + 32 - $(this).height()
            $(this).css({top: "" + y + "px", left: "" + x + "px"})
        })

    if (npc.nick)
        $npc.attr("ctip", "t_npc")
            .attr("tip", npc.nick)
    if (click) {
        $npc.click(this.click_wrapper(npc, click))
    }
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
    if (!this.is_deployable(npc)) return
    switch (npc.type)
    {
        case 'delete':
            if (!this.is_deletable(npc))
                return
            nerthus.worldEdit.hideGameNpc(npc.id, npc.lvl === 0)
            break
        case 'change':
            nerthus.worldEdit.changeGameNpc(npc)
            break
        default:
            const tip = npc.hasOwnProperty('tip') ? npc.tip : '<b>' + npc.name + '</b>'
            const customNpc = new this.CustomNpc(npc.x, npc.y, npc.url, tip, npc.collision, npc.dialog)

            this.list[customNpc.id] = customNpc
            this.compose(customNpc)
            this.set_collision(customNpc)
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
    return !(npc.lvl + 13 >= hero.lvl)
}

nerthus.npc.is_deletable_ni = function (npc)
{
    return !(npc.lvl + 13 >= Engine.hero.d.lvl)
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

    let begin = this.parse_to_date(npc.date.split('-')[0])
    const end = this.parse_to_date(npc.date.split('-')[1])
    if (end < begin)
        begin.setTime(begin.getTime() - 31556952000) //1 year prior, for winter dates for example 21.11-20.03
    const now = new Date()
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
    $(".nerthus_npc").remove()
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
        nerthus.worldEdit.purgeNpcList()
        let file_with_npc = nerthus.addon.fileUrl("npcs/map_" + Engine.map.d.id + ".json")
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

nerthus.npc.dialog.check = function (command)
{
    let match = command.match(/^talk.*id=(\d+)/)
    if (match)
    {
        let id = match[1]
        if (id >= 50000000)
        {
            if (this.list[id] !== undefined)
            {
                return id
            }
        }
    }
    return false
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
        _g = function (c, d)
        {
            let id = nerthus.npc.dialog.check(c)
            if (id > 0)
                nerthus.npc.dialog.open_ni(id, 0)
            _nerthg(c, d)
        }

        this.load_npcs()
        nerthus.loadOnEveryMap(this.load_npcs.bind(this))
    })
}
