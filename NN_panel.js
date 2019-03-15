/**
    Name: Nerthus Panel
    Plik zawiera funkcje do ustawiania tarczy otwierającej panel**/

nerthus.panel = {}

nerthus.panel.create_icon = function()
{
    return $('<img id="tarcza" src="'+nerthus.graf.shield+'" tip="Nerthus" data-tip="Nerthus">')
    .mouseover(function(){$(this).css('opacity','0.6')})
    .mouseout(function(){$(this).css('opacity','1')})
}

nerthus.panel.mAlert = null

nerthus.panel.mAlert_si = function(text, buttons)
{
    mAlert(text, buttons.length, buttons.map(button => button.callback))
}

nerthus.panel.mAlert_ni = function(text, buttons)
{
    mAlert(text, buttons)
}

nerthus.panel.display_panel = function ()
{
    $.getJSON(nerthus.addon.fileMasterUrl("panel_links.json"), function (panel_data)
    {
        let $panel = nerthus.panel.panel_string(panel_data)
        nerthus.panel.mAlert($panel, [{txt: "save", callback: nerthus.panel.save},
            {txt: "ok", callback: () => true}])
    })
}

nerthus.panel.panel_string = function(panel_data)
{
    var $panel = $("<div>")
    var $links = $("<div>").css('text-align','center')
    var $hello = $("<div>").append($("<b>").text("Witaj na Nerthusie, zapraszamy na ")
        .append(this.link(panel_data.forum)))
    var $info = $("<div>").text(panel_data.panel_info)
    $links.append($hello, $info)
    for(const i in panel_data.links)
        $links.append($('<div>').append(this.link(panel_data.links[i])))
    $panel.append($links)
    $panel.append(this.settings_str())
    return $panel
}

nerthus.panel.settings_str = function()
{
    let $settings = $("<div>")
    let info =
        "<span style='text-decoration: underline; cursor: pointer' class='nerthus-settings-button' " +
        "onclick='$(\".nerthus-settings-button\").nextAll().toggle()'>Ustawienia</span>"
    $settings.append(info)
    for(const option in nerthus.options)
    {
        let $cb = $("<input>",{'type':"checkbox", 'id':'panCb'+option, 'checked':nerthus.options[option]})
        let $cb_name = $("<b>").text(option)
        $settings.append($("<div>").append($cb).append($cb_name).hide())
    }
    return $settings
}//

nerthus.panel.settings_str_ni = function()
{
    let $settings = $("<div>")
    let info =
        "<span style='text-decoration: underline; cursor: url(../img/gui/cursor/5.png), auto' class='nerthus-settings-button' " +
        "onclick='$(\".nerthus-settings-button\").nextAll().toggle()'>Ustawienia</span>"
    $settings.append(info)
    for(const option in nerthus.options)
    {
        let $cb = $("<input>",{'type':"checkbox", 'id':'panCb'+option, 'checked':nerthus.options[option],'style': 'cursor: url(../img/gui/cursor/5.png), auto'})
        let $cb_name = $("<b>").text(option)
        $settings.append($("<div>").append($cb).append($cb_name).hide())
    }
    return $settings
}

nerthus.panel.settings_str_ni = function()
{
    let $settings = $("<div>")
    let info =
        "<span style='text-decoration: underline; cursor: url(../img/gui/cursor/5.png), auto' class='nerthus-settings-button' " +
        "onclick='$(\".nerthus-settings-button\").nextAll().toggle()'>Ustawienia</span>"
    $settings.append(info)
    for(const option in nerthus.options)
    {
        let $cb = $("<input>",{'type':"checkbox", 'id':'panCb'+option, 'checked':nerthus.options[option],'style': 'cursor: url(../img/gui/cursor/5.png), auto'})
        let $cb_name = $("<b>").text(option)
        $settings.append($("<div>").append($cb).append($cb_name).hide())
    }
    return $settings
}

nerthus.panel.link = function(link)
{
    return $('<a href="' + link.url + '" target="blank">' + link.name + '</a>')
}

nerthus.panel.save = function ()
{
    const options = nerthus.panel.get_settings()
    nerthus.storeSettings(options)
    message('Zapisano, wciśnij f5')
}

nerthus.panel.get_settings = function ()
{
    let options = {}
    for(const option in nerthus.options)
        options[option] = $('#panCb'+option).attr('checked')
    return options
}

nerthus.panel.get_settings_ni = function ()
{
    let options = {}
    for (const option in nerthus.options)
        options[option] = $("#panCb" + option).prop("checked")
    return options
}

nerthus.panel.get_settings_ni = function ()
{
    let options = {}
    for (const option in nerthus.options)
        options[option] = $("#panCb" + option).prop("checked")
    return options
}

nerthus.panel.create_button_ni = function ()
{
    if (Engine.interfaceStart)
    {
        let position = this.load_button_position()
        API.Storage.set("hotWidget/nerthus", position)
        Engine.interface.addKeyToDefaultWidgetSet("nerthus", position[0], position[1], "Nerthus", "green", this.display_panel.bind(this))
        Engine.interface.createOneWidget("nerthus", {nerthus: position}, true)
    }
    else
    {
        setTimeout(this.create_button_ni.bind(this), 500)
    }
}

nerthus.panel.load_button_position = function ()
{
    let position = API.Storage.get("hotWidget/nerthus")
    if (position)
        return position
    else
        return [6, "top-right"]

}

nerthus.panel.create_css_ni = function ()
{
    return "<style>" +
        ".main-buttons-container .widget-button .icon.nerthus {" +
        "background-image: url(" + nerthus.graf.shield + ");" +
        "background-position: 0;" +
        "}" +
        "</style>"
}

nerthus.panel.start = function()
{
    this.mAlert = this.mAlert_si

    nerthus.defer(function()
    {
        this.create_icon()
            .css({ position:"absolute", top:"0px", left:"242px", cursor:"pointer" })
            .click(this.display_panel.bind(this))
            .appendTo("#panel")
    }.bind(this))
}

nerthus.panel.start_ni = function ()
{
    this.settings_str = this.settings_str_ni
    this.get_settings = this.get_settings_ni
    this.mAlert = this.mAlert_ni
    $("head").append(this.create_css_ni())
    this.create_button_ni()
}

