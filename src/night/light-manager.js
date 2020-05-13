const $style = $('<style>')

function removeLight($light)
{

}

function startEditingLigths()
{
    $style.text('.nerthus__night-light { pointer-events: all !important }')

    $('.nerthus__night-light').each(function ()
    {
        const $self = $(this)
        $self.dblclick(function ()
        {
            $self.delete()
        })

    })
}

function stopEditingLights()
{
    $style.text('')
}

function downloadLog()
{
    const arr = []
    $('.nerthus__night-light').each(function ()
    {
        const $this = $(this)
        const pos = $this.position()
        const obj = {
            x: parseInt(pos.left),
            y: parseInt(pos.top),
            type: $this.attr('type')
        }
        arr.push(obj)
    })
    // const a = window.document.createElement('a')
    // a.href = window.URL.createObjectURL(new window.Blob([JSON.stringify(npcList, null, 4)], { type: 'text/json' }))
    // a.download = '' + window.narratorTools.sharedElements.mapId + '.json'
    // document.body.appendChild(a)
    // a.click()
    // document.body.removeChild(a)
}

export function initLightManager()
{
    if (INTERFACE === 'SI')
    {
        $style.appendTo('head')

        const $lightManager = $(`
<div id="nerthus-light-manager">

</div>
    `)

        $lightManager
            .appendTo('#centerbox2')
            .draggable({
                start: function ()
                {
                    const lock = window.g ? window.g.lock : window.Engine.lock
                    lock.add('nerthus-panel-drag')
                },
                stop: function ()
                {
                    const lock = window.g ? window.g.lock : window.Engine.lock
                    lock.remove('nerthus-panel-drag')
                }
            })
    }
}
