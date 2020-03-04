import {removeCollision} from './collision'

export function removeNpc(x, y)
{
    if (INTERFACE === 'NI')
    {
        if (typeof map_id === 'undefined' || parseInt(map_id) === Engine.map.d.id) //todo NOT HERE
        {
            const id = this.coordsToId(x, y)
            if (Engine.npcs.getById(id)) Engine.npcs.removeOne(id)

            removeCollision(x,y)
        }
        for (let i = 0; i < this.npcs.length; i++)
            if (this.npcs[i][0] === x && this.npcs[i][1] === y)
                if (typeof map_id === 'undefined' || parseInt(map_id) === parseInt(this.npcs[i][5]))
                    this.npcs.splice(i, 1)
    }
    else
    {
        if (typeof map_id === 'undefined' || parseInt(map_id) === map.id)
        {
            $('#npc' + this.coordsToId(x, y)).remove()
            removeCollision(x,y)
        }
    }
}
