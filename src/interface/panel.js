import {saveSetting, settings} from '../settings'
import {initLightManager} from '../night/light-manager'

const ELEMENT_TO_ATTACH_TO = INTERFACE === 'NI' ? 'body' : '#centerbox2'

let $elm = $()
const defaultPosition = [6, 'top-right']

const settingsList = []

/**
 * Contains functions that return strings that are representations of elements
 */
const constructElement = {}

constructElement.button = function (data)
{
    return (
        '<a href="' + data.url + '" target="_blank" class="button" tip="' + data.name + '">' +
        '<img src="' + FILE_PREFIX + 'res/img/panel/' + data.icon + '" alt="' + data.name + '">' +
        '</a>'
    )
}

constructElement.buttonGroup = function (groupData)
{
    const buttonGroup = []
    const len = groupData.length
    for (let i = 0; i < len; i++)
        buttonGroup.push(this.button(groupData[i]))
    return buttonGroup.join('')
}

constructElement.settings = function ()
{
    return (
        '<div class="top-box"></div>' +
        '<div class="bottom-box">' +
        '<button class="button text-button save-button">Zapisz</button>' +
        '<button class="button text-button cancel-button">Anuluj</button>' +
        '</div>'
    )
}

constructElement.panel = function (buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settings)
{
    let lightManagerButton = ''
    if (INTERFACE === 'SI')
    {
        lightManagerButton = `
<button id="light-manager-button" class="button nerthus-settings-button" tip="Narzędzia edycji świateł">
    <img src="${FILE_PREFIX}res/img/panel/stars.png" alt="Narzędzia edycji świateł">
</button>
`
    }

    return (
        '<div id="nerthus-main-panel" class="nerthus-panel">' +
        '<div class="header-label-positioner">' +
        '<div class="header-label">' +
        '<div class="left-decor"></div>' +
        '<div class="right-decor"></div>' +
        '<span class="panel-name">Panel Nerthusa</span>' +
        '</div>' +
        '</div>' +
        '<div class="close-decor">' +
        '<button class="close-button" tip="Zamknij"/>' +
        '</div>' +
        '<div class="background">' +
        '<div class="default-panel">' +
        '<div class="top-box">' +
        '<div id="button-group-left" class="button-group">' + buttonGroupLeft + '</div>' +
        '<div id="button-group-center" class="button-group">' + buttonGroupCenter + '</div>' +
        '<div id="button-group-right" class="button-group">' + buttonGroupRight + '</div>' +
        '</div>' +
        '<div class="bottom-box">' +
        '<button class="button text-button ok-button">OK</button>' +
        '</div>' +
        '</div>' +
        '<div class="settings-panel hidden">' +
        settings +
        '</div>' +
        lightManagerButton +
        '<button id="settings-button" class="button nerthus-settings-button" tip="Ustawienia">' +
        '<img src="' + FILE_PREFIX + 'res/img/panel/settings.png' + '" alt="Ustawienia">' +
        '</button>' +
        '</div>' +
        '</div>'
    )
}

constructElement.icon = function ()
{
    return '<img id="nerthus-shield" src="' + FILE_PREFIX + 'res/img/widget-icon.gif" tip="Nerthus" alt="Nerthus panel">'
}

function closePanel($elm)
{
    $elm.css({visibility: 'hidden', opacity: '0'}) // reset opacity as we're still holding reference
    $elm.find('.default-panel').removeClass('hidden')
    $elm.find('.settings-panel').addClass('hidden')

    const $settingsButton = $elm.find('#settings-button')
    if (INTERFACE === 'NI') $settingsButton.tip('Ustawienia')
    else $settingsButton.attr('tip', 'Ustawienia')

    $settingsButton.children().attr('src', FILE_PREFIX + 'res/img/panel/settings.png')
    $settingsButton.removeClass('back-to-default')

    $elm.find('.panel-name').text('Panel Nerthusa')
}

