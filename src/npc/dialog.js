import {coordsToId} from '../utility-functions'

const LINE_ICON = 'icon LINE_OPTION line_option' // TODO NI/SI?
const EXIT_ICON = 'icon LINE_EXIT line_exit'

let dialogList = {}

export function addDialogToDialogList(npcId, npcNick, dialog)
{
    dialogList[npcId] = {
        npcNick: npcNick,
        dialog: dialog
    }
}

export function openDialog(npcId, index)
{
    const npcNick = dialogList[npcId].npcNick
    const dialog = dialogList[npcId].dialog
    const npcMessage = parsePlaceholders(dialog[index][0])
    const playerReplies = parseReplies(dialog[index], npcId)

    displayDialog(npcId, npcNick, npcMessage, playerReplies)

    if (INTERFACE === 'NI')
    {
        Engine.lock.add('nerthus-dialog')
    }
    else
    {
        g.lock.add('nerthus-dialog')

        map.resizeView(512, 192)
    }
}

function parseReplies(dialogInstance, npcId)
{
    const replies = []

    for (let i = 1; i < dialogInstance.length; i++)
        replies.push(parseReply(dialogInstance[i], npcId))
    return replies

}


function parseReply(replyRow, npcId)
{
    const reply = parseReplyRow(replyRow)
    if (reply.to === 'END')
    {
        reply.click = closeDialog
        reply.icon = EXIT_ICON
    }
    else if (reply.to)
    {
        reply.click = function ()
        {
            removeScroll()
            openDialog(npcId, reply.to)
            addScroll()
            $('#dlgin').scrollTop(0)
        }
        reply.icon = LINE_ICON
    }
    return reply
}

function parseReplyRow(reply)
{
    const replyArr = reply.split('->')
    return {text: parsePlaceholders(replyArr[0]), to: replyArr[1]}
}

function parsePlaceholders(text)
{
    if (INTERFACE === 'NI')
        return text.replace('#NAME', Engine.hero.d.nick)
    else
        return text.replace('#NAME', hero.nick)
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

function parseInnerDialog(npcMessage, playerReplies)
{
    let innerDial = '<p class="npc-message">' + npcMessage + '</p><ul class="answers">'
    const repliesLen = playerReplies.length
    for (let i = 0; i < repliesLen; i++)
    {
        let iconClass = LINE_ICON
        if (playerReplies[i].to === 'END') iconClass = EXIT_ICON

        innerDial +=
            '<li class="answer dialogue-window-answer ' + iconClass + '">' +
            '<div class="' + iconClass + '"></div>' +
            '<span class="answer-text">' + (i + 1) + '. ' + playerReplies[i].text + '</span>' +
            '</li>'
    }
    return innerDial
}


function addEventToAnswer(answer, $dialWin, replies, index, id)
{
    if (replies[index])
        $(answer).click(function ()
        {
            if (replies[index].to === 'END')
                closeDialog()
            else
                openDialog(id, replies[index].to)
            $('.scroll-wrapper', $dialWin).trigger('update')
        })
}

function displayDialog(npcId, npcNick, npcMessage, playerReplies)//(message, replies, npc)
{
    if (INTERFACE === 'NI')
    {
        const innerDial = parseInnerDialog(npcMessage, playerReplies)

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
                '<header><div class="h_content">' + npcNick + '</div></header>' +
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
            $('.h_content', $dialWin).text(npcNick)
            $('.content .inner.scroll-wrapper .scroll-pane', $dialWin).empty().append(innerDial)
        }

        $('.content .inner.scroll-wrapper .scroll-pane .answers .answer', $dialWin)
            .each(function (index) {addEventToAnswer(this, $dialWin, playerReplies, index, npcId)})
    }
    else
    {
        $('#dlgin .message').empty().append('<h4>' + npcNick + '</h4>' + npcMessage)
        const $replies = $('#dlgin .replies').empty()
        $replies.append.apply($replies, playerReplies.map(composeReply))
        addScroll()
        $('#dialog').show()
    }
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
        removeScroll()
    }
}

function composeReply(reply)
{
    return $('<li>')
        .addClass(reply.icon)
        .append('<div class="' + reply.icon + '">')
        .append(reply.text)
        .click(reply.click)
}

function checkDialog(command)
{
    const match = command.match(/^talk.*id=(\d+)/)
    if (match)
    {
        const id = match[1]
        if (id >= coordsToId(0, 0) &&
            dialogList[id] !== undefined)
        {
            return id
        }
    }
    return false
}

export function initNpcDialog()
{
    if (INTERFACE === 'NI')
    {
        const __g = _g
        window._g = function (task, callback, payload)
        {
            const id = checkDialog(task)
            if (id) openDialog(id, 0)
            __g(task, callback, payload)
        }
    }
}
