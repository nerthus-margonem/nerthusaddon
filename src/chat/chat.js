import {loadOnEveryMap} from '../game-integration/loaders'
import {hasNarrationRights} from '../permissions'
import {sanitizeText} from '../utility-functions'
import {initChatDrunkenness} from './drunkenness'

const commandsMap = {}
const commandsPublicMap = {}

function fixUrl(text)
{
    const url = RegExp(/(https?)\*Krzywi się\.\*(\S+)/)
    return text.replace(url, '$1:/$2')
}

function handleChatObj(ch)
{
    // change message by directly editing object passed as reference
    const cmd = fetchCmd(ch)
    if (cmd)
    {
        const callback = fetchCallback(cmd, ch)
        if (callback)
        {
            ch.t = fixUrl(ch.t)
            log(sanitizeText(`[${ch.k}] ${ch.n} -> ${ch.t}`)) //[which tab] author -> command

            return callback(ch)
        }
    }
    return true
}


function editNiMsg($msg, ch)
{
    $msg.addClass(ch.s)
    const content = $msg.children().eq(2).contents()
    $msg.children(2).addClass(ch.s)
    for (let i = 0; i < content.length; i++)
    {
        const text = content.eq(i)
        if (i === 0)
            text.replaceWith(ch.t)
        else
            text.remove()
    }
    if (!ch.n) $msg.children().eq(0).contents().eq(0).replaceWith('')

    // jQuery way doesn't allow to easily search for object later
    $msg[0].setAttribute('data-ts', ch.ts)
}


function fetchCmd(chatMessageData)
{
    if (chatMessageData.text[0] === '*')
    {
        const command = /^\*(\S+)/.exec(chatMessageData.text)
        //fixes bug with /dice, and presumably '* text' messages
        if (command)
            return command[1]
    }
}

function fetchCallback(command, msg)
{
    if (commandsMap[command] && hasNarrationRights(msg.authorBusinessCard.getNick()))
        return commandsMap[command]
    else
        return commandsPublicMap[command]
}

function run(arg)
{
    if (INTERFACE === 'NI')
    {
        const $msg = arg[0],
            ch = arg[1]

        if (ch.s !== 'abs' && ch.s !== '') return

        const chatParse = handleChatObj(ch)
        if (typeof chatParse === 'object')
            editNiMsg($msg, ch)
        else if (chatParse === false)
            $msg.remove()
    }
    else
    {
        // return TRUE if you want message to NOT show in chat
        // return FALSE if you want message to show in chat

        // function returns negation so that on callbacks returning TRUE or OBJECT message is visible
        // and on callbacks returning FALSE or UNDEFINED it is not
        return !handleChatObj(arg)
    }
}

function parseMessage(chatMessageData)
{
    // change message by directly editing object passed as reference
    const command = fetchCmd(chatMessageData)
    if (command)
    {
        const callback = fetchCallback(command, chatMessageData)
        if (callback)
        {
            chatMessageData.text = fixUrl(chatMessageData.text)
            log(sanitizeText(
                `[${chatMessageData.channel}] ${chatMessageData.authorBusinessCard.getNick()} -> ${chatMessageData.text}`
            )) // [which tab] author -> command

            return callback(chatMessageData)
        }
    }
    return true
}


function createProxyOnChatMessage()
{
    const oldChatMessage = window.ChatMessage
    window.ChatMessage = class ChatMessage extends oldChatMessage
    {
        constructor()
        {
            super()
            this.oldInit = this.init
            this.init = this.newInit
        }

        newInit(data)
        {
            parseMessage(data)
            return this.oldInit(...arguments)
        }
    }
}


export function initChatMgr()
{
    if (INTERFACE === 'NI')
    {
        //if (typeof nerthus.mapDraw !== "function")
        //    nerthus.mapDraw = Engine.map.draw

        API.addCallbackToEvent('newMsg', run)
        API.addCallbackToEvent('updateMsg', run)

        const setAvatarData = Engine.chat.setAvatarData
        Engine.chat.setAvatarData = function (tpl, d, pos)
        {
            if (d.n === '') return
            return setAvatarData(tpl, d, pos)
        }
    }
    else
    {
        loadOnEveryMap(createProxyOnChatMessage)
    }
    initChatDrunkenness()
}

export function registerChatCommand(name, func, isPublic)
{
    if (isPublic)
        commandsPublicMap[name] = func
    else
        commandsMap[name] = func
}
