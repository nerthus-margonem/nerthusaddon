import {registerChatCommand} from './chat'
import {addToMapChangelist, applyCurrentMapChange, removeFromMapChangelist} from '../maps'
import {addNpcToList} from '../npc/npc-actions/add'
import {Npc} from '../npc/npc'
import {removeNpc} from '../npc/npc-actions/remove'
import {changeLight, checkAndApplyNight} from '../night/night'
import {hideGameNpc} from '../npc/npc-actions/hide'

function makeDialogTextWithSpeaker(str)
{
    str = str.split(' ').slice(1).join(' ').split(',')
    return '«' + str[0] + '» ' + str.slice(1).join(',')
}

function nar1(ch)
{
    ch.s = 'nar'
    ch.n = ''
    ch.t = ch.t.replace(/^\*nar1? /, '')
    return ch
}

function nar2(ch)
{
    ch.s = 'nar2'
    ch.n = ''
    ch.t = ch.t.replace(/^\*nar2 /, '')
    return ch
}

function nar3(ch)
{
    ch.s = 'nar3'
    ch.n = ''
    ch.t = ch.t.replace(/^\*nar3 /, '')
    return ch
}

function dial1(ch)
{
    ch.s = 'dial1'
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function dial2(ch)
{
    ch.s = 'dial2'
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function dial3(ch)
{
    ch.s = 'dial3'
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function dial666(ch)
{
    ch.s = 'dial666'
    ch.n = ''
    ch.t = makeDialogTextWithSpeaker(ch.t)
    return ch
}

function sys(ch)
{
    ch.s = 'sys_comm'
    ch.n = ''
    ch.t = ch.t.replace(/^\*sys /, '')
    return ch
}

function map(ch)
{
    const cmd = ch.t.split(' ').slice(1).join(' ').split(',')
    const mapUrl = cmd[0]
    const mapId = cmd[1]
    if (mapId)
        addToMapChangelist(mapUrl, 2, mapId)
    else
        addToMapChangelist(mapUrl, 1)

    applyCurrentMapChange()

    return false
}

function resetMap(ch)
{
    const mapId = ch.t.split(' ').slice(1).join(' ')

    removeFromMapChangelist(2, mapId)
    applyCurrentMapChange()

    return false
}

function light(ch)
{
    const arr = ch.t.split(' ')
    arr.shift()
    if (arr.length === 0) checkAndApplyNight() // if no arguments
    else
    {
        const argArr = arr.join(' ').split(',')
        let opacity = argArr[0].trim()
        const color = argArr[1] ? argArr[1].trim() : '#000'
        opacity = parseFloat(opacity.replace(',', '.'))
        changeLight(1 - opacity, color)
    }

    return false
}

function addGraf(ch)
{
    //cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol, cmd[5]=map_id
    const cmd = ch.t.split(' ').slice(1).join(' ').split(',')
    const x = parseInt(cmd[0])
    const y = parseInt(cmd[1])
    const url = cmd[2]
    const name = cmd[3]
    const isCol = parseInt(cmd[4]) > 0
    const mapId = parseInt(cmd[5])

    addNpcToList(new Npc(x, y, url, `<b>${name}</b>`, isCol), mapId)

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

// function weather(ch)
// {
//     var weather_id = parseInt(ch.t.split(" ")[1])
//     nerthus_weather_bard_id = weather_id
//     nerthus.weather.set_weather(weather_id)
//
//     return false
// }

function me(ch)
{
    ch.s = 'me'
    ch.n = ''
    ch.t = ch.t.replace(/^\*me /, '')
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
    'hide': hide
}
const publicCommands = {
    'me': me
}

export function initBasicChatCommands()
{
    for (const cmd in narratorCommands)
        registerChatCommand(cmd, narratorCommands[cmd], false)
    for (const cmd in publicCommands)
        registerChatCommand(cmd, publicCommands[cmd], true)
}
