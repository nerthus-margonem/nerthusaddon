suite("start")

const VERSION_CURRENT = "CURRENT_VERSION"
const VERSION_OLD = "OLD_VERSION"
const VERSION_MASTER = ""
const PREFIX_CDN = 'http://cdn.jsdelivr.net/gh/akrzyz/nerthusaddon'
const VERSION_SEPARATOR_CDN = "@"
const PREFIX_MASTER = 'http://akrzyz.github.io/nerthusaddon'
const VERSION_SEPARATOR_MASTER = ""
const ADDITIONAL_SCRIPTS = ["ADDITIONAL_SCRIPT_1.js", "ADDITIONAL_SCRIPT_2.js"]
let LOAD_HELPER = {}
    LOAD_HELPER.loaded = false
    LOAD_HELPER.on_load = function(){this.loaded = true}.bind(LOAD_HELPER)
let COOKIES = {}

before(function()
{
    getCookie = function(cookie){return COOKIES[cookie]}
    log = function(msg){console.log(msg)}

    $ = {}
    $.LOADED_SCRIPTS = []
    $.LOADED_JSONS = []
    $.getJSON = function(url, callback){this.LOADED_JSONS.push(url); callback({version:VERSION_CURRENT})}

    $.getScript = function(url, callback){nerthus.scripts = []; callback()} //hack for loading NN_start, otherwise exception is raised due to lack of loaded NN_dlaRadnych which define nerthus.scripts
    require("../NN_start.js")

    $.getScript = function(url, callback){this.LOADED_SCRIPTS.push(url); callback()}

    expect = require("expect.js")
})

beforeEach(function()
{
    $.LOADED_SCRIPTS = []
    $.LOADED_JSONS = []

    localStorage = {}
    localStorage.removeItem = function(item){delete this[item]}

    LOAD_HELPER.loaded = false
    COOKIES = {}

    nerthus.RUNABLE_MODULE_ONE = { RUNNING : false}
    nerthus.RUNABLE_MODULE_ONE.start = function(){this.RUNNING = "SI"}
    nerthus.RUNABLE_MODULE_ONE.start_ni = function(){this.RUNNING = "NI"}
    nerthus.RUNABLE_MODULE_TWO = { RUNNING : false}
    nerthus.RUNABLE_MODULE_TWO.start = function(){this.RUNNING = "SI"}
    nerthus.RUNABLE_MODULE_TWO.start_ni = function(){this.RUNNING = "NI"}

    nerthus.addon.version = VERSION_MASTER
    nerthus.addon.version_separator = VERSION_SEPARATOR_CDN
    nerthus.addon.filesPrefix = PREFIX_CDN
    nerthus.scripts = []
})

test("fileUrl concat filesPrefix and file_name into url", function()
{
    const FILE = 'SCRIPT.JS'
    const PREFIX = 'PREFIX'
    const VERSION = 'VERSION'
    const FILE_URL = 'PREFIX@VERSION/SCRIPT.JS'

    nerthus.addon.filesPrefix = PREFIX
    nerthus.addon.version = VERSION
    expect(nerthus.addon.fileUrl(FILE)).to.be.equal(FILE_URL)
})

test("fileUrl concat filesPrefix and file_name into url with special characters", function()
{
    const FILE = 'SCRIPTS/SCRIPT ĄŹĆ.JS'
    const PREFIX = 'PREFIX'
    const VERSION = 'VERSION'
    const FILE_URL = 'PREFIX@VERSION/SCRIPTS/SCRIPT%20%C4%84%C5%B9%C4%86.JS'

    nerthus.addon.filesPrefix = PREFIX
    nerthus.addon.version = VERSION
    expect(nerthus.addon.fileUrl(FILE)).to.be.equal(FILE_URL)
})

test("storage : localStorage exist", function()
{
    expect(NerthusAddonUtils.storage()).to.be.ok()
})

test("storage : localStorage not exist", function()
{
    delete localStorage
    expect(NerthusAddonUtils.storage()).to.not.be.ok()
})

test("storage : localStorage exist but flag NerthusAddonNoStorage prevent it", function()
{
    localStorage.NerthusAddonNoStorage = true
    expect(NerthusAddonUtils.storage()).to.not.be.ok()
})

test("addon.store : addion is stored in localStorage", function()
{
    expect(localStorage.nerthus).to.not.be.ok()
    nerthus.addon.store()
    expect(localStorage.nerthus).to.be.ok()
})

test("addon.store : addion is not stored when localStorage not exist", function()
{
    delete localStorage
    nerthus.addon.store()
    expect(typeof localStorage).to.be('undefined')
})

test("ScriptsLoader : load empty script list", function()
{
    NerthusAddonUtils.loadScripts([], LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.LOADED_SCRIPTS).to.have.length(0)
})

test("ScriptsLoader : load single script", function()
{
    const FILE = "SCRIPT.JS"
    const FILE_URL = nerthus.addon.fileUrl(FILE)

    NerthusAddonUtils.loadScripts([FILE], LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.LOADED_SCRIPTS).to.have.length(1)
    expect($.LOADED_SCRIPTS[0]).to.be.equal(FILE_URL)
})

