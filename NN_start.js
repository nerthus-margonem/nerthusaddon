/**
    Start dodatku. Najpierw pobiera wersje dodatku, która jest rewizją z mastera, potem resztę plików dodatku w tej wersji.
    Wersia jest w pliku version.json
    Jeżeli jest zdefiniowana zmienna localStorage.NerthusAddonDebug = true odpala debug moda i ciągnie świeże pliki bezpośrednio z master z pominięciem cdn
    Flaga localStorage.NerthusAddonDebug = true blokuje wczytywanie z localStorage
**/
try{

nerthus = {}
nerthus.addon = {}
nerthus.addon.version = "master"
nerthus.addon.filesPrefix = 'http://cdn.rawgit.com/akrzyz/nerthusaddon'
nerthus.addon.fileUrl = function(filename)
{
    return this.filesPrefix + "/" + this.version + "/" + filename;
}
nerthus.addon.store = function()
{
    if(typeof localStorage !== 'undefined' && !Boolean(eval(localStorage.NerthusAddonNoStorage)))
        localStorage.nerthus = NerthusAddonUtils.parser.stringify(nerthus)
}

//utilities for addon start up
NerthusAddonUtils = (function()
{
    var call = function(func)
    {
        if(typeof func === 'function')
            func()
    }

    var utils = {}
    utils.runner = (function()
    {
        var runner = {}
        runner.run = function()
        {
            utils.loadVersion(function()
            {
                if(typeof localStorage !== 'undefined' && Boolean(eval(localStorage.NerthusAddonDebug)))
                {
                    nerthus.addon.filesPrefix = 'http://rawgit.com/akrzyz/nerthusaddon'
                    nerthus.addon.version = "master"
                    log("Load nerthus addon in debug mode, version = " + nerthus.addon.version)
                    utils.loadFromGitHub()
                }
                else if(typeof localStorage !== 'undefined' && localStorage.nerthus && !Boolean(eval(localStorage.NerthusAddonNoStorage)))
                {
                    log("Load nerthus addon from local storage, version = " + nerthus.addon.version)
                    utils.loadFromStorage()
                }
                else
                {
                    log("Load nerthus addon from github, version = " + nerthus.addon.version)
                    utils.loadFromGitHub(nerthus.addon.store)
                }
            })
        }
        return runner
    })()

    utils.loadFromGitHub = function(onLoaded)
    {
        utils.scriptsLoader.load(['NN_dlaRadnych.js'], function(){
            utils.scriptsLoader.load(['NN_base.js'], function(){
                utils.scriptsLoader.load(nerthus.scripts, onLoaded)
        })})
    }

    utils.loadFromStorage = function(onLoaded)
    {
        var version = nerthus.addon.version
        nerthus = utils.parser.parse(localStorage.nerthus)

        if(version != nerthus.addon.version)
        {
            log("Nerthus addon has not actual version")
            delete localStorage.nerthus
        }

        for(var i in nerthus)
            if(nerthus[i] && nerthus[i].start)
                call(nerthus[i].start.bind(nerthus[i]))

        call(onLoaded)
    }

    utils.version_url = "http://raw.githubusercontent.com/akrzyz/nerthusaddon/master/version.json"
    utils.loadVersion = function(onLoaded)
    {
        $.getJSON(this.version_url, function(data)
        {
            nerthus.addon.version = data.version
            call(onLoaded)
        })
    }

    utils.scriptsLoader = (function()
    {
        var loader = {}
        loader.__to_load = 0
        loader.__callback = null
        loader.load = function (files, callback)
        {
            this.__callback = callback
            this.__to_load += files.length

            if(this.__to_load === 0)
                this.__callback()

            for(var i in files)
                $.getScript(nerthus.addon.fileUrl(files[i]), this.__loaded.bind(this))
        }
        loader.__loaded = function()
        {
            this.__to_load--
            if(this.__to_load === 0 )
                call(this.__callback)
        }
        return loader
    })()

    utils.parser = (function()
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
    })()
    return utils
})()

NerthusAddonUtils.runner.run()

}catch(e){log('NerthusStart Error: '+e.message,1)}
