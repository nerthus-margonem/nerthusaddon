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
    nerthus.addon.fileUrl = function(filename)
    {
        return this.filesPrefix + "/" + this.version + "/" + filename;
    }
    nerthus.addon.runInDebugMode = function()
    {
        log("nerthus addon in debug mode")
        this.filesPrefix = 'http://rawgit.com/akrzyz/nerthusaddon'
        this.version = "master"
        this.loadScripts(function(){log('Nerthus addon started')})
    }
    nerthus.addon.getVersion = function(callback)
    {
        $.getJSON("http://raw.githubusercontent.com/akrzyz/nerthusaddon/master/version.json", function(data){callback(data.version)})
    }
    nerthus.addon.run = function()
    {
        if(typeof NerthusAddonDebug != 'undefined')
            return this.runInDebugMode()
        this.getVersion(function(version)
        {
            nerthus.addon.version = version
            nerthus.addon.loadScripts(function(){log('Nerthus addon started')})
            log("starting nerthus addon in version: " + nerthus.addon.version)
        });
    }
    nerthus.addon.loadScripts = function(callback)
    {
        nerthus.code.load(['NN_dlaRadnych.js'],function(){
            nerthus.code.load(['NN_base.js'],function(){
                nerthus.code.load(nerthus.scripts, callback)
        })});
    }

    nerthus.addon.load = function()
    {
        if(typeof localStorage !== 'undefined')
        {
            if(localStorage.nerthus)
            {
                log("load nerthus addon from local storage")
                nerthus = Parser().parse(localStorage.nerthus)
                for(var i in nerthus)
                    if(typeof nerthus[i] === 'object' && typeof nerthus[i].start === 'function')
                        nerthus[i].start()
                this.getVersion(function(version)
                {
                    if(version != nerthus.addon.version)
                    {
                        log("nerthus addon has not actual version")
                        delete localStorage.nerthus
                    }
                    log("Nerthus addon started")
                })
            }
            else
            {
                log("load nerthus addon from github and store")
                this.getVersion(function(version)
                {
                    nerthus.addon.setVersion(version)
                    log("starting nerthus addon in version: " + nerthus.addon.version)
                    nerthus.addon.loadScripts(function()
                    {
                        log('Nerthus addon started')
                        localStorage.nerthus = Parser().stringify(nerthus)
                    })
                })
            }
        }
        else
        {
            log("load nerthus addon from github")
            this.run()
        }
    }

    GitHubLoader = function()
    {
        var loader = {}
        loader.load = function()
        {
            nerthus.addon.getVersion(function(version)
            {
                nerthus.addon.setVersion(version)
                this.loadScripts(function(){log('Nerthus addon started')})
                log("starting nerthus addon in version: " + nerthus.addon.version)
            });
        }
        loader.scripts = ScriptsLoader()
        loader.loadScripts = function(callback)
        {
            scripts.load(['NN_dlaRadnych.js'],function(){
                scripts.load(['NN_base.js'],function(){
                    scripts.load(nerthus.scripts, callback)
            })});
        }
    }

    StorageLoader = function()
    {
        var loader = {}
        loader.load = function() 
        {
            nerthus = Parser().parse(localStorage.nerthus)
            this.__checkVersion()
            this.__run()

        }
        loader.__run = function() 
        {
            for(var i in nerthus)
                if(typeof nerthus[i] === 'object' && typeof nerthus[i].start === 'function')
                    nerthus[i].start()
        }
        loader.__checkVersion = function()
        {
            nerthus.addon.getVersion(function(version)
            {
                if(version != nerthus.addon.version)
                {
                    log("nerthus addon has not actual version")
                    delete localStorage.nerthus
                }
                log("Nerthus addon started")
            })
        }
        loader.store = function()
        {
            localStorage.nerthus = Parser().stringify(nerthus)
        }
    }

    ScriptsLoader = function()
    {
        var loader = {}
        loader.__to_load = 0
        loader.__callback = null
        loader.load = function (files,callback)
        {
            this.__callback = callback
            this.__to_load += files.length
            var $this = this
            for(var i in files)
                $.getScript(nerthus.addon.fileUrl(files[i]), function(){$this.__loaded()})
        }
        loader.__loaded = function()
        {
            this.__to_load--
            if(this.__to_load === 0 && typeof this.__callback === 'function')
                this.__callback()
        }
        return loader
    }

    Parser = function()
    {
        var parser = {}
        parser.stringify = function(obj)
        {
            return JSON.stringify(obj, this.__stringifyFunction)
        }
        parser.__stringifyFunction = function(key,val)
        {
            if(typeof val === "function")
                return "("+ val.toString() +")"
            return val
        }
        parser.parse = function(obj)
        {
            return JSON.parse(obj, this.__parseFunction)
        }
        parser.__parseFunction = function(key,val)
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
