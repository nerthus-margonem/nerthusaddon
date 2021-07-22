export function setCollision(x, y)
{
    if (INTERFACE === 'NI')
        Engine.map.col.set(x, y, 2)
    else
    {
        map.nodes.changeCollision(x, y, true)
        g.npccol[x + 256 * y] = true
    }
}

export function removeCollision(x, y)
{
    if (INTERFACE === 'NI')
    {
        Engine.map.col.unset(x, y, 2)
        Engine.map.createCollisionMap()
    }
    else
    {
        map.nodes.changeCollision(x, y, false)
        delete g.npccol[x + 256 * y]
    }
}
