export function setCollision(npc) //todo make it to x,y
{
    if (npc.collision)
        if (INTERFACE === 'NI')
            Engine.map.col.set(parseInt(npc.x), parseInt(npc.y), 2)
        else
            g.npccol[parseInt(npc.x) + 256 * parseInt(npc.y)] = true
}

export function removeCollision(x, y)
{
        if (INTERFACE === 'NI')
            Engine.map.col.unset(x, y, 2)
        else
            delete g.npccol[x + 256 * y]
}
