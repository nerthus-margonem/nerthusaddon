/**
    Name: Nerthus Panel
    Plik zawiera funkcje do ustawiania tarczy otwierającej panel
**/
try{

nerthus.panel = {}

nerthus.panel.display_icon = function(icon_data)
{
    $('<img id="tarcza" src="'+nerthus.graf.shield+'" tip="Nerthus" data-tip="Nerthus">')
    .css(icon_data.css)
    .click(icon_data.callback)
    .mouseover(function(){$(this).css('opacity','0.6')})
    .mouseout(function(){$(this).css('opacity','1')})
    .appendTo(icon_data.parent)
}

nerthus.panel.mAlert = null

nerthus.panel.mAlert_si = function(text, button_handlers)
{
    mAlert(text, button_handlers.length, button_handlers.map(handler => handler.callback))
}

nerthus.panel.mAlert_ni = function(text, handlers)
{
    mAlert(text, handlers)
}

nerthus.panel.display_panel = function()
{
    $.getJSON(nerthus.addon.fileMasterUrl('panel_links.json'), function(panel_data)
    {
        var $panel = this.panel_string(panel_data)
        this.mAlert($panel, [ {txt:"save", callback: this.save.bind(this)},
                              {txt:"ok",   callback: () => true} ])
    }.bind(this))
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

nerthus.panel.save = function()
{
    var settings = this.get_settings()
    nerthus.storeSettings(settings)
    message('zapisano, wciśnij f5')
    return true
}

nerthus.panel.get_settings = function()
{
    var options = {}
    for(var option in nerthus.options)
        options[option] = $('#panCb'+option).attr('checked')
    return options
}

nerthus.panel.start = function()
{
    this.mAlert = this.mAlert_si
    let icon_data = { parent: "#panel",
                      css: { position:"absolute",
                             top:"0px",
                             left:"242px",
                             cursor:"pointer" },
                      callback : this.display_panel.bind(this) }
    nerthus.defer(this.display_icon.bind(this, icon_data))
}

nerthus.panel.start_ni = function()
{
    this.mAlert = this.mAlert_ni
    let icon_data = { parent: "#character_wrapper",
                      css: { position:"absolute",
                             top:"17px",
                             left:"17px",
                             cursor:"pointer" },
                      callback : this.display_panel.bind(this) }
    this.display_icon(icon_data)
}

}catch(e){log('NerthusPanel Error: '+e.message,1);}
