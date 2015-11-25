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
    var panel = $("<div>")
    var center = $("<center>")
    .append($("<div>").append($("<b>").text("Witaj na Nerthusie, zapraszamy na ").append(this.link(panel_data.forum))))
    .append($("<div>").text(panel_data.panel_info))
    for(var i in panel_data.links)
        center.append($('<div>').append(this.link(panel_data.links[i])))
    panel.append(center)
    panel.append(this.settings_str())
    return panel
}

nerthus.panel.settings_str = function()
{
    var wrapper = $("<div>")
    var settings = $('<u style="cursor:pointer">')
    .text("ustawienia")
    .click(function(){$(this).nextAll().toggle()})
    wrapper.append(settings)
    for(var option in nerthus.options)
    {
        var cb = $("<input>",{'type':"checkbox", 'id':'panCb'+option, 'checked':nerthus.options[option]})
        var cb_name = $("<b>").text(option)
        wrapper.append($("<div>").append(cb).append(cb_name))
    }
    return wrapper
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
