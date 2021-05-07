import {pseudoRandom} from '../utility-functions'
import {addNpc} from '../npc/npc-actions/add'
import {customNpcs, Npc} from '../npc/npc'
import {removeNpc} from '../npc/npc-actions/remove'

const lightningUrls = [
    '/obrazki/npc/oev/piorun1.gif',
    '/obrazki/npc/oev/piorun2.gif',
    '/obrazki/npc/oev/piorun3.gif'
    //'/obrazki/npc/oev/lightning.gif'
]

const CHUNK_SIZE = 12
/**
 * 2d table of points where NPCs sit as well as 1 step around them.
 * This is so lightning doesn't struck poor NPCs
 * @type {{}}
 */
let npcZone = {}
const lightningNpcs = []

function addToZone(x, y)
{
    if (x > 0 && !npcZone[x - 1]) npcZone[x - 1] = {}
    if (!npcZone[x]) npcZone[x] = {}
    if (!npcZone[x + 1]) npcZone[x + 1] = {}
    for (let i = -1; i < 1; i++)
    {
        for (let j = -1; j < 1; j++)
        {
            if (x + i >= 0)
                npcZone[x + i][y + j] = true
        }
    }
}

function fillNpcZone()
{
    npcZone = {}
    if (INTERFACE === 'NI')
    {
        const npcs = Engine.npcs.getDrawableList()
        for (const npc of npcs)
        {
            if (npc.d && !isNaN(npc.d.x)) addToZone(npc.d.x, npc.d.y)
        }
        if (customNpcs[Engine.map.d.id])
        {
            for (const npcId in customNpcs[Engine.map.d.id])
            {
                addToZone(customNpcs[Engine.map.d.id][npcId].x, customNpcs[Engine.map.d.id][npcId].y)
            }
        }
    }
    else
    {
        for (const id in g.npc)
        {
            addToZone(g.npc[id].x, g.npc[id].y)
        }
        if (customNpcs[map.id])
        {
            for (const npc of customNpcs[map.id])
            {
                addToZone(npc.x, npc.y)
            }
        }
    }

    for (const npc of customNpcs.default)
    {
        addToZone(npc.x, npc.y)
    }
}

function addLightningToChunk(chunkX, chunkY, tries = 0)
{
    if (tries > 3) return

    let mapId
    if (INTERFACE === 'NI')
    {
        mapId = Engine.map.d.id
    }
    else
    {
        mapId = map.id
    }

    const minX = chunkX * CHUNK_SIZE
    const maxX = (chunkX * CHUNK_SIZE) + CHUNK_SIZE
    const minY = chunkY * CHUNK_SIZE
    const maxY = (chunkY * CHUNK_SIZE) + CHUNK_SIZE

    const date = new Date()
    date.setMinutes(0, 0, 0)
    const seed = Number(date) + ((chunkX + 1) * (chunkY + 1) * mapId) + tries

    const x = Math.floor(pseudoRandom(seed) * ((maxX + 1) - minX)) + minX
    const y = Math.floor(pseudoRandom(seed + 1) * ((maxY + 1) - minY)) + minY

    if (npcZone[x] && npcZone[x][y]) addLightningToChunk(chunkX, chunkY, tries + 1)
    else
    {
        const imgId = Math.floor(pseudoRandom(seed + chunkX + chunkY) * lightningUrls.length)
        lightningNpcs.push(addNpc(new Npc(x, y, lightningUrls[imgId], '', false)))
    }
}

export function clearLightnings()
{
    if (INTERFACE === 'NI')
    {
        for (const npcObj of lightningNpcs)
        {
            for (let id in npcObj)
            {
                removeNpc(npcObj[id].x, npcObj[id].y)
            }
        }
        lightningNpcs.splice(0, lightningNpcs.length)
    }
    else
    {
        for (const $npc of lightningNpcs)
        {
            $npc.remove()
        }
        lightningNpcs.splice(0, lightningNpcs.length)
    }
}

export function displayLightnings()
{
    fillNpcZone()

    let mapChunks = {}
    if (INTERFACE === 'NI')
    {
        mapChunks.x = Math.floor(Engine.map.d.x / CHUNK_SIZE)
        mapChunks.y = Math.floor(Engine.map.d.y / CHUNK_SIZE)
    }
    else
    {
        mapChunks.x = Math.floor(map.x / CHUNK_SIZE)
        mapChunks.y = Math.floor(map.y / CHUNK_SIZE)
    }

    for (let i = 0; i < mapChunks.x; i++)
    {
        for (let j = 0; j < mapChunks.y; j++)
        {
            addLightningToChunk(i, j)
        }
    }
}
