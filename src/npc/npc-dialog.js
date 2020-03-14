const LINE = 'icon LINE_OPTION'
const EXIT = 'icon LINE_EXIT'

function parse_message(npc, index)
{
    return parse_placeholders(npc.dialog[index][0])
}

function parse_replies(npc, index)
{
    const replies = []
    if (INTERFACE === 'NI')
    {
        for (let i = 1; i < dialog.length; i++)
            replies.push(parse_reply(dialog[i], id))
        return replies
    }
    else
    {
        for (let i = 1; i < npc.dialog[index].length; i++)
            replies.push(parse_reply(npc.dialog[index][i], npc))
        return replies
    }
}


function parse_reply(row_reply, npc)
{
    let reply = this.parse_row_reply(row_reply)
    reply.text = this.parse_placeholders(reply.text)
    if (reply.to === 'END')
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
            $('#dlgin').scrollTop(0)
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


function openDialog(npc, index)
{
    if (INTERFACE === 'NI')
    {
        const dialog = this.list[id][index]
        const message = this.parse_placeholders(dialog[0])
        const replies = this.parse_replies_ni(dialog, id)
        this.display_ni(message, replies, id)
        Engine.lock.add('nerthus-dialog')
    }
    else
    {
        const message = this.parse_message(npc, index)
        const replies = this.parse_replies(npc, index)
        this.display(message, replies, npc)
        g.lock.add('nerthus-dialog')

        map.resizeView(512, 192)
    }
}

function addScroll()
{
    clearInterval(g.talk.scrollCheckInterval)
    const $dlgin = $('#dlgin')
    g.talk.scrollCheckInterval = setInterval(function ()
    {
        if ($('#talkscroll').length) return
        if ($dlgin.height() < ($('#dlgin .message').innerHeight() + $('#dlgin .replies').innerHeight()))
        {
            $('#dlgin').css({'margin-right': 20})
            addScrollbar('dlgin', 490, 'talkscroll')
        }
    }, 100)
    if ($dlgin.height() < ($('#dlgin .message').innerHeight() + $('#dlgin .replies').innerHeight()))
    {
        $dlgin.css({'margin-right': 20})
        addScrollbar('dlgin', 490, 'talkscroll')
    }
}

function removeScroll()
{
    removeScrollbar('dlgin', 'talkscroll')
}

function displayDialog(message, replies, npc)
{
    if (INTERFACE === 'NI')
    {
        const innerDial = this.parseInnerDialog_ni(message, replies)

        let $dialWin = $('.dialogue-window')
        if ($dialWin.length === 0)
        {
            const dial =
                '<div class="dialogue-window">' +
                '<div class="background">' +
                '<div class="upper-left"></div>' +
                '<div class="upper-right"></div>' +
                '<div class="top"></div>' +
                '<div class="left"></div>' +
                '<div class="right"></div>' +
                '<div class="bottom"></div>' +
                '</div>' +
                '<div class="content">' +
                '<div class="inner scroll-wrapper scrollable">' +
                '<div class="scroll-pane">' +
                innerDial +
                '</ul></div>' +
                '<div class="scrollbar-wrapper">' +
                '<div class="background" style="pointer-events: none;"></div>' +
                '<div class="arrow-up"></div>' +
                '<div class="arrow-down"></div>' +
                '<div class="track">' +
                '<div class="handle ui-draggable ui-draggable-handle" style="top: 0;"></div>' +
                '</div></div></div></div>' +
                '<header><div class="h_content">' + nerthus.npc.list[id].name + '</div></header>' +
                '</div>'
            $dialWin = $(dial).appendTo('.bottom.positioner')
            $('.scroll-wrapper', $dialWin).addScrollBar({track: true})

            setTimeout(function ()
            {
                $dialWin.addClass('is-open')
            }, 10) //NI animation
        }
        else
        {
            $dialWin.addClass('is-open')
            $('.content .inner.scroll-wrapper .scroll-pane', $dialWin).empty().append(innerDial)
        }

        $('.content .inner.scroll-wrapper .scroll-pane .answers .answer', $dialWin).each(function (index)
        {
            nerthus.npc.dialog.addEventToAnswer(this, $dialWin, replies, index, id)
        })

    }
    else
    {
        $('#dlgin .message').empty().append(composeMessage(message, npc))
        const $replies = $('#dlgin .replies').empty()
        $replies.append.apply($replies, replies.map(composeReply))
        addScroll()
        $('#dialog').show()
    }
}

function composeMessage(message, npc)
{
    return '<h4>' + npc.nick + '</h4>' + message
}

nerthus.npc.dialog.parseInnerDialog_ni = function (message, replies)
{
    let innerDial = '<p class="npc-message">' + message + '</p><ul class="answers">'
    let repliesLen = replies.length
    for (let i = 0; i < repliesLen; i++)
    {
        let line_option = 'line_option'

        if (replies[i].to === 'END')
            line_option = 'line_exit'
        innerDial +=
            '<li class="answer dialogue-window-answer ' + line_option + '">' +
            '<div class="icon ' + line_option + '"></div>' +
            '<span class="answer-text">' + (i + 1) + '. ' + replies[i].text + '</span>' +
            '</li>'
    }
    return innerDial
}

nerthus.npc.dialog.addEventToAnswer = function (answer, $dialWin, replies, index, id)
{
    if (replies[index])
        $(answer).click(function ()
        {
            if (replies[index].to === 'END')
                nerthus.npc.dialog.close_ni()
            else
                nerthus.npc.dialog.open_ni(id, replies[index].to)
            $('.scroll-wrapper', $dialWin).trigger('update')
        })
}

nerthus.npc.dialog.display_ni = function (message, replies, id)
{

}

function closeDialog()
{
    if (INTERFACE === 'NI')
    {
        $('.dialogue-window').removeClass('is-open')
        Engine.lock.remove('nerthus-dialog')
    }
    else
    {
        $('#dialog').hide()
        g.lock.remove('nerthus-dialog')
        map.resizeView()
    }
}

function composeIcon(type)
{
    return $('<div>').addClass(type)
}

function composeReply(reply)
{
    const icon = this.icon(reply.icon)
    return $('<li>')
        .addClass(reply.icon)
        .append(icon)
        .append(reply.text)
        .click(reply.click)
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
