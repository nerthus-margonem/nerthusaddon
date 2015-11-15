/**
	Start dodatku. Najpierw pobiera wersje dodatku, która jest rewizją z mastera (hashem), potem resztę plików dodatku w tej wersji.
    Wersia jest w pliku version.json
**/
try{
    nerthusAddon = {}
    nerthusAddon.version = "master";
    nerthusAddon.fileUrl = function(filename)
    {
        return 'http://rawgit.com/akrzyz/nerthusaddon/' + this.version + "/" + filename;
    }
    nerthusAddon.start = function()
    {
        $.getJSON("http://raw.githubusercontent.com/akrzyz/nerthusaddon/master/version.json", function(data)
        {
            nerthusAddon.version = data.version
            log("starting nerthus addon in version: " + nerthusAddon.version)

            var NN_start = function()
            { 
                try
                {		
                    nerthus.loadSettings();
                    nerthus.grafiki();
                    nerthus.setChatInfo();
                    nerthus.setEnterMsg();
                    $.getScript(nerthusAddon.fileUrl('NN_panel.js'));
                    $.getScript(nerthusAddon.fileUrl('NN_maps.js'),function(){
                    if( nerthus.Settings[0]*1) {$.getScript(nerthusAddon.fileUrl('NN_night.js'));}
                    nerthus.maps.seasonMaps();
                    if( nerthus.Settings[3]*1) {$.getScript(nerthusAddon.fileUrl('NN_pogoda.js'));}
                    })
                    log('NerthusAddon start: ok');
                }catch(e)
                {
                    log('NN_Start Error: '+e.message,1);
                }
            }
            $.getScript(nerthusAddon.fileUrl('NN_base.js'),function(){
            $.getScript(nerthusAddon.fileUrl('NN_dlaRadnych.js'),function(){
            g.loadQueue.push({fun:NN_start,data:""});
            //ładowanie dodatkowych skryptów jeżeli jakieś są
            for( i in nerthus.additionaScripts)
                $.getScript(nerthus.additionaScripts[i]);		
            $.getScript(nerthusAddon.fileUrl('NN_NightLights.js'));
            })});
        });
    }
    nerthusAddon.start()
}catch(e){log('NerthusStart Error: '+e.message,1)}	
