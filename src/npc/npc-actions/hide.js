import {settings} from '../../settings'

export function isNpcHidable(npc)
{
    if (INTERFACE === 'NI')
        return npc.lvl === 0 || npc.lvl + 13 < Engine.hero.d.lvl
    else
        return npc.lvl === 0 || npc.lvl + 13 < hero.lvl
}

export function hideGameNpc(id, always)
{
    if (INTERFACE === 'NI')
    {
        if (always || settings.hideNpcs)
        {
            const callback = function (newNpc)
            {
                if (newNpc.d && newNpc.d.id === id.toString())
                {
                    // Remove in this fashion (instead of just calling .delete()
                    // because we don't want to unset collisions when hiding
                    API.callEvent('removeNpc', newNpc)
                    Engine.npcs.removeOne(newNpc.d.id)
                    Engine.emotions.removeAllFromSourceId(newNpc.d.id)

                    // Run only once
                    // setTimeout so that it removes itself after all NPCs are checked by API,
                    // otherwise it would throw error
                    setTimeout(API.removeCallbackFromEvent.bind(API, 'newNpc', callback), 0)
                }
            }
            API.addCallbackToEvent('newNpc', callback)
        }
    }
    else
    {
        let $style = $('#nerthus-npc-hiding')
        if (!$style.length)
            $style = $('<style id="nerthus-npc-hiding"></style>').appendTo('head')

        if (always || settings.hideNpcs)
            $style.append('#npc' + id + '{display: none}')
    }
}
