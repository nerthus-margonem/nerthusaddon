import {resolveUrl} from '../../utility-functions'
import {updateNpcWithCustomGifImage, updateNpcWithGameImage} from '../update-npc-image'

export function changeGameNpc(npc)
{
    if (INTERFACE === 'NI')
    {
        const callback = function (newNpc)
        {
            if (newNpc.d && newNpc.d.id === npc.id)
            {
                const img = new Image()
                img.src = resolveUrl(npc.newUrl)
                if (img.src.endsWith('gif'))
                {
                    if (img.src.startsWith('https://micc.garmory-cdn.cloud/obrazki/npc/'))
                    {
                        const icon = img.src.substring(43)
                        updateNpcWithGameImage(newNpc, icon)
                    }
                    else if (img.src.startsWith('https://micc.garmory-cdn.cloud/obrazki/'))
                    {
                        const aNpath = window.CFG.r_npath
                        const regex = /^https:\/\/micc\.garmory-cdn\.cloud\/obrazki\/(.+?)\//
                        const arr = regex.exec(img.src)
                        window.CFG.r_npath = `/obrazki/${arr[1]}/`
                        const icon = img.src.substring(43)

                        updateNpcWithGameImage(newNpc, icon)

                        window.CFG.r_npath = aNpath
                    }
                    else
                    {
                        updateNpcWithCustomGifImage(Engine.npcs.getById(npc.id), img.src)
                    }
                }
                else
                {
                    const img = new Image()
                    img.src = resolveUrl(npc.newUrl)
                    newNpc.sprite = img
                    Object.defineProperty(newNpc, 'sprite', {
                        get() {return img},
                        set() {}
                    })
                }

                // Run only once
                // setTimeout so that it removes itself after all NPCs are checked by API,
                // otherwise it would throw an error
                setTimeout(API.removeCallbackFromEvent.bind(API, 'newNpc', callback), 0)
            }
        }
        API.addCallbackToEvent('newNpc', callback)
    }
    else
    {
        let $style = $('#nerthus-npc-changing')
        if (!$style.length)
            $style = $('<style id="nerthus-npc-changing" />').appendTo('head')

        $style.append('#npc' + npc.id + '{' +
            'background-repeat: no-repeat;' +
            'background-image: url(' + resolveUrl(npc.newUrl) + ') !important;' +
            '}')
    }
}
