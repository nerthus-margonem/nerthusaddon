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
    nerthus.addon.run = function()
    {
        $.getJSON("http://raw.githubusercontent.com/akrzyz/nerthusaddon/master/version.json", function(data)
        {
            nerthus.addon.setVersion(data.version)
            nerthus.addon.loadScripts()
            log("starting nerthus addon in version: " + nerthus.addon.version)
        });
    }
    nerthus.addon.loadScripts = function()
    {
        nerthus.code.load(['NN_dlaRadnych.js'],function(){
            nerthus.code.load(['NN_base.js'],function(){
                nerthus.code.load(nerthus.scripts, function(){log('Nerthus addon started')})
        })});
    }

    ScriptsLoader = function()
    {
        var loader = {}
        loader.to_load = 0
        loader.callback = null
        loader.load = function (files,callback)
        {
            this.callback = callback
            this.to_load += files.length
            var $this = this
            for(var i in files)
                $.getScript(nerthus.addon.fileUrl(files[i]), function(){$this.loaded()})
        }
        loader.loaded = function()
        {
            this.to_load--
            if(this.to_load === 0 && typeof this.callback === 'function')
                this.callback()
        }
        return loader
    }

    Parser = function()
    {
        var parser = {}
        parser.stringify = function(obj)
        {
            return JSON.stringify(obj, this.stringifyFunction)
        }
        parser.stringifyFunction = function(key,val)
        {
            if(typeof val === "function")
                return "("+ val.toString() +")"
            return val
        }
        parser.parse = function(obj)
        {
            return JSON.parse(obj, this.parseFunction)
        }
        parser.parseFunction = function(key,val)
        {
            if(typeof val === "string" && val.indexOf("function") === 1)
                return eval(val)
            return val
        }
        return parser
    }

    nerthus.code = ScriptsLoader()
    nerthus.addon.run()
}catch(e){log('NerthusStart Error: '+e.message,1)}
