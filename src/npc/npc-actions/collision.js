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
        if (Engine.map.col.check(x, y))
        {
            Engine.map.col.set(x, y, 0) // using set because unset has a bug when loading too quickly
        }
    }
    else
    {
        map.nodes.changeCollision(x, y, false)
        delete g.npccol[x + 256 * y]
    }
}
