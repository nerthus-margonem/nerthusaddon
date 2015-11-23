/**
	Start dodatku. Najpierw pobiera wersje dodatku, która jest rewizją z mastera, potem resztę plików dodatku w tej wersji.
    Wersia jest w pliku version.json
    Jeżeli jest zdefiniowana zmienna NerthusAddonDebug odpala debug moda i ciągnie świeże pliki bezpośrednio z master z pominięciem cdn
**/
try{
    nerthus = {}
    nerthus.addon = {}
    nerthus.addon.version = "master";
    nerthus.addon.filesPrefix = 'http://cdn.rawgit.com/akrzyz/nerthusaddon'
    nerthus.addon.setVersion = function(version)
    {
        this.version = version
        if(typeof NerthusAddonDebug != 'undefined')
        {   //debug version for development
            log("nerthus addon in debug mode")
            this.filesPrefix = 'http://rawgit.com/akrzyz/nerthusaddon'
            this.version = 'master'
        }
    }
    nerthus.addon.fileUrl = function(filename)
    {
        return this.filesPrefix + "/" + this.version + "/" + filename;
    }
    nerthus.addon.start = function()
    {
        $.getJSON("http://raw.githubusercontent.com/akrzyz/nerthusaddon/master/version.json", function(data)
        {
            log("starting nerthus addon in version: " + data.version)
            nerthus.addon.setVersion(data.version)
            nerthus.addon.loadScripts()
        });
    }
    nerthus.addon.loadScripts = function()
    {
        $.getScript(nerthus.addon.fileUrl('NN_dlaRadnych.js'),function(){
        $.getScript(nerthus.addon.fileUrl('NN_base.js'),function(){
        //ładowanie dodatkowych skryptów jeżeli jakieś są
        for(var i in nerthus.scripts)
            $.getScript(nerthus.addon.fileUrl(nerthus.scripts[i]))
        log('Nerthus addon started');
        })});
    }
    nerthus.addon.start()
}catch(e){log('NerthusStart Error: '+e.message,1)}
