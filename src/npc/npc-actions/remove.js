import {removeCollision} from './collision'
import {coordsToId} from '../../utility-functions'
import {customNpcs} from '../npc'

export function removeNpc(x, y, mapId)
{
    if (customNpcs[mapId][coordsToId(x, y)]) delete customNpcs[mapId][coordsToId(x, y)]
    if (INTERFACE === 'NI')
    {
        if (typeof mapId === 'undefined' || mapId === Engine.map.d.id)
        {
            const id = coordsToId(x, y)
            if (Engine.npcs.getById(id)) Engine.npcs.removeOne(id)
        }
    }
    else
    {
        if (typeof mapId === 'undefined' || parseInt(mapId) === map.id)
            $('#npc' + coordsToId(x, y)).remove()
    }
    removeCollision(x, y)
}
