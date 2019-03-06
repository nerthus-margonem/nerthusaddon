/**
    Name: Nerthus Panel
    Plik zawiera funkcje do ustawiania tarczy otwierającej panel
**/
try{

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
    for(var i in panel_data.links)
        $links.append($('<div>').append(this.link(panel_data.links[i])))
    $panel.append($links)
    $panel.append(this.settings_str())
    return $panel
}

nerthus.panel.settings_str = function()
{
    var $settings = $("<div>")
    var $info = $("<div>")
    .css('text-decoration', 'underline')
    .css('cursor','pointer')
    .text("ustawienia")
    .click(function(){$(this).nextAll().toggle()})
    $settings.append($info)
    for(var option in nerthus.options)
    {
        var $cb = $("<input>",{'type':"checkbox", 'id':'panCb'+option, 'checked':nerthus.options[option]})
        var $cb_name = $("<b>").text(option)
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
    let settings = nerthus.panel.get_settings()
    nerthus.storeSettings(settings)
    message("Zapisano, wciśnij F5")
    return true
}

nerthus.panel.get_settings = function ()
{
    let options = {}
    for (const option in nerthus.options)
        options[option] = $("#panCb" + option).attr("checked")
    return options
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

nerthus.panel.create_button_ni = function ()
{
    if (Engine.interfaceStart)
    {
        API.Storage.set("hotWidget/nerthus", [7, "top-right"])
        Engine.interface.addKeyToDefaultWidgetSet("nerthus", 7, "top-right", "Nerthus", "green", nerthus.panel.display_panel)
        Engine.interface.createOneWidget("nerthus", {nerthus: [7, "top-right"]}, true)
    }
    else
    {
        setTimeout(nerthus.panel.create_button_ni, 500)
    }
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

nerthus.panel.start_ni = function ()
{
    this.mAlert = this.mAlert_ni
    $("head").append(this.create_css_ni())
    this.create_button_ni()
}

}catch(e){log('NerthusPanel Error: '+e.message,1);}
