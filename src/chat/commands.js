import {sanitizeText} from '../utility-functions'
import {registerChatCommand} from './chat'
import {addToMapChangelist, applyCurrentMapChange, removeFromMapChangelist} from '../maps'
import {addNpcToList} from '../npc/npc-actions/add'
import {Npc} from '../npc/npc'
import {removeNpc} from '../npc/npc-actions/remove'
import {applyCurrentNight, setForcedParameters} from '../night/night'
import {hideGameNpc} from '../npc/npc-actions/hide'
import {displayWeather, setForcedWeather} from '../weather/weather'
import {clearEffects} from '../weather/effects'
import {settings} from '../settings'

function makeDialogTextWithSpeaker(str)
{
    str = str.split(' ').slice(1).join(' ').split(',')
    return '«' + str[0] + '» ' + str.slice(1).join(',')
}

function nar1(msg)
{
    msg.style = 'nerthus-nar1'
    msg.nick = msg.authorBusinessCard.getNick()
    msg.authorBusinessCard = null
    msg.text = msg.text.replace(/^\*nar1? /, '')
    return msg
}

function nar2(msg)
{
    msg.style = 'nerthus-nar2'
    msg.nick = msg.authorBusinessCard.getNick()
    msg.authorBusinessCard = null
    msg.text = msg.text.replace(/^\*nar2 /, '')
    return msg
}

function nar3(msg)
{
    msg.style = 'nerthus-nar3'
    msg.nick = msg.authorBusinessCard.getNick()
    msg.authorBusinessCard = null
    msg.text = msg.text.replace(/^\*nar3 /, '')
    return msg
}

function dial1(ch)
{
    ch.s = 'dial1'
    ch.nick = ch.n
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function dial2(ch)
{
    ch.s = 'dial2'
    ch.nick = ch.n
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function dial3(ch)
{
    ch.s = 'dial3'
    ch.nick = ch.n
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function dial666(ch)
{
    ch.s = 'dial666'
    ch.nick = ch.n
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function sys(ch)
{
    ch.s = 'sys_comm'
    ch.nick = ch.n
    ch.n = ''
    ch.t = ch.t.replace(/^\*sys /, '')
    return ch
}

function map(ch)
{
    const cmd = ch.t.split(' ').slice(1).join(' ').split(',')
    const mapUrl = sanitizeText(cmd[0])
    const mapId = parseInt(cmd[1])
    if (mapId)
        addToMapChangelist(mapUrl, 2, mapId)
    else
        addToMapChangelist(mapUrl, 1)

    applyCurrentMapChange()

    return false
}

function resetMap(ch)
{
    const mapId = parseInt(ch.t.split(' ').slice(1).join(' '))

    removeFromMapChangelist(2, mapId)
    applyCurrentMapChange()

    return false
}

function light(ch)
{
    const arr = ch.t.split(' ')
    arr.shift()
    if (arr.length === 0) setForcedParameters(-1, '#000') // if no arguments
    else
    {
        const argArr = arr.join(' ').split(',')
        let opacity = argArr[0].trim()
        const color = argArr[1] ? argArr[1].trim() : '#000'
        const mapId = argArr[2] ? argArr[2].trim() : 'default'
        opacity = parseFloat(opacity.replace(',', '.'))
        setForcedParameters(1 - opacity, color, mapId)
    }

    applyCurrentNight()

    return false
}

function addGraf(ch)
{
    //cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol, cmd[5]=map_id
    const cmd = ch.t.split(' ').slice(1).join(' ').split(',')
    const x = parseInt(cmd[0])
    const y = parseInt(cmd[1])
    const url = sanitizeText(cmd[2])
    const name = sanitizeText(cmd[3])
    const nick = name ? `<b>${name}</b>` : ''
    const isCol = parseInt(cmd[4]) > 0
    const mapId = parseInt(cmd[5])

    addNpcToList(new Npc(x, y, url, nick, isCol), mapId)

    return false
}

function delGraf(ch)
{
    const cmd = ch.t.split(' ')[1].split(',')
    const x = parseInt(cmd[0])
    const y = parseInt(cmd[1])
    const mapId = parseInt(cmd[2])

    removeNpc(x, y, mapId)

    return false
}

function hide(ch)
{
    const cmd = ch.t.split(' ')[1]
    const id = parseInt(cmd)

    hideGameNpc(id)

    return false
}

function weather(ch)
{
    const weatherArr = /^\*weather(?: ([\w-]+)(?:, ?(\d+))?)?/g.exec(ch.t)
    setForcedWeather(weatherArr[1], weatherArr[2])
    if (settings.weatherEffects) clearEffects(true)
    displayWeather()

    return false
}

function me(msg)
{
    msg.style = 2 // 2 is special style for regular `/me`
    msg.nick = msg.authorBusinessCard.getNick()
    msg.authorBusinessCard = null
    msg.text = msg.text.replace(/^\*me /, '')
    return msg
}

function lang(ch)
{
    if (ch.t.split(',').length < 2) return ch // early return incorrect input

    ch.s = 'lang'
    ch.t = ch.t.replace(/^\*lang /, '') // remove *lang
    const cmd = ch.t.split(',')

    const notAllowed = /[^a-ząćęłńóśźż -]/gi
    const tip = cmd[0].toLowerCase().replace(notAllowed, '')
    cmd.shift() // remove tip

    ch.t = `*${cmd.join(',').trim()}*`

    // add language tip after message is added to the page
    setTimeout(function ()
    {
        if (INTERFACE === 'NI')
        {
            const elm = document.querySelector(`[data-ts="${ch.ts}"] span:last-of-type`)
            if (!elm) return
            $(elm).tip(`Język wiadomości: ${tip}`)
        }
        else
        {
            const elm = document.querySelector(`[data-ts="${ch.ts}"] .chatmsg`)
            if (!elm) return
            elm.setAttribute('tip', `Język wiadomości: ${tip}`)
        }

    }, 0)

    return ch
}

const narratorCommands = {
    'nar': nar1,
    'nar1': nar1,
    'nar2': nar2,
    'nar3': nar3,
    'dial': dial1,
    'dial1': dial1,
    'dial2': dial2,
    'dial3': dial3,
    'dial666': dial666,
    'sys': sys,
    'map': map,
    'resetMap': resetMap,
    'light': light,
    'addGraf': addGraf,
    'delGraf': delGraf,
    'hide': hide,
    'weather': weather
}
const publicCommands = {
    'me': me,
    'lang': lang
}

export function initBasicChatCommands()
{
    for (const cmd in narratorCommands)
        registerChatCommand(cmd, narratorCommands[cmd], false)
    for (const cmd in publicCommands)
        registerChatCommand(cmd, publicCommands[cmd], true)
}
