/**
	Name: Nerthus Panel
	Plik zawiera funkcje do ustawiania tarczy otierającej panel
**/
try{
	nerthus.setPanel = function()
	{

		//ustawienia w panelu - Tego nie ruszać bo ugryze!
		var a=new Array();
		for(i=0;i<6;i++)
		{
			if(nerthus.Settings[i]*1){a[i]='checked';}
			else{a[i]='';}	
		}
		//tekst ustawień
		var panelSettingsStr = '<u id="panUst" style="cursor:pointer">ustawienia</u><div id="panSettings" style="display:none;"><input type="checkbox" id="panCbNoc" '+a[0]+'/>Noc<br><input type="checkbox" id="panCbPog" '+a[3]+'/>Pogoda<br><a href="http://www.margonem.pl/?task=forum&show=posts&id=264553" target="blank">pomoc</a></div>';
		//zawartość panelu i okienko
        var mes='<center><b style="color: red">'+nerthus.panelMessage+'</b><br><br>'+nerthus.panelStr+'</center><br>'+panelSettingsStr;
		mAlert(mes,2,[function(){nerthus.saveDateAndSettings();},function(){nerthus.saveDate()}]);
		$('#panUst').click(function(){$('#panSettings').toggle()});
	}

	nerthus.setTarcza = function()
	{
		//nowości - tarcza skacze albo nie;
		if(nerthus.czasZmian() < nerthus.LastVisitTime)
		{
			//tarcza zwykła
			$('<img id="tarcza" src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif" tip="Nerthus">').appendTo('#panel')
			.css({position:"absolute",top:"0px",left:"242px",cursor:"pointer"})
			.click(function(){nerthus.setPanel()})
			.mouseover(function(){$(this).css('opacity','0.6')})
			.mouseout(function(){$(this).css('opacity','1')});
		}
		else
		{
			//tarcza skaczonca
			$('<img id="tarcza" src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_2.gif" tip="Sprawdź nowości na Nerthusie">').appendTo('#panel')
			.css({position:"absolute",top:"0px",left:"242px",cursor:"pointer"})
			.click(function(){nerthus.setPanel()})
			.mouseover(function(){$(this).css('opacity','0.6')})
			.mouseout(function(){$(this).css('opacity','1')});
		}
		
	}	
	nerthus.setTarcza();
}catch(e){log('NerthusPanel Error: '+e.description,1);}
