import {saveSetting, settings} from '../settings'

let $elm = $()
const defaultPosition = [6, 'top-right']

const settingsTranslations = {
    'night': 'Pory dnia i nocy',
    'weather': 'Efekty pogodowe',
    'zodiac': 'Znaki zodiaku',
    'hideNpcs': 'Ukrywanie NPCów'
}

function translate_option(name)
{
    if (settingsTranslations[name])
        return settingsTranslations[name]
    return name
}

/**
 * Contains functions that return strings that are representations of elements
 */
const constructElement = {}

constructElement.button = function (data)
{
    return (
        '<a href="' + data.url + '" target="_blank" class="button" tip="' + data.name + '" data-tip="' + data.name + '">' +
        '<img src="' + FILE_PREFIX + 'img/panel/' + data.icon + '" alt="' + data.name + '">' +
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

constructElement.settingCheckbox = function (optionName)
{
    const checked = settings[optionName] ? ' checked' : ''
    return (
        '<label class="setting-label">' +
        '<span class="setting-label-text">' + translate_option(optionName) + '</span>' +
        '<input class="setting-checkbox" name="' + optionName + '" type="checkbox"' + checked + '>' +
        '<span class="checkbox-outline">' +
        '<span class="checkmark">' +
        '<div class="checkmark-stem"></div>' +
        '<div class="checkmark-kick"></div>' +
        '</span>' +
        '</span>' +
        '</label>'
    )
}

constructElement.settings = function (options)
{
    const settingsList = []
    for (const option in options)
        settingsList.push(this.settingCheckbox(option))
    const settings = settingsList.join('')

    return (
        '<div class="top-box">' +
        settings +
        '</div>' +
        '<div class="bottom-box">' +
        '<button class="button text-button save-button">Zapisz</button>' +
        '<button class="button text-button cancel-button">Anuluj</button>' +
        '</div>'
    )
}

constructElement.panel = function (buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settings)
{
    return (
        '<div id="nerthus-panel">' +
        '<div class="header-label-positioner">' +
        '<div class="header-label">' +
        '<div class="left-decor"></div>' +
        '<div class="right-decor"></div>' +
        '<span class="panel-name">Panel Nerthusa</span>' +
        '</div>' +
        '</div>' +
        '<div class="close-decor">' +
        '<button class="close-button" />' +
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
        '<button class="button nerthus-settings-button" tip="Ustawienia" data-tip="Ustawienia">' +
        '<img src="' + FILE_PREFIX + 'img/panel/settings.png' + '" alt="Ustawienia">' +
        '</button>' +
        '</div>' +
        '</div>'
    )
}

constructElement.icon = function ()
{
    return '<img id="nerthus-shield" src="' + FILE_PREFIX + 'img/nerthus_icon.gif' + '" tip="Nerthus" alt="Nerthus panel">'
}

function createPanel(data, hidden)
{
    if (!$elm.parent || !$elm.parent('body').length)
    {
        const buttonGroupLeft = constructElement.buttonGroup(data.leftPanel)
        const buttonGroupCenter = constructElement.buttonGroup(data.centerPanel)
        const buttonGroupRight = constructElement.buttonGroup(data.rightPanel)
        const settingsElement = constructElement.settings(settings)

        $elm = $(constructElement.panel(buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settingsElement))
        const defaultPanel = $elm.find('.default-panel')
        const settingsPanel = $elm.find('.settings-panel')
        const panelName = $elm.find('.panel-name')
        $elm.find('.nerthus-settings-button')
            .click(function ()
            {
                defaultPanel.toggleClass('hidden')
                settingsPanel.toggleClass('hidden')
                const tip = settingsPanel.hasClass('hidden') ? 'Ustawienia' : 'Powrót'
                const $this = $(this)
                $this.toggleClass('back-to-default')
                if (settingsPanel.hasClass('hidden'))
                {
                    $this.attr({'tip': 'Ustawienia', 'data-tip': 'Ustawienia'})
                        .children().attr('src', FILE_PREFIX +'img/panel/settings.png')
                    panelName.text('Panel Nerthusa')
                }
                else
                {
                    $this.attr({'tip': 'Powrót', 'data-tip': 'Powrót'})
                        .children().attr('src', FILE_PREFIX +'img/panel/settings-back.png')
                    panelName.text('Panel Nerthusa - ustawienia')
                }
            })
            .end()
            .find('.close-button, .cancel-button, .ok-button').click(function ()
        {
            $elm.css({visibility: 'hidden', opacity: '0'}) // reset opacity as we're still holding reference
            defaultPanel.removeClass('hidden')
            settingsPanel.addClass('hidden')
        }).end()
            .find('.save-button').click(function ()
        {
            saveSettings()
            $elm.css({visibility: 'hidden', opacity: '0'}) // reset opacity as we're still holding reference
            defaultPanel.removeClass('hidden')
            settingsPanel.addClass('hidden')
        }).end()

        $elm
            .css({
                visibility: hidden ? 'hidden' : 'visible',
                opacity: 0
            })
            .appendTo('body')
            .css('opacity', hidden ? '0' : '1') // change opacity after appending to body for nice animation
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

function preloadPanel()
{
    if (!$elm.parent || !$elm.parent('body').length)
        $.getJSON(FILE_PREFIX + 'panel_links.json', function (data)
        {
            createPanel(data, true)
        })
}

function togglePanel()
{
    if (!$elm.parent || !$elm.parent('body').length)
        $.getJSON(FILE_PREFIX + 'panel_links.json', createPanel)
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
    else setTimeout(create_button_ni.bind(this), 500)
}

export function initPanel()
{
    if (INTERFACE === 'NI')
    {
        function addNerthusToDefaultWidgetSet()
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
            'background-image: url(' + '' + ');' + //TODO shield graphic
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
