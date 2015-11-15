/**
	Start dodatku. Najpierw pobiera wersje dodatku, która jest rewizją z mastera, potem resztę plików dodatku w tej wersji.
    Wersia jest w pliku version.json
    Jeżeli jest zdefiniowana zmienna NerthusAddonDebug odpala debug moda i ciągnie świeże pliki bezpośrednio z master z pominięciem cdn
**/
try{
    nerthusAddon = {}
    nerthusAddon.version = "master";
    nerthusAddon.filesPrefix = 'http://cdn.rawgit.com/akrzyz/nerthusaddon'
    nerthusAddon.setVersion = function(version)
    {
        this.version = version
        if(typeof NerthusAddonDebug != 'undefined')
        {   //debug version for development
            log("nerthus addon in debug mode")
            this.filesPrefix = 'http://rawgit.com/akrzyz/nerthusaddon'
            this.version = 'master'
        }
    }
    nerthusAddon.fileUrl = function(filename)
    {
        return this.filesPrefix + "/" + this.version + "/" + filename;
    }
    nerthusAddon.start = function()
    {
        $.getJSON("http://raw.githubusercontent.com/akrzyz/nerthusaddon/master/version.json", function(data)
        {
            log("starting nerthus addon in version: " + data.version)
            nerthusAddon.setVersion(data.version)
            nerthusAddon.loadScripts()
        });
    }
    nerthusAddon.loadScripts = function()
    {
        $.getScript(nerthusAddon.fileUrl('NN_base.js'),function(){
        $.getScript(nerthusAddon.fileUrl('NN_dlaRadnych.js'),function(){
        //ładowanie dodatkowych skryptów jeżeli jakieś są
        for( i in nerthus.additionaScripts)
            $.getScript(nerthusAddon.fileUrl(nerthus.additionaScripts[i]));
        //ładowanie rzeczy zależnych od gry
        g.loadQueue.push({fun:nerthusAddon.loasGameDependentScripts,data:""});
        })});
    }
    nerthusAddon.loasGameDependentScripts = function()
    {
        try
        {
            nerthus.setChatInfo();
            nerthus.setEnterMsg();
            $.getScript(nerthusAddon.fileUrl('NN_panel.js'));
            $.getScript(nerthusAddon.fileUrl('NN_maps.js'));
            if( nerthus.Settings[0]*1) {$.getScript(nerthusAddon.fileUrl('NN_night.js'));}
            if( nerthus.Settings[3]*1) {$.getScript(nerthusAddon.fileUrl('NN_pogoda.js'));}
            log('NerthusAddon start: ok');
        }catch(e)
        {
            log('NN_Start Error: '+e.message,1);
        }
    }
    nerthusAddon.start()
}catch(e){log('NerthusStart Error: '+e.message,1)}
