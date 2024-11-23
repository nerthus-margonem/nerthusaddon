import {decodeGif} from '../decodeGif'

/**
 *
 * @param npc reference to NPC used by game
 * @param gifIconUrl {string} url to .gif image
 * @returns {Promise<void | void>}
 */
export async function updateNpcWithCustomGifImage(npc, gifIconUrl)
{
    return fetch(gifIconUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => new Uint8Array(buffer))
        .then(array => decodeGif(array))
        .then(decoded =>
        {
            const canvas = document.createElement('canvas')
            canvas.width = decoded.width
            canvas.height = decoded.height * decoded.frameData.length
            const ctx = canvas.getContext('2d')
            for (let i = 0; i < decoded.frameData.length; i++)
            {
                const frameCanvas = document.createElement('canvas')
                frameCanvas.width = decoded.width
                frameCanvas.height = decoded.height
                const frameCtx = frameCanvas.getContext('2d')
                const img = new ImageData(decoded.frameData[i], decoded.width, decoded.height)
                frameCtx.putImageData(img, 0, 0)
                ctx.drawImage(frameCanvas, 0, i * decoded.height)
            }

            // Update everything by hand
            npc.sprite = new Image()
            npc.sprite.src = canvas.toDataURL()
            npc.fw = decoded.width
            npc.fh = decoded.height
            npc.halffw = decoded.width / 2
            npc.halffh = decoded.height / 2
            npc.frameAmount = decoded.frameData.length
            npc.frames = decoded.frameDelays.map((delay) => ({delay}))
            npc.leftPosMod = npc.d.type > 3 && !(npc.fw % 64) ? -16 : 0
            if (npc.d.type !== 4) npc.updateCollider()
            npc.beforeOnload = function () {} // force not updating image anymore
            npc.resetActiveFrame() // reset active frame, so if basic graphic has more frames, it won't crash
        })
        .catch((err) => console.error(`Error while fetching NPC ${gifIconUrl}`, err))
}

export function updateNpcWithGameImage(npc, imgUrl)
{
    const beforeOnload = npc.beforeOnload
    npc.beforeOnload = function (data, img, npc)
    {
        if (npc.icon === imgUrl)
        {
            beforeOnload.call(npc, ...arguments)
        }
    }
    setTimeout(() =>
    {
        npc.d.icon = {
            special: imgUrl
        }
        Engine.npcs.updateData([npc.d])
    }, 1)
}
