/**
    Name: Nerthus Panel
    Plik zawiera funkcje do ustawiania tarczy otierającej panel
**/
try{

nerthus.panel = {}

nerthus.panel.display_icon = function()
{
    $('<img id="tarcza" src="'+nerthus.graf.shield+'" tip="Nerthus">').appendTo('#panel')
    .css({position:"absolute",top:"0px",left:"242px",cursor:"pointer"})
    .click(function(){nerthus.panel.display_panel()})
    .mouseover(function(){$(this).css('opacity','0.6')})
    .mouseout(function(){$(this).css('opacity','1')});
}

nerthus.panel.display_panel = function()
{
    $.getJSON("http://raw.githubusercontent.com/akrzyz/nerthusaddon/master/panel_links.json", function(panel_data)
    {
        var panel_str = nerthus.panel.panel_string(panel_data)
        mAlert(panel_str, 2, [function(){nerthus.panel.save()}])
    })
}

nerthus.panel.panel_string = function(panel_data)
{
    var str = $("<center>")
    .append($("<div>").append($("<b>").text("Witaj na Nerthusie, zapraszamy na ").append(this.link(panel_data.forum))))
    .append($("<div>").text(panel_data.panel_info))
    for(var i in panel_data.links)
        str.append($('<div>').append(this.link(panel_data.links[i])))
    str.add(this.settings_str())
    return str
}

nerthus.panel.settings_str = function()
{
    var settings = $('<u id="n_pan_settings" style="cursor:pointer">')
    .text("ustawienia")
    .click(function(){$(this).children().toggle()})
    for(var option in nerthus.options)
        settings.append($("<div>").append($('<input type="checkbox" id="panCb' + option + '"').attr('checked',nerthus.options[option])))
    return settings
}

nerthus.panel.link = function(link)
{
    return $('<a href="' + link.url + '" target="blank">' + link.name + '</a>')
}

nerthus.panel.save = function()
{
    var settings = nerthus.panel.get_settings()
    nerthus.storeSettings(settings)
    message('zapisano, wciśnij f5')
}

nerthus.panel.get_settings = function()
{
    var options = {}
    for(var option in nerthus.options)
        options[option] = $('#panCb'+option).attr('checked')
    return options
}

g.loadQueue.push({fun:nerthus.panel.display_icon, data:""});

}catch(e){log('NerthusPanel Error: '+e.message,1);}
