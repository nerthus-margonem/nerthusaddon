/**
	Name: NerthusStart
	Start dodatku!!
    http://addons2.margonem.pl/get/17/17447dev.js
**/
try{

	NN_start = function(){ 
		try{		
			nerthus.loadSettings();
			nerthus.grafiki();
			nerthus.setChatInfo();
			nerthus.setEnterMsg();
			$.getScript('http://bitbucket.org/nerthus/nerthusaddon/raw/master/NN_panel.js');
			$.getScript('http://bitbucket.org/nerthus/nerthusaddon/raw/master/NN_maps.js',function(){
			if( nerthus.Settings[0]*1) {$.getScript('http://bitbucket.org/nerthus/nerthusaddon/raw/master/NN_night.js');}
			nerthus.maps.seasonMaps();
			if( nerthus.Settings[3]*1) {$.getScript('http://bitbucket.org/nerthus/nerthusaddon/raw/master/NN_pogoda.js');}
			})
			log('NerthusAddon start: ok');
        }catch(e){log('NN_Start Error: '+e.message,1);}
	}
	$.getScript('http://bitbucket.org/nerthus/nerthusaddon/raw/master/NN_base.js',function(){
    $.getScript('http://bitbucket.org/nerthus/nerthusaddon/raw/master/NN_dlaRadnych.js',function(){
	g.loadQueue.push({fun:NN_start,data:""});
	//ładowanie dodatkowych skryptów jeżeli jakieś są
	for( i in nerthus.additionaScripts)
		$.getScript(nerthus.additionaScripts[i]);		
    $.getScript('http://bitbucket.org/nerthus/nerthusaddon/raw/master/NN_NightLights.js');
	
	})});
}catch(e){log('NerthusStart Error: '+e.message,1)}	
