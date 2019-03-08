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
    return encodeURI([[this.filesPrefix, this.version].join(this.version_separator), filename].join('/'))
}
nerthus.addon.fileMasterUrl = function(filename)
{
    return encodeURI([[this.consts.MASTER_PREFIX, this.consts.MASTER_VERSION].join(this.consts.MASTER_VERSION_SEPARATOR), filename].join('/'))
}
nerthus.addon.consts.VERSION_URL = nerthus.addon.fileMasterUrl("version.json")
nerthus.addon.store = function()
{
    if(NerthusAddonUtils.storage())
        NerthusAddonUtils.storage().nerthus = NerthusAddonUtils.parser.stringify(nerthus)
}

NerthusAddonUtils = (function()
{
    let call = function(func)
    {
        if(typeof func === 'function')
            func()
    }

    let utils = {}
    utils.log = function (message)
    {
        log(message)
    }
    utils.log_ni = function (message)
    {
        log(message)
        let $notif = $("#consoleNotif")
        if ($notif)
            $notif.remove()
        if ($._data(document.querySelector(".console-input"), "events"))
        {
            let handler = $._data(document.querySelector(".console-input"), "events").keydown[0].handler
            if (handler)
            {
                $(".console-content div:last-child").addClass("deleteNextLog")
                let lastChild = $(".console-content div i")
                let $input = document.createElement("input")
                $input.value = "self.close()"
                handler.call($input, {keyCode: 13})
                lastChild.remove()
            }
        }
    }
    utils.muteNiConsole = function ()
    {
        this.log = this.log_ni
        if ($._data(document.querySelector(".console-input"), "events"))
        {
            let handler = $._data(document.querySelector(".console-input"), "events").keydown[0].handler
            let $input = document.createElement("input")
            $input.value = "self.close()"
            handler.call($input, {keyCode: 13})
            $(".console-content:last-child").remove()
        }

        $("head").append("<style>.console-content .deleteNextLog + div i{display: none}</style>")
    }
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
        if (postfix === "_ni")
            this.log = this.log_ni

        if(this.storage() && this.storage().NerthusAddonDebug)
        {
            nerthus.addon.version = nerthus.addon.consts.MASTER_VERSION
            nerthus.addon.filesPrefix = nerthus.addon.consts.MASTER_PREFIX
            nerthus.addon.version_separator = nerthus.addon.consts.MASTER_VERSION_SEPARATOR
            this.loadFromGitHub(startMethod)
        }
        else if(this.storage() && this.storage().nerthus)
        {
            this.loadFromStorage(startMethod)
            let checkVersion = function(version)
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
            this.loadVersion(this.loadFromGitHub.bind(this, startMethod, nerthus.addon.store))
        }
    }
    utils.loadFromGitHub = function(startMethod, onLoaded)
    {
        this.log("Load nerthus addon from github, version = " + nerthus.addon.version)
        if (startMethod === "start_ni")
            this.muteNiConsole()
        this.loadScripts(['NN_dlaRadnych.js', 'NN_base.js'], function(){
            this.loadScripts(nerthus.scripts, this.startPlugins.bind(this, startMethod, onLoaded))
        }.bind(this))
    }

    utils.loadFromStorage = function(startMethod, onLoaded)
    {
        nerthus = this.parser.parse(this.storage().nerthus)
        this.log("Load nerthus addon from local storage, version = " + nerthus.addon.version)
        if (startMethod === "start_ni")
            this.muteNiConsole()
        this.startPlugins(startMethod, onLoaded)
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
