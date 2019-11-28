/**
 Name: Nerthus Panel
 Plik zawiera funkcje do ustawiania tarczy otwierającej panel
 **/

nerthus.panel = {}
nerthus.panel.$elm = $()
nerthus.panel.defaultPosition = [6, 'top-right']
nerthus.panel.settings_translations = {
    'night': 'Pory dnia i nocy',
    'weather': 'Efekty pogodowe',
    'zodiac': 'Znaki zodiaku',
    'hideNpcs': 'Ukrywanie NPCów'
}

nerthus.panel.translate_option = function (name)
{
    if(nerthus.panel.settings_translations[name])
        return nerthus.panel.settings_translations[name]
    return name
}

/**
 * Contains functions that return strings that are representations of elements
 */
nerthus.panel.constructElement = {}

nerthus.panel.constructElement.button = function(data)
{
    return  (
        '<a href="' + data.url + '" target="_blank" class="button" tip="' + data.name + '">' +
            '<img src="' + nerthus.addon.fileUrl('img/panel/' + data.icon) + '" alt="' + data.name + '">' +
        '</a>'
    )
}

nerthus.panel.constructElement.buttonGroup = function (groupData)
{
    const buttonGroup = []
    const len = groupData.length
    for (let i = 0; i < len; i++)
        buttonGroup.push(this.button(groupData[i]))
    return buttonGroup.join('')
}

nerthus.panel.constructElement.settingCheckbox = function (optionName)
{
    const checked = nerthus.options[optionName] ? ' checked' : ''
    return (
        '<label class="setting-label">' +
            '<span class="setting-label-text">' + nerthus.panel.translate_option(optionName) + '</span>' +
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

nerthus.panel.constructElement.settings = function (options)
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

nerthus.panel.constructElement.panel = function (buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settings)
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
                '<button class="close-button"></button>' +
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
                '<button class="button nerthus-settings-button" tip="Ustawienia">' +
                    '<img src="' + nerthus.addon.fileUrl('img/panel/settings.png') + '" alt="Ustawienia">' +
                '</button>' +
            '</div>' +
        '</div>'
    )
}

nerthus.panel.constructElement.icon = function ()
{
    return '<img id="nerthus-shield" src="' + nerthus.graf.shield + '" tip="Nerthus">'
}

nerthus.panel.createPanel = function (data, hidden)
{
    const buttonGroupLeft = this.constructElement.buttonGroup(data.leftPanel)
    const buttonGroupCenter = this.constructElement.buttonGroup(data.centerPanel)
    const buttonGroupRight = this.constructElement.buttonGroup(data.rightPanel)
    const settings = this.constructElement.settings(nerthus.options)

    this.$elm = $(this.constructElement.panel(buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settings))
    const defaultPanel = this.$elm.find('.default-panel')
    const settingsPanel = this.$elm.find('.settings-panel')
    const panelName = this.$elm.find('.panel-name')
    this.$elm.find('.nerthus-settings-button')
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
                    .children().attr('src', nerthus.addon.fileUrl('img/panel/settings.png'))
                panelName.text('Panel Nerthusa')
            }
            else
            {
                $this.attr({'tip': 'Powrót', 'data-tip': 'Powrót'})
                    .children().attr('src', nerthus.addon.fileUrl('img/panel/settings-back.png'))
                panelName.text('Panel Nerthusa - ustawienia')
            }
        })
        .end()
        .find('.close-button, .cancel-button, .ok-button').click(function () { nerthus.panel.$elm.remove() }).end()
        .find('.save-button').click(function () {
            nerthus.panel.saveSettings()
            nerthus.panel.$elm.remove()
        }).end()

    this.$elm
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

nerthus.panel.preloadPanel = function ()
{
    if (!this.$elm.parent('body').length)
        $.getJSON(nerthus.addon.fileMasterUrl('panel_links.json'), function (data)
        {
            nerthus.panel.createPanel.bind(nerthus.panel, data, true)()
        })
}

nerthus.panel.showPanel = function ()
{
    if (!this.$elm.parent('body').length)
        $.getJSON(nerthus.addon.fileMasterUrl('panel_links.json'), function (data)
        {
            nerthus.panel.createPanel.bind(nerthus.panel, data, false)()
        })
    else
        this.$elm.css({visibility: 'visible', opacity: '1'})
}

nerthus.panel.saveSettings = function ()
{
    const newOptions = {}
    nerthus.panel.$elm.find('.setting-checkbox').each(function () { newOptions[this.name] = this.checked })
    nerthus.storeSettings(newOptions)
    message('Zapisano, odśwież stronę')
}


nerthus.panel.create_button_ni = function ()
{
    if (Engine.interfaceStart)
    {
        const position = this.load_button_position()
        Engine.interface.saveHotWidgetToStorage('nerthus', position[0], position[1])
        Engine.interface.createOneWidget('nerthus', {nerthus: position}, true)
    }
    else setTimeout(this.create_button_ni.bind(this), 500)
}

nerthus.panel.load_button_position = function ()
{
    const position = API.Storage.get('hotWidget/' + Engine.interface.getPathToHotWidgetVersion(true)).nerthus
    if (position)
        return position
    else
        return this.defaultPosition
}

nerthus.panel.create_css_ni = function ()
{
    return '<style>' +
        '.main-buttons-container .widget-button .icon.nerthus {' +
        'background-image: url(' + nerthus.graf.shield + ');' +
        'background-position: 0;' +
        '}' +
        '</style>'
}

nerthus.panel.start = function ()
{
    nerthus.defer(function ()
    {
        $(this.constructElement.icon())
            .hover(this.preloadPanel.bind(this))
            .click(this.showPanel.bind(this))
            .appendTo('#panel')
    }.bind(this))
}

nerthus.panel.start_ni = function ()
{
    $('head').append(this.create_css_ni())
    this.create_button_ni()

    const initDefaultWidgetSet = Engine.interface.initDefaultWidgetSet
    Engine.interface.initDefaultWidgetSet = function ()
    {
        initDefaultWidgetSet()
        Engine.interface.addKeyToDefaultWidgetSet(
            'nerthus',
            nerthus.panel.defaultPosition[0],
            nerthus.panel.defaultPosition[1],
            'Nerthus',
            'green',
            nerthus.panel.showPanel.bind(nerthus.panel)
        )
    }
}
