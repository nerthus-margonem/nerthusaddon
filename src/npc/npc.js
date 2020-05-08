import {isNpcDeployable} from './npc-time'
import {loadOnEveryMap} from '../game-integration/loaders'
import {hideGameNpc, isNpcHidable} from './npc-actions/hide'
import {changeGameNpc} from './npc-actions/change'
import {addNpc} from './npc-actions/add'
import {initNpcDialog} from './dialog'
import {coordsToId} from '../utility-functions'

function resolveUrl(url)
{
    if (url.startsWith('#'))
        return FILE_PREFIX + url.slice(1)
    return url
}

function CustomNpc(x, y, url, nick, collision, dialog)
{
    this.x = parseInt(x)
    this.y = parseInt(y)

    this.id = coordsToId(x, y)

    this.nick = nick
    this.type = this.nick === '' ? 4 : 0

    this.icon = resolveUrl(url)

    this.update = function(){}
    this.actions = 0
    this.grp = 0
    this.wt = 0

    this.collision = collision
    this.dialog = dialog
}


function deploy(npc)
{
    if (!isNpcDeployable(npc)) return 1
    switch (npc.type)
    {
        case 'delete':
        {
            if (!isNpcHidable(npc))
                return
            return hideGameNpc(npc.id, npc.lvl === 0)
        }
        case 'change':
        {
            return changeGameNpc(npc)
        }
        default:
        {
            const tip = npc.tip ? npc.tip : '<b>' + npc.name + '</b>'
            const customNpc = new CustomNpc(npc.x, npc.y, npc.url, tip, npc.collision, npc.dialog)

            return addNpc(customNpc)
        }
    }
}

function loadNpcsFromFile(url)
{
    $.getJSON(url, function (npcs)
    {
        if (npcs) npcs.forEach(deploy)
    })
}

function loadNpcs()
{
    if (INTERFACE === 'NI')
    {
        if (AVAILABLE_MAP_FILES.npc.includes(Engine.map.d.id))
            loadNpcsFromFile(FILE_PREFIX + 'res/configs/npcs/' + Engine.map.d.id + '.json')
    }
    else
    {
        if (AVAILABLE_MAP_FILES.npc.includes(map.id))
            loadNpcsFromFile(FILE_PREFIX + 'res/configs/npcs/' + map.id + '.json')
    }
}


export function initNpcManager()
{
    initNpcDialog()
    loadOnEveryMap(function ()
    {
        if (INTERFACE === 'SI')
        {
            $('.nerthus-npc').remove()
        }
        loadNpcs()
    })
}
