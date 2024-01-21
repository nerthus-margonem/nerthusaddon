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
    if (commandsMap[command] && hasNarrationRights(msg.authorBusinessCard.getAcc()))
        return commandsMap[command]
    else
        return commandsPublicMap[command]
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

function initParseNerthusCommandsProxy()
{
    if (INTERFACE === 'NI')
    {
        const oldAddMessage = Engine.chatController.addMessage
        Engine.chatController.addMessage = function (data)
        {
            parseMessage(data)
            return oldAddMessage.apply(Engine.chatController, arguments)
        }
    }
    else
    {
        const oldAddMessage = g.chatController.addMessage
        g.chatController.addMessage = function (data)
        {
            parseMessage(data)
            return oldAddMessage.apply(g.chatController, arguments)
        }
    }
}


export function initChatMgr()
{
    initParseNerthusCommandsProxy()
    initChatDrunkenness()
}

export function registerChatCommand(name, func, isPublic)
{
    if (isPublic)
        commandsPublicMap[name] = func
    else
        commandsMap[name] = func
}