function createPanel(data, hidden)
{
    if (!$elm.parent || !$elm.parent(ELEMENT_TO_ATTACH_TO).length)
    {
        const buttonGroupLeft = constructElement.buttonGroup(data.leftPanel)
        const buttonGroupCenter = constructElement.buttonGroup(data.centerPanel)
        const buttonGroupRight = constructElement.buttonGroup(data.rightPanel)
        const settingsElement = constructElement.settings()

        $elm = $(constructElement.panel(buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settingsElement))
        const $defaultPanel = $elm.find('.default-panel')
        const $settingsPanel = $elm.find('.settings-panel')
        const $panelName = $elm.find('.panel-name')

        $settingsPanel.find('.top-box').append(settingsList)

        $elm.find('#settings-button')
            .click(function ()
            {
                $defaultPanel.toggleClass('hidden')
                $settingsPanel.toggleClass('hidden')
                const $this = $(this)
                $this.toggleClass('back-to-default')
                if ($settingsPanel.hasClass('hidden'))
                {
                    if (INTERFACE === 'NI') $this.tip('Ustawienia')
                    else $this.attr('tip', 'Ustawienia')

                    $this.children().attr('src', FILE_PREFIX + 'res/img/panel/settings.png')
                    $panelName.text('Panel Nerthusa')
                }
                else
                {
                    if (INTERFACE === 'NI') $this.tip('Powrót')
                    else $this.attr('tip', 'Powrót')

                    $this.children().attr('src', FILE_PREFIX + 'res/img/panel/settings-back.png')
                    $panelName.text('Panel Nerthusa - ustawienia')
                }
            })
            .end()
            .find('.close-button, .cancel-button, .ok-button')
            .click(function ()
            {
                closePanel($elm)
            }).end()
            .find('.save-button')
            .click(function ()
            {
                saveSettings()
                closePanel($elm)
            }).end()
            .find('#light-manager-button')
            .click(function ()
            {
                initLightManager()
                closePanel($elm)
            }).end()

        $elm
            .css({
                visibility: hidden ? 'hidden' : 'visible',
                opacity: 0
            })
            .appendTo(ELEMENT_TO_ATTACH_TO)
            .css('opacity', hidden ? '0' : '1') // change opacity after appending to ELEMENT_TO_ATTACH_TO for nice animation
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

        if (INTERFACE === 'NI')
        {
            $('[tip]', $elm).each(function ()
            {
                const $this = $(this)
                $this.tip($this.attr('tip'))
            })
        }
    }
}

function preloadPanel()
{
    if (!$elm.parent || !$elm.parent(ELEMENT_TO_ATTACH_TO).length)
        $.getJSON(FILE_PREFIX + 'res/configs/panel-links.json', function (data)
        {
            createPanel(data, true)
        })
}

function togglePanel()
{
    if (!$elm.parent || !$elm.parent(ELEMENT_TO_ATTACH_TO).length)
        $.getJSON(FILE_PREFIX + 'res/configs/panel-links.json', createPanel)
    else if ($elm.css('visibility') === 'visible')
        $elm.css({visibility: 'hidden', opacity: '0'})
    else
        $elm.css({visibility: 'visible', opacity: '1'})
}

function saveSettings()
{
    $elm.find('.setting-checkbox').each(function () { saveSetting(this.name, this.checked)})
    message('Zapisano, odśwież stronę')
}


function create_button_ni()
{
    if (Engine.interfaceStart && Object.keys(Engine.interface.getDefaultWidgetSet()).includes('nerthus'))
    {
        let nerthusPos = defaultPosition

        const serverStoragePos = Engine.serverStorage.get(Engine.interface.getPathToHotWidgetVersion())
        if (serverStoragePos && serverStoragePos.nerthus) nerthusPos = serverStoragePos.nerthus

        Engine.interface.createOneWidget('nerthus', {nerthus: nerthusPos}, true, [])
    }
    else setTimeout(create_button_ni, 500)
}

export function addSettingToPanel(settingName, translation, tip, callback)
{
    const checked = settings[settingName] ? ' checked' : ''

    const $setting = $(`
<label class="setting-label">
    <span class="setting-label-text" tip="${tip}">${translation}</span>
    <input class="setting-checkbox" name="${settingName}" type="checkbox" ${checked}>
    <span class="checkbox-outline">
        <span class="checkmark">
        <div class="checkmark-stem"></div>
        <div class="checkmark-kick"></div>
    </span>
    </span>
</label>
`)
        .change(function (e) { saveSetting(settingName, e.target.checked) })
        .change(callback)

    settingsList.push($setting.get()[0]) // SI uses jquery 1.4, therefore we can't append array of jquery elements
}

export function initPanel()
{
    if (INTERFACE === 'NI')
    {
        const addNerthusToDefaultWidgetSet = function ()
        {
            Engine.interface.addKeyToDefaultWidgetSet(
                'nerthus',
                defaultPosition[0],
                defaultPosition[1],
                'Nerthus',
                'green',
                togglePanel
            )
        }

        $('head').append('<style>' +
            '.main-buttons-container .widget-button .icon.nerthus {' +
            'background-image: url(' + FILE_PREFIX + 'res/img/widget-icon.gif);' +
            'background-position: 0;' +
            '}' +
            '</style>'
        )
        const addWidgetButtons = Engine.interface.addWidgetButtons
        Engine.interface.addWidgetButtons = function (additionalBarHide)
        {
            addWidgetButtons.call(Engine.interface, additionalBarHide)
            addNerthusToDefaultWidgetSet()
            create_button_ni()

            // Only add Nerthus button once, then return to default function
            Engine.interface.addWidgetButtons = addWidgetButtons
        }

        // If interface was already initialised, add Nerthus button manually (as addWidgetButtons already ran)
        if (Engine.interfaceStart)
        {
            addNerthusToDefaultWidgetSet()
            create_button_ni()
        }
    }
    else
    {
        $(constructElement.icon())
            .hover(preloadPanel.bind(this))
            .click(togglePanel.bind(this))
            .appendTo('#panel')
    }
}