test("ScriptsLoader : load multiple scripts", function()
{
    const FILE_1 = "SCRIPT_1.JS"
    const FILE_2 = "SCRIPT_2.JS"
    const FILE_URL_1 = nerthus.addon.fileUrl(FILE_1)
    const FILE_URL_2 = nerthus.addon.fileUrl(FILE_2)

    NerthusAddonUtils.loadScripts([FILE_1, FILE_2], LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.LOADED_SCRIPTS).to.have.length(2)
    expect($.LOADED_SCRIPTS[0]).to.be.equal(FILE_URL_1)
    expect($.LOADED_SCRIPTS[1]).to.be.equal(FILE_URL_2)
})

test("VersionLoader ", function()
{
    nerthus.addon.version = null
    NerthusAddonUtils.loadVersion(function(){
        expect($.LOADED_JSONS).to.have.length(1)
        expect($.LOADED_JSONS[0]).to.be.ok()
        expect(nerthus.addon.version).to.be.equal(VERSION_CURRENT)
    })
})

test("GitHubLoader", function()
{
    nerthus.scripts = ADDITIONAL_SCRIPTS

    NerthusAddonUtils.loadFromGitHub(LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.LOADED_SCRIPTS).to.have.length(2 + ADDITIONAL_SCRIPTS.length)
    expect($.LOADED_SCRIPTS[0]).to.be.equal(nerthus.addon.fileUrl("NN_dlaRadnych.js"))
    expect($.LOADED_SCRIPTS[1]).to.be.equal(nerthus.addon.fileUrl("NN_base.js"))
    expect($.LOADED_SCRIPTS[2]).to.be.equal(nerthus.addon.fileUrl(ADDITIONAL_SCRIPTS[0]))
    expect($.LOADED_SCRIPTS[3]).to.be.equal(nerthus.addon.fileUrl(ADDITIONAL_SCRIPTS[1]))
})

test("StorageLoader : load addon in current version, nerthus remain in storage", function()
{
    localStorage.nerthus = NerthusAddonUtils.parser.stringify(nerthus)

    NerthusAddonUtils.loadFromStorage(LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect(localStorage.nerthus).to.be.ok()
    expect(nerthus.RUNABLE_MODULE_ONE.RUNNING).to.be.equal("SI")
    expect(nerthus.RUNABLE_MODULE_TWO.RUNNING).to.be.equal("SI")
})

test("Runner : run in debug mode", function()
{
    localStorage.NerthusAddonDebug = true

    NerthusAddonUtils.runAddon()

    expect(nerthus.addon.version).to.be.equal(VERSION_MASTER)
    expect(nerthus.addon.filesPrefix).to.be.equal(PREFIX_MASTER)
    expect(nerthus.addon.version_separator).to.be.equal(VERSION_SEPARATOR_MASTER)
})

test("Runner : run from github", function()
{
    NerthusAddonUtils.runAddon()

    expect(nerthus.addon.version).to.be.equal(VERSION_CURRENT)
    expect(nerthus.addon.filesPrefix).to.be.equal(PREFIX_CDN)
    expect(nerthus.addon.version_separator).to.be.equal(VERSION_SEPARATOR_CDN)
    expect(localStorage.nerthus).to.be.ok()
})

test("Runner : run from localStorage in actual version", function()
{
    nerthus.addon.version = VERSION_CURRENT
    localStorage.nerthus = NerthusAddonUtils.parser.stringify(nerthus)
    nerthus.addon = {}

    NerthusAddonUtils.runAddon()

    expect(nerthus.addon.version).to.be.equal(VERSION_CURRENT)
    expect(nerthus.addon.filesPrefix).to.be.equal(PREFIX_CDN)
    expect(nerthus.addon.version_separator).to.be.equal(VERSION_SEPARATOR_CDN)
    expect(localStorage.nerthus).to.be.ok() //remain in storage
})

test("Runner : run from localStorage in old version", function()
{
    nerthus.addon.version = VERSION_OLD
    localStorage.nerthus = NerthusAddonUtils.parser.stringify(nerthus)
    nerthus.addon = {}

    NerthusAddonUtils.runAddon()

//    expect(nerthus.addon.version).to.be.equal(VERSION_OLD)
    expect(nerthus.addon.filesPrefix).to.be.equal(PREFIX_CDN)
    expect(nerthus.addon.version_separator).to.be.equal(VERSION_SEPARATOR_CDN)
    expect(localStorage.nerthus).to.not.be.ok() //removed from storege
})

test("run addon in new interface", function()
{
    COOKIES["interface"] = "ni"

    localStorage.nerthus = NerthusAddonUtils.parser.stringify(nerthus)

    NerthusAddonUtils.loadFromStorage(LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect(localStorage.nerthus).to.be.ok()
    expect(nerthus.RUNABLE_MODULE_ONE.RUNNING).to.be.equal("NI")
    expect(nerthus.RUNABLE_MODULE_TWO.RUNNING).to.be.equal("NI")
})

test("other modules are started even if start of previous failed", function()
{
    nerthus.RUNABLE_MODULE_ONE.start = function(){throw new Error("module one start error")}

    localStorage.nerthus = NerthusAddonUtils.parser.stringify(nerthus)
    NerthusAddonUtils.loadFromStorage(LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect(localStorage.nerthus).to.be.ok()
    expect(nerthus.RUNABLE_MODULE_ONE.RUNNING).to.be.equal(false)
    expect(nerthus.RUNABLE_MODULE_TWO.RUNNING).to.be.equal("SI")
})
