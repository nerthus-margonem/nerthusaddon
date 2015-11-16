/**
    Name: Nerthus Panel
    Plik zawiera funkcje do ustawiania tarczy otierającej panel
**/
try{

nerthus.panel = {}

nerthus.panel.display_icon = function()
{
    $('<img id="tarcza" src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif" tip="Nerthus">').appendTo('#panel')
    .css({position:"absolute",top:"0px",left:"242px",cursor:"pointer"})
    .click(function(){nerthus.panel.display_panel()})
    .mouseover(function(){$(this).css('opacity','0.6')})
    .mouseout(function(){$(this).css('opacity','1')});
}

nerthus.panel.display_panel = function()
{
    var panel_str = this.panel_string()
    mAlert(panel_str, 2, [function(){nerthus.panel.save()}])
    $('#n_pan_settings').click(function(){$("#n_pan_settings_str").toggle()})
}

nerthus.panel.save = function()
{
    var settings = nerthus.panel.get_settings()
    nerthus.storeSettings(settings)
	message('zapisano, wciśnij f5')
}

nerthus.panel.panel_string = function()
{
    return '<center><b style="color: red">' +
        nerthus.panelMessage + '</b><br><br>' +
        nerthus.panelStr + '</center><br>' +
        this.settings_str()
}

nerthus.panel.settings_str = function()
{
    var options = this.settings_as_str_array()
    return '<u id="n_pan_settings" style="cursor:pointer">ustawienia</u>\
<div id="n_pan_settings_str" style="display:none;">\
<input type="checkbox" id="panCbNoc" '+options[0]+'/>Noc<br>\
<input type="checkbox" id="panCbPog" '+options[3]+'/>Pogoda<br>\
<a href="http://www.margonem.pl/?task=forum&show=posts&id=264553" target="blank">pomoc</a></div>';
}

nerthus.panel.settings_as_str_array = function()
{
    var options = [];
    for(i = 0; i < 6; i++)
    {
        if(nerthus.Settings[i]*1)
            options[i]='checked'
        else
            options[i]=''
    }
    return options;
}

nerthus.panel.get_settings = function()
{
    var settings = ''
    settings+= this.get_is_checker('#panCbNoc')
    settings+='0'; //nocnce mapy do wywalenia
    settings+='0';	//muzyka do wywalenia	
    settings+= this.get_is_checker('#panCbPog')
    settings+='0'; //z dysku do wywalenia
    settings+='0'; //większy chat do wywalenia
    return settings
}

nerthus.panel.get_is_checker = function(selector)
{
    if($(selector).attr('checked'))
        return '1'
    else 
        return '0'
}

nerthus.panel.display_icon();

}catch(e){log('NerthusPanel Error: '+e.message,1);}
