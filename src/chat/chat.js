import {hasNarrationRights} from '../permissions'
import {initChatDrunkenness} from './drunkenness'
import {loadOnEveryMap} from '../game-integration/loaders'

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
            log('[' + ch.k + '] ' + ch.n + ' -> ' + ch.t) //[which tab] author -> command //TODO

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


function fetchCmd(ch)
{
    if (ch.t[0] === '*')
    {
        const command = RegExp(/^\*(\S+)/).exec(ch.t)
        //fixes bug with /dice, and presumably '* text' messages
        if (command)
            return command[1]
    }
}

function fetchCallback(cmd, ch)
{
    if (commandsMap[cmd] && hasNarrationRights(ch.n))
        return commandsMap[cmd]
    else
        return commandsPublicMap[cmd]
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
        loadOnEveryMap(function ()
        {
            g.chat.parsers.push(run)
        })

        const oldDisplayChatMsg = window.displayChatMsg
        window.displayChatMsg = function ($el, obj)
        {
            // jQuery way doesn't allow to easily search for object later
            $el[0].setAttribute('data-ts', obj.ts)
            return oldDisplayChatMsg($el, obj)
        }
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
