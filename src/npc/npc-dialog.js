nerthus.npc.dialog = {}
nerthus.npc.dialog.list = {}
nerthus.npc.dialog.decorator = {}
nerthus.npc.dialog.decorator.classes = {}
nerthus.npc.dialog.decorator.classes.LINE = "icon LINE_OPTION"
nerthus.npc.dialog.decorator.classes.EXIT = "icon LINE_EXIT"

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

function parse_placeholders(text)
{
    if (INTERFACE === 'NI')
        return text.replace('#NAME', Engine.hero.d.nick)
    else
        return text.replace('#NAME', hero.nick)
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
    map.resizeView()
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
