/**
    Start dodatku. Najpierw pobiera wersje dodatku, która jest rewizją z mastera, potem resztę plików dodatku w tej wersji.
    Wersja jest w pliku version.json
    Jeżeli jest zdefiniowana zmienna localStorage.NerthusAddonDebug = true odpala debug moda i ciągnie świeże pliki bezpośrednio z master z pominięciem cdn
    Flaga localStorage.NerthusAddonDebug = true blokuje wczytywanie z localStorage
**/

nerthus = {}
nerthus.addon = {}
nerthus.addon.consts = {}
nerthus.addon.consts.MASTER_VERSION = ""
nerthus.addon.consts.MASTER_PREFIX = 'http://akrzyz.github.io/nerthusaddon'
nerthus.addon.consts.MASTER_VERSION_SEPARATOR = ''
nerthus.addon.consts.CDN_PREFIX = 'http://cdn.jsdelivr.net/gh/akrzyz/nerthusaddon'
nerthus.addon.consts.CDN_VERSION_SEPARATOR = '@'
nerthus.addon.version = nerthus.addon.consts.MASTER_VERSION
nerthus.addon.version_separator = nerthus.addon.consts.CDN_VERSION_SEPARATOR
nerthus.addon.filesPrefix = nerthus.addon.consts.CDN_PREFIX
nerthus.addon.fileUrl = function(filename)
{
    const url = this.filesPrefix + this.version_separator + this.version + "/" + filename
    return encodeURI(url)
}
nerthus.addon.fileMasterUrl = function(filename)
{
    const url = this.consts.MASTER_PREFIX + this.consts.MASTER_VERSION + this.consts.MASTER_VERSION_SEPARATOR + "/" + filename
    return encodeURI(url)
}
nerthus.addon.consts.VERSION_URL = nerthus.addon.fileMasterUrl("version.json")
nerthus.addon.store = function()
{
    if(NerthusAddonUtils.storage())
        NerthusAddonUtils.storage()["nerthus"] = NerthusAddonUtils.parser.stringify(nerthus)
}

NerthusAddonUtils = (function()
{
    let call = function(func)
    {
        if(typeof func === 'function')
            func()
    }

    const utils = {}
    utils.log = log
    utils.storage = function()
    {
        if(typeof localStorage !== 'undefined' && !localStorage.NerthusAddonNoStorage)
            return localStorage
    }
    utils.purgeStorage = function()
    {
        localStorage.removeItem("nerthus")
    }
    utils.runAddon = function()
    {
        const postfix = getCookie("interface") === "ni" ? "_ni" : ""
        const startMethod = "start" + postfix
        nerthus.startMethod = postfix === "_ni" ? "_NI" : "_SI"

        if(this.storage() && this.storage().NerthusAddonDebug)
        {
            nerthus.addon.version = nerthus.addon.consts.MASTER_VERSION
            nerthus.addon.filesPrefix = nerthus.addon.consts.MASTER_PREFIX
            nerthus.addon.version_separator = nerthus.addon.consts.MASTER_VERSION_SEPARATOR
            this.loadFromGitHub(this.startPlugins.bind(this, startMethod), startMethod)
        }
        else if(this.storage() && this.storage()["nerthus"])
        {
            this.loadFromStorage(this.startPlugins.bind(this, startMethod), startMethod)
            var checkVersion = function(version)
            {
                if(version !== nerthus.addon.version)
                {
                    //default log for updates
                    log("Nerthus addon has not actual version " + version + " actual is " +  nerthus.addon.version)
                    this.purgeStorage()
                }
            }.bind(this, nerthus.addon.version)
            this.loadVersion(checkVersion)
        }
        else
        {
            this.loadVersion(this.loadFromGitHub.bind(this,
                function ()
                {
                    nerthus.addon.store()
                    this.startPlugins(startMethod)
                }.bind(this)))
        }
    }
    utils.loadFromGitHub = function(onLoaded, startMethod)
    {
        this.log("Load nerthus addon from github, version = " + nerthus.addon.version)
        this.loadScripts(['NN_dlaRadnych.js', 'NN_base.js', 'NN_worldEdit.js'],
            function(){ this.loadScripts(nerthus.scripts, onLoaded) }.bind(this))
    }

    utils.loadFromStorage = function(onLoaded, startMethod)
    {
        nerthus = this.parser.parse(this.storage().nerthus)
        this.log("Load nerthus addon from local storage, version = " + nerthus.addon.version)
        onLoaded()
    }

    utils.startPlugins = function(startMethod, callback)
    {

        for(const module in nerthus)
        {
            if(nerthus.hasOwnProperty(module) && nerthus[module][startMethod])
                try
                {
                    call(nerthus[module][startMethod].bind(nerthus[module]))
                }
                catch(error)
                {
                    //default log so that on NI user knows something is not right
                    log("nerthus error in nerthus." + module + "." + startMethod + "(), message: " + error.message, 1)
                }
        }
        call(callback)
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
