import {loadOnEveryMap} from '../game-integration/loaders'
import {addSettingToPanel} from '../interface/panel'
import {coordsToId, resolveUrl} from '../utility-functions'
import {initNpcDialog} from './dialog'
import {addNpc} from './npc-actions/add'
import {changeGameNpc} from './npc-actions/change'
import {customHiddenNpcs, hideGameNpc, isNpcHidable} from './npc-actions/hide'
import {isNpcDeployable} from './npc-time'

export const customNpcs = {
    default: []
}


export function Npc(x, y, url, nick, collision, dialog)
{
    this.x = parseInt(x)
    this.y = parseInt(y)

    this.id = coordsToId(x, y)

    this.nick = nick
    this.type = this.nick === '' ? 4 : 0

    this.icon = resolveUrl(url)

    this.update = function () {}
    this.actions = 0
    this.grp = 0
    this.wt = this.type === 4 ? 1 : 0

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
            const tip = npc.tip ?? npc.name

            const customNpc = new Npc(npc.x, npc.y, npc.url, tip, npc.collision, npc.dialog)
            return addNpc(customNpc)
        }
    }
}

export function loadNpcsFromFile(url)
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

        for (const npcId in customNpcs[Engine.map.d.id])
        {
            addNpc(customNpcs[Engine.map.d.id][npcId])
        }
    }
    else
    {
        if (AVAILABLE_MAP_FILES.npc.includes(map.id))
            loadNpcsFromFile(FILE_PREFIX + 'res/configs/npcs/' + map.id + '.json')

        for (const npcId in customNpcs[map.id])
        {
            addNpc(customNpcs[map.id][npcId])
        }
    }
    customNpcs.default.forEach(addNpc)
}


export function initNpcManager()
{
    initNpcDialog()
    loadOnEveryMap(function ()
    {
        if (INTERFACE === 'SI')
        {
            $('.nerthus-npc').remove()

            // fixes strange reference error in SI engine
            if (typeof window.groupId === 'undefined') window.groupId = null
        }
        loadNpcs()
        customHiddenNpcs.forEach(hideGameNpc)
    })

    addSettingToPanel(
        'hideNpcs',
        'Ukrywanie NPCów',
        'Ukrywa NPCów ustawionych przez dodatek oraz przez specjalną komendę dostępną dla narratorów. (wymaga resetu gry)',
        function ()
        {
            // TODO
        })
}
