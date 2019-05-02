nerthus.npc = {}
nerthus.npc.list = {}
nerthus.npc.dialog = {}
nerthus.npc.dialog.list = {}
nerthus.npc.dialog.decorator = {}
nerthus.npc.dialog.decorator.classes = {}
nerthus.npc.dialog.decorator.classes.LINE = "icon LINE_OPTION"
nerthus.npc.dialog.decorator.classes.EXIT = "icon LINE_EXIT"
nerthus.npc.dialog.arrowTimeout = false
nerthus.npc.dialog.arrowInterval = false

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
        replies.push(this.parse_reply_ni(dialog[i], id))
    return replies
}

nerthus.npc.dialog.parse_reply = function (row_reply, npc)
{
    let reply = this.parse_row_reply(row_reply)
    reply.text = this.parse_placeholders(reply.text)
    if (reply.to === "END")
    {
        reply.click = this.close.bind(this)
        reply.icon = this.decorator.classes.EXIT
    }
    else if (reply.to)
    {
        reply.click = this.open.bind(this, npc, reply.to)
        reply.icon = this.decorator.classes.LINE
    }
    return reply
}

nerthus.npc.dialog.parse_reply_ni = function (row_reply, id)
{
    let reply = this.parse_row_reply(row_reply)
    reply.text = this.parse_placeholders_ni(reply.text)
    if (reply.to === "END")
    {
        reply.click = this.close.bind(this)
        reply.icon = this.decorator.classes.EXIT
    }
    else if (reply.to)
    {
        reply.click = this.open_ni.bind(this, id, reply.to)
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
}

nerthus.npc.dialog.open_ni = function (id, index)
{
    let dialog = this.list[id][index]
    const message = this.parse_placeholders_ni(dialog[0])
    const replies = this.parse_replies_ni(dialog, id)
    this.display_ni(message, replies, id)
    Engine.lock.add("nerthus_dialog")
}

nerthus.npc.dialog.display = function (message, replies, npc)
{
    $("#dlgin .message").empty().append(this.compose.message(message, npc))
    var $replies = $("#dlgin .replies").empty()
    $replies.append.apply($replies, replies.map(this.compose.reply.bind(this.compose)))
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

nerthus.npc.dialog.display_ni = function (message, replies, id)
{
    const innerDial = this.parseInnerDialog_ni(message, replies)

    let $dialWin = $(".dialogue-window")
    if ($dialWin.length === 0)
    {
        let dial =
            "<div class=\"dialogue-window\" style=\"height: 0;\">" +
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
            "<div class=\"scroll-pane\">"

        dial += innerDial
        dial +=
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


        $(dial).appendTo(".bottom.positioner")
            .find(".content .inner.scroll-wrapper .scroll-pane .answers .answer").each(function (index)
        {
            $(this).click(function ()
            {
                if (replies[index].to === "END")
                    nerthus.npc.dialog.close_ni()
                else
                    nerthus.npc.dialog.open_ni(id, replies[index].to)
            })
        })

        this.addScrollBar_ni()
        this.setScrollwheel_ni()
        this.addArows_ni()
        this.updateScroll_ni()
        setTimeout(function ()
        {
            $(".dialogue-window").css("height", "300px")
        }, 10) //NI animation
    }
    else
    {
        $dialWin.find(".content .inner.scroll-wrapper .scroll-pane").empty().append(innerDial)
        $dialWin.find(".content .inner.scroll-wrapper .scroll-pane .answers .answer").each(function (index)
        {
            $(this).click(function ()
            {
                if (replies[index].to === "END")
                    nerthus.npc.dialog.close_ni()
                else
                    nerthus.npc.dialog.open_ni(id, replies[index].to)
            })
        })
        this.updateBarPosition_ni(0)
        this.updateScroll_ni()
    }

}

nerthus.npc.dialog.scrollTo_ni = function (percentage)
{
    let $pane = $('.interface-layer .inner.scroll-wrapper.scrollable .scroll-pane')
    let $bar = $(".interface-layer .dialogue-window .handle.ui-draggable.ui-draggable-handle")

    $pane.scrollTop(Math.round(($pane[0].scrollHeight - $pane.height()) * percentage))

    let top = Math.round(($bar.height() - $('.handle', $bar).height()) * percentage)
    $('.handle', $bar).css('top', top)
}

nerthus.npc.dialog.addScrollBar_ni = function ()
{
    let $bar = $(".interface-layer .dialogue-window .handle.ui-draggable.ui-draggable-handle")
    let $track = $(".interface-layer .dialogue-window .track")
    $bar.draggable({
        axis: 'y',
        scroll: false,
        start: function ()
        {
            stop = false //???
        },
        drag: function (e, ui)
        {
            if (stop) return false
            let percent = ui.position.top / ($track.height() - $bar.height())
            if (percent < 0) percent = 0
            if (percent > 1) percent = 1
            if (ui.position.top < 0) ui.position.top = 0
            let max = ui.helper.parent().height() - 45
            if (ui.position.top > max) ui.position.top = max
            nerthus.npc.dialog.scrollTo_ni(percent)
        },
        stop: function ()
        {
            stop = true //???
        }
    })
}

nerthus.npc.dialog.setScrollwheel_ni = function ()
{
    let $pane = $('.interface-layer .inner.scroll-wrapper.scrollable .scroll-pane')

    $pane.on('mousewheel DOMMouseScroll', function (e)
    {
        let isFirefox = typeof InstallTrigger !== 'undefined'
        let stateScroll = isFirefox ? e.originalEvent.detail : e.originalEvent.deltaY
        nerthus.npc.dialog.setNewBarPos(stateScroll < 0, 20)
    }).on('update', function ()
    {
        nerthus.npc.dialog.updateScroll_ni()
        nerthus.npc.dialog.updateBarPos_ni()
    }).on('scrollBottom', function ()
    {
        nerthus.npc.dialog.scrollTo_ni(1)
    }).on('scrollTop', function ()
    {
        nerthus.npc.dialog.scrollTo_ni(0)
    }).on('stopDragBar', function ()
    {
        //stop = true; ?????????
    }).on('updateBarPos', function ()
    {
        nerthus.npc.dialog.updateBarPos_ni()
    }).on('setScroll', function (ev, n)
    {
        nerthus.npc.dialog.setScroll_ni(n)
    }).on('updateWhenBottom', function ()
    {
        // let scrollVisible = isVisible();
        nerthus.npc.dialog.updateScroll_ni()
        nerthus.npc.dialog.updateBarPos_ni()
    })
}

nerthus.npc.dialog.updateBarPos_ni = function ()
{
    let $pane = $('.interface-layer .inner.scroll-wrapper.scrollable .scroll-pane')

    let new_pos = $pane.scrollTop()
    let max_scroll = $pane[0].scrollHeight - $pane.height()
    if (new_pos > max_scroll) new_pos = max_scroll
    if (new_pos < 0) new_pos = 0

    let p = new_pos / max_scroll
    nerthus.npc.dialog.updateBarPosition_ni(p)
    nerthus.npc.dialog.scrollTo_ni(p)
}

nerthus.npc.dialog.updateBarPosition_ni = function (percentage)
{
    //if (!options.track) return; ????
    let $track = $(".interface-layer .dialogue-window .track")

    let top = Math.round(($track.height() - $('.handle', $track).height()) * percentage)
    $('.handle', $track).css('top', top)
}

nerthus.npc.dialog.updateScroll_ni = function ()
{
    let $warpper = $('.interface-layer .inner.scroll-wrapper')
    let $pane = $('.interface-layer .inner.scroll-wrapper  .scroll-pane')
    let height = $pane.height() !== 0 ? $pane.height() : 173 //it bugs out when opening 1st time, this should work
    //toggle visibility of scrollbar if needed
    if ($pane[0].scrollHeight - height > 1)
        $warpper.addClass('scrollable')
    else
        $warpper.removeClass('scrollable')
}
nerthus.npc.dialog.setScroll_ni = function (new_pos)
{
    let $pane = $('.interface-layer .inner.scroll-wrapper .scroll-pane')
    let max_scroll = $pane[0].scrollHeight - $pane.height()
    if (new_pos > max_scroll) new_pos = max_scroll
    if (new_pos < 0) new_pos = 0

    let p = new_pos / max_scroll
    nerthus.npc.dialog.updateBarPosition_ni(p)
    nerthus.npc.dialog.scrollTo_ni(p)
}

nerthus.npc.dialog.setNewBarPos = function (increase, distance)
{
    let $pane = $('.interface-layer .inner.scroll-wrapper .scroll-pane')


    let new_pos = $pane.scrollTop() + (increase ? -distance : distance)
    let max_scroll = $pane[0].scrollHeight - $pane.height()
    if (new_pos > max_scroll) new_pos = max_scroll
    if (new_pos < 0) new_pos = 0

    let p = new_pos / max_scroll
    nerthus.npc.dialog.updateBarPosition_ni(p)
    nerthus.npc.dialog.scrollTo_ni(p)
}

nerthus.npc.dialog.addArows_ni = function ()
{
    let $arrUp = $('.interface-layer .inner.scroll-wrapper .scrollbar-wrapper .arrow-up')
    let $arrDown = $('.interface-layer .inner.scroll-wrapper .scrollbar-wrapper .arrow-down')
    $arrUp
        .mousedown(function ()
        {
            nerthus.npc.dialog.setNewBarPos(true, 20)
            nerthus.npc.dialog.arrowTimeout = setTimeout(function ()
            {
                nerthus.npc.dialog.arrowInterval = setInterval(function ()
                {
                    nerthus.npc.dialog.setNewBarPos(true, 10)
                }, 50)
            }, 500)
        })
        .mouseleave(nerthus.npc.dialog.clearArrowIntervals)
        .mouseup(nerthus.npc.dialog.clearArrowIntervals)
    $arrDown
        .mousedown(function ()
        {
            nerthus.npc.dialog.setNewBarPos(false, 20)
            nerthus.npc.dialog.arrowTimeout = setTimeout(function ()
            {
                nerthus.npc.dialog.arrowInterval = setInterval(function ()
                {
                    nerthus.npc.dialog.setNewBarPos(false, 10)
                }, 50)
            }, 500)
        })
        .mouseleave(nerthus.npc.dialog.clearArrowIntervals)
        .mouseup(nerthus.npc.dialog.clearArrowIntervals)
}

nerthus.npc.dialog.clearArrowIntervals = function ()
{
    if (nerthus.npc.dialog.arrowTimeout)
    {
        clearTimeout(nerthus.npc.dialog.arrowTimeout)
        nerthus.npc.dialog.arrowTimeout = false
    }
    if (nerthus.npc.dialog.arrowInterval)
    {
        clearInterval(nerthus.npc.dialog.arrowInterval)
        nerthus.npc.dialog.arrowInterval = false
    }
}

nerthus.npc.dialog.setNewBarPos = function (increase, distance)
{
    let $pane = $('.interface-layer .inner.scroll-wrapper .scroll-pane')


    let new_pos = $pane.scrollTop() + (increase ? -distance : distance)
    let max_scroll = $pane[0].scrollHeight - $pane.height()
    if (new_pos > max_scroll) new_pos = max_scroll
    if (new_pos < 0) new_pos = 0

    let p = new_pos / max_scroll
    nerthus.npc.dialog.updateBarPosition_ni(p)
    nerthus.npc.dialog.scrollTo_ni(p)
}

nerthus.npc.dialog.close = function ()
{
    $("#dialog").hide()
    g.lock.remove("nerthus_dialog")
}

nerthus.npc.dialog.close_ni = function ()
{
    $(".dialogue-window").css("height", "0")
    setTimeout(function ()
    {
        $(".dialogue-window").remove()
    }, 200) //NI animation
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
    return "<h4><b>" + npc.name + "</b></h4>" + message
}

nerthus.npc.compose = function (npc)
{
    const click = npc.dialog ? this.dialog.open.bind(this.dialog, npc, 0) : null
    let $npc = $("<img>")
        .attr("src", this.resolve_url(npc.url))
        .css("position", "absolute")
        .css("z-index", npc.y * 2 + 9)
        .addClass("nerthus_npc")
        .click(this.click_wrapper(npc, click))
        .appendTo('#base')
        .load(function ()
        {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
            const x = 32 * parseInt(npc.x) + 16 - Math.floor($(this).width() / 2)
            const y = 32 * parseInt(npc.y) + 32 - $(this).height()
            $(this).css({top: "" + y + "px", left: "" + x + "px"})
        })

    const tip = npc.hasOwnProperty("tip") ? npc.tip : "<b>" + npc.name + "</b>"
    if (tip)
        $npc.attr("ctip", "t_npc").attr("tip", tip)

    return $npc
}

nerthus.npc.compose_ni = function (npc)
{
    let x = parseInt(npc.x)
    let y = parseInt(npc.y)

    let _url = this.resolve_url(npc.url)
    let exp = /(.*\/)(?!.*\/)(.*)/
    let match = exp.exec(_url)
    let id = 50000000 + (x * 1000) + y //id that no other game npc will have
    let data = {}
    data[id] = {
        actions: 0,
        grp: 0,
        icon: match[2],
        nick: npc.hasOwnProperty("tip") ? npc.tip : "<b>" + npc.name + "</b>",
        wt: 0,
        type: npc.hasOwnProperty("tip") && npc.tip === "" || npc.name === "" ? 4 : 0,
        x: x,
        y: y
    }

    let npath = CFG.npath
    CFG.npath = match[1]
    Engine.npcs.updateData(data)
    CFG.npath = npath

    this.dialog.list[id] = npc.dialog
    this.list[id] = npc
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
    if(npc.type === "delete")
    {
        if(!this.is_deployable(npc) || !this.is_deletable(npc))
            return
        nerthus.worldEdit.hideNpc(npc.id)
    }
    else
    {
        if (!this.is_deployable(npc))
            return
        this.compose(npc)
        this.set_collision(npc)
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
    return !(npc.lvl + 13 > hero.lvl)

}

nerthus.npc.is_deletable_ni = function (npc)
{
    return !(npc.lvl + 13 > Engine.hero.d.lvl)
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

nerthus.npc.set_collision_ni = function(npc)
{
    if(npc.collision)
        Engine.map.col.set(parseInt(npc.x), parseInt(npc.y), 2)
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
        let file_with_npc = nerthus.addon.fileUrl("/npcs/map_" + Engine.map.d.id + ".json")
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

nerthus.npc.start = function()
{
    nerthus.defer(this.load_npcs.bind(this))
}

nerthus.npc.start_ni = function ()
{
    if (Engine.map.d.id === undefined)
        setTimeout(this.start_ni.bind(this), 500)
    else
    {
        this.set_collision = this.set_collision_ni
        this.compose = this.compose_ni
        this.load_npcs = this.load_npcs_ni
        this.is_deletable = this.is_deletable_ni

        let _nerthg = _g
        _g = function (c, d)
        {
            let id = nerthus.npc.dialog.check(c)
            if (id > 0)
                nerthus.npc.dialog.open_ni(id, 0)
            _nerthg(c, d)
        }

        this.load_npcs()
        nerthus.loadOnEveryMap(this.load_npcs.bind(this))
    }
}
