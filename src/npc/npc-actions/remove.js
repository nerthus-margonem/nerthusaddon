import {removeCollision} from './collision'
import {coordsToId} from '../../utility-functions'
import {customNpcs} from '../npc'
import {callEvent} from '../../API'

export function removeNpc(x, y, mapId)
{
    if (customNpcs[mapId] && customNpcs[mapId][coordsToId(x, y)]) delete customNpcs[mapId][coordsToId(x, y)]
    if (INTERFACE === 'NI')
    {
        if (typeof mapId === 'undefined' || mapId === Engine.map.d.id)
        {
            const id = coordsToId(x, y)
            const npc = Engine.npcs.getById(id)
            if (npc)
            {
                npc.delete()
                setTimeout(Engine.map.createCollisionMap, 100) // Fix for wonky collisions
            }
        }
    }
    else
    {
        if (typeof mapId === 'undefined' || parseInt(mapId) === map.id)
            $('#npc' + coordsToId(x, y)).remove()
    }
    removeCollision(x, y)
    callEvent('removeTemporaryNpc', {x: x, y: y, mapId: mapId})
}
