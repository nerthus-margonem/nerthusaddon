/**
    Start dodatku. Najpierw pobiera wersje dodatku, która jest rewizją z mastera, potem resztę plików dodatku w tej wersji.
    Wersja jest w pliku version.json
    Jeżeli jest zdefiniowana zmienna localStorage.NerthusAddonDebug = true odpala debug moda i ciągnie świeże pliki bezpośrednio z master z pominięciem cdn
    Flaga localStorage.NerthusAddonDebug = true blokuje wczytywanie z localStorage
**/
try{

nerthus = {}
nerthus.addon = {}
nerthus.addon.consts = {}
nerthus.addon.consts.MASTER_VERSION = ""
nerthus.addon.consts.MASTER_PREFIX = 'http://akrzyz.github.io/nerthusaddon'
nerthus.addon.consts.MASTER_VERSION_SEPARATOR = ''
nerthus.addon.consts.CDN_PREFIX = 'http://cdn.jsdelivr.net/gh/akrzyz/nerthusaddon'
nerthus.addon.consts.CDN_VERSION_SEPARATOR = '@'
nerthus.addon.version = nerthus.addon.consts.MASTER
nerthus.addon.version_separator = nerthus.addon.consts.CDN_VERSION_SEPARATOR
nerthus.addon.filesPrefix = nerthus.addon.consts.CDN_PREFIX
nerthus.addon.fileUrl = function(filename)
{
    return [[this.filesPrefix, this.version].join(this.version_separator), filename].join('/')
}
nerthus.addon.fileMasterUrl = function(filename)
{
    return [[this.consts.MASTER_PREFIX, this.consts.MASTER_VERSION].join(this.consts.MASTER_VERSION_SEPARATOR), filename].join('/')
}
nerthus.addon.consts.VERSION_URL = nerthus.addon.fileMasterUrl("version.json")
nerthus.addon.store = function()
{
    if(NerthusAddonUtils.storage())
        NerthusAddonUtils.storage().nerthus = NerthusAddonUtils.parser.stringify(nerthus)
}

NerthusAddonUtils = (function()
{
    var call = function(func)
    {
        if(typeof func === 'function')
            func()
    }

    var utils = {}
    utils.storage = function()
    {
        if(typeof localStorage !== 'undefined' && !localStorage.NerthusAddonNoStorage)
            return localStorage
    }
    utils.purgeStorage = function()
    {
        log("deleting nerthus from storage, hasNerthus: " + localStorage.hasOwnProperty("nerthus"))
        localStorage.removeItem("nerthus")
    }
    utils.runAddon = function()
    {
        if(this.storage() && this.storage().NerthusAddonDebug)
        {
            nerthus.addon.version = nerthus.addon.consts.MASTER_VERSION
            nerthus.addon.filesPrefix = nerthus.addon.consts.MASTER_PREFIX
            nerthus.addon.version_separator = nerthus.addon.consts.MASTER_VERSION_SEPARATOR
            this.loadFromGitHub()
        }
        else if(this.storage() && this.storage().nerthus)
        {
            this.loadFromStorage()
            var checkVersion = function(version)
            {
                if(version != nerthus.addon.version)
                {
                    log("Nerthus addon has not actual version " + version + " actual is " +  nerthus.addon.version)
                    this.purgeStorage()
                }
            }.bind(this, nerthus.addon.version)
            this.loadVersion(checkVersion)
        }
        else
        {
            this.loadVersion(this.loadFromGitHub.bind(this, nerthus.addon.store))
        }
    }
    utils.loadFromGitHub = function(onLoaded)
    {
        log("Load nerthus addon from github, version = " + nerthus.addon.version)
        this.loadScripts(['NN_dlaRadnych.js'], function(){
            this.loadScripts(['NN_base.js'], function(){
                this.loadScripts(nerthus.scripts, onLoaded)
        }.bind(this))}.bind(this))
    }

    utils.loadFromStorage = function(onLoaded)
    {
        nerthus = this.parser.parse(this.storage().nerthus)
        log("Load nerthus addon from local storage, version = " + nerthus.addon.version)

        for(var i in nerthus)
            if(nerthus[i] && nerthus[i].start)
                call(nerthus[i].start.bind(nerthus[i]))

        call(onLoaded)
    }

    utils.loadVersion = function(onLoaded)
    {
        $.getJSON(nerthus.addon.consts.VERSION_URL, function(data)
        {
            nerthus.addon.version = data.version
            call(onLoaded)
        })
    }

    utils.loadScripts = function(scripts, callback)
    {
        var to_load = scripts.length
        var loaded = function() {
            if(--to_load === 0)
                call(callback)
        }

        if(!scripts.length)
            call(callback)

        for(var i in scripts)
            $.getScript(nerthus.addon.fileUrl(scripts[i]), loaded)
    }

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

NerthusAddonUtils.runAddon()

}catch(e){log('NerthusStart Error: '+e.message,1)}
