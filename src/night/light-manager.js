import {lightsOn, turnLightsOn} from './lights'

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

const $lightHider = $('<style>').appendTo('head')

function toggleLights()
{
    if (!lightsOn)
    {
        turnLightsOn()
        $('#nerthus-light-manager-toggle-lights').addClass('blue')
    }
    else if ($lightHider.text() === '')
    {
        $lightHider.text('#ground > .nerthus__night-light {display: none !important}')
        $('#nerthus-light-manager-toggle-lights').removeClass('blue')
    }
    else
    {
        $lightHider.text('')
        $('#nerthus-light-manager-toggle-lights').addClass('blue')
    }
}

function toggleMouseMove()
{
    hero.opt ^= 64
    $('#nerthus-light-manager-toggle-mousemove').toggleClass('blue')
}

const $borderStyle = $('<style>').appendTo('head')

function toggleBorder()
{
    if ($borderStyle.text() === '')
    {
        $borderStyle.text('#ground > .nerthus__night-light {border: 1px solid yellow}')
    }
    else
    {
        $borderStyle.text('')
    }
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
    const a = window.document.createElement('a')
    a.href = window.URL.createObjectURL(new window.Blob([JSON.stringify(arr, null, 2)], {type: 'text/json'}))
    if (INTERFACE === 'NI')
    {
        a.download = '' + Engine.map.d.id + '.json'
    }
    else
    {
        a.download = '' + map.id + '.json'
    }
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export function initLightManager()
{
    if (INTERFACE === 'SI')
    {
        $style.appendTo('head')

        const $lightManager = $(`
<div id="nerthus-light-manager" class="nerthus-panel">
    <div class="header-label-positioner">
        <div class="header-label">
            <div class="left-decor"></div>
            <div class="right-decor"></div>
            <span class="panel-name">Narzędzia światła</span>
        </div>
    </div>
    <div class="close-decor">
        <button class="close-button"></button>
    </div>
    <div class="background">
        <a id="nerthus-light-manager-toggle-lights" class="button" tip="Pokaż światła">
            <img src="${FILE_PREFIX}res/img/panel/sun.png">
        </a>
        <a id="nerthus-light-manager-toggle-mousemove" class="button" tip="Zablokuj chodzenie myszką">
            <img src="${FILE_PREFIX}res/img/panel/mouse.png">
        </a>
        <a id="nerthus-light-manager-toggle-border" class="button" tip="Przełącz obramowanie świateł">
            <img src="${FILE_PREFIX}res/img/panel/border.png">
        </a>
        <a id="nerthus-light-manager-save" class="button" tip="Pobierz dane o światłach">
            <img src="${FILE_PREFIX}res/img/panel/download.png">
        </a>
    </div>
</div>
    `.replace(/\n| {2}/g, ''))

        const $toggleLights = $lightManager.find('#nerthus-light-manager-toggle-lights')
        $toggleLights.click(toggleLights)
        if (lightsOn) $toggleLights.addClass('blue')

        const $toggleMouseMove = $lightManager.find('#nerthus-light-manager-toggle-mousemove')
        $toggleMouseMove.click(toggleMouseMove)
        if (hero.opt & 64) $toggleMouseMove.addClass('blue')

        $lightManager.find('#nerthus-light-manager-toggle-border').click(toggleBorder)
        $lightManager.find('#nerthus-light-manager-save').click(downloadLog)


        $lightManager
            .draggable({
                start()
                {
                    const lock = window.g ? window.g.lock : window.Engine.lock
                    lock.add('nerthus-panel-drag')
                },
                stop()
                {
                    const lock = window.g ? window.g.lock : window.Engine.lock
                    lock.remove('nerthus-panel-drag')
                }
            })
            .appendTo('#centerbox2')
            .css('position', 'absolute')
    }
}
