import {removeCollision, setCollision} from './collision'
import {addDialogToDialogList, openDialog} from '../dialog'
import {customNpcs} from '../npc'
import {removeNpc} from './remove'
import {callEvent} from '../../API'

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
        data[npc.id] = npc

        const collisionBefore = Engine.map.col.check(npc.x, npc.y)
        const npcIcon = npc.icon

        if (npcIcon.endsWith('gif'))
        {
            const baseCdnUrl = window.cdnUrl
            console.log(npcIcon)
            // hack the url
            if (npcIcon.startsWith('/')) window.cdnUrl = '/image_proxy.php?a=https://micc.garmory-cdn.cloud' + npc.icon + '&x='
            else window.cdnUrl = '/image_proxy.php?a=' + npc.icon + '&x='

            Engine.npcs.updateData(data)
            window.cdnUrl = baseCdnUrl
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
        const icon = npc.icon.startsWith('/') ? `https://micc.garmory-cdn.cloud${npc.icon}` : npc.icon
        const $npc = $('<div id="npc' + npc.id + '" class="npc nerthus-npc"></div>')
            .css({
                backgroundImage: 'url(' + icon + ')',
                zIndex: npc.y * 2 + 9,
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
        img.src = icon
        $npc.appendTo('#base')
        if (npc.nick)
            $npc.attr({
                ctip: 't_npc',
                tip: npc.nick
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
