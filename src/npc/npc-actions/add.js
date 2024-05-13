import {callEvent} from '../../API'
import {addDialogToDialogList, openDialog} from '../dialog'
import {customNpcs} from '../npc'
import {removeCollision, setCollision} from './collision'
import {removeNpc} from './remove'
import {updateNpcWithCustomGifImage} from '../update-npc-image'

function createClickWrapper(npc, clickHandler)
{
    return function (event)
    {
        if (Math.abs(npc.x - hero.x) > 1 || Math.abs(npc.y - hero.y) > 1)
            hero.mClick(event)
        else
            clickHandler()
    }
}

export function addNpc(npc)
{
    if (INTERFACE === 'NI')
    {
        const data = {}
        data[npc.id] = {...npc}
        data[npc.id].id = Number(npc.id)
        data[npc.id].tpl = Number(npc.id)

        const collisionBefore = Engine.map.col.check(npc.x, npc.y)
        const npcIcon = npc.icon

        if (npcIcon.endsWith('gif'))
        {
            if (npcIcon.startsWith('https://micc.garmory-cdn.cloud/obrazki/npc/'))
            {
                data[npc.id].icon = {
                    special: npcIcon.substring(43)
                }
                Engine.npcTplManager.updateData([data[npc.id]])
                Engine.npcs.updateData(data)
            }
            else if (npcIcon.startsWith('https://micc.garmory-cdn.cloud/obrazki/'))
            {
                const aNpath = window.CFG.r_npath
                const regex = /^https:\/\/micc\.garmory-cdn\.cloud\/obrazki\/(.+?)\//
                const arr = regex.exec(npcIcon)
                window.CFG.r_npath = `/obrazki/${arr[1]}/`

                data[npc.id].icon = {
                    special: npcIcon.replace(regex, '')
                }
                Engine.npcTplManager.updateData([data[npc.id]])
                Engine.npcs.updateData(data)
                window.CFG.r_npath = aNpath
            }
            else
            {
                data[npc.id].icon = {
                    special: 'mas/nic32x32.gif'
                }
                Engine.npcTplManager.updateData([data[npc.id]])
                Engine.npcs.updateData(data)
                updateNpcWithCustomGifImage(Engine.npcs.getById(npc.id), npcIcon)
            }
        }
        else
        {
            npc.icon = 'mas/nic32x32.gif'
            Engine.npcs.updateData(data)
            npc.icon = npcIcon

            const gameNpc = Engine.npcs.getById(npc.id)
            gameNpc.staticAnimation = true

            const img = new Image()
            img.onload = function ()
            {
                gameNpc.sprite = img

                const oldBeforeOnLoad = gameNpc.beforeOnload
                gameNpc.beforeOnload = function ()
                {
                    return oldBeforeOnLoad({
                        img: npcIcon,
                        frames: 1,
                        hdr: {
                            width: img.width,
                            height: img.height
                        }
                    }, img, npc)
                }
                gameNpc.beforeOnload()
            }
            img.src = npcIcon
        }

        if (npc.dialog) addDialogToDialogList(npc.id, npc.nick, npc.dialog)

        if (!collisionBefore)
        {
            if (npc.collision)
                setCollision(npc.x, npc.y)
            else
                removeCollision(npc.x, npc.y)
        }

        return data
    }
    else
    {
        const $npc = $('<div id="npc' + npc.id + '" class="npc nerthus-npc"></div>')
            .css({
                backgroundImage: 'url(' + npc.icon + ')',
                zIndex: npc.type === 4 ? npc.y * 2 + 11 : npc.y * 2 + 10,
                left: npc.x * 32,
                top: npc.y * 32 - 16,
                pointerEvents: npc.type === 4 ? 'none' : 'auto'
            })

        const img = new Image()
        img.onload = function ()
        {
            const width = img.width
            const height = img.height

            const tmpLeft = npc.x * 32 + 16 - Math.round(width / 2) + ((npc.type > 3 && !(width % 64)) ? -16 : 0)
            const wpos = Math.round(this.x) + Math.round(this.y) * 256
            let wat
            if (map.water && map.water[wpos])
                wat = map.water[wpos] / 4
            $npc.css({
                left: tmpLeft,
                top: npc.y * 32 + 32 - height + (wat > 8 ? 0 : 0),
                width: (tmpLeft + width > map.x * 32 ? map.x * 32 - tmpLeft : width),
                height: height - (wat > 8 ? ((wat - 8) * 4) : 0)
            })
        }
        img.src = npc.icon
        $npc.appendTo('#base')
        if (npc.nick)
            $npc.attr({
                ctip: 't_npc',
                tip: `<b>${npc.nick}</b>`
            })

        if (npc.dialog)
        {
            addDialogToDialogList(npc.id, npc.nick, npc.dialog)
            $npc.click(createClickWrapper(npc, openDialog.bind(null, npc.id, 0)))
        }

        if (npc.collision)
            setCollision(npc.x, npc.y)
        return $npc
    }
}

/**
 * Function adds new NPC to the list and displays him,
 * or replaces NPC on the same coordinates and same map
 * @param npc
 * @param mapId
 */
export function addNpcToList(npc, mapId)
{
    if (!customNpcs[mapId]) customNpcs[mapId] = {}
    if (customNpcs[mapId][npc.id]) removeNpc(npc.x, npc.y, mapId)
    customNpcs[mapId][npc.id] = npc
    if (INTERFACE === 'NI')
    {
        if (Engine.map.d.id === mapId)
            addNpc(npc)
    }
    else
    {
        if (map.id === mapId)
            addNpc(npc)
    }
    callEvent('addTemporaryNpc', {npc: npc, mapId: mapId})
}
