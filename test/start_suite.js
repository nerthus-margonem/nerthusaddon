before(function(){
    log = function(msg){console.log(msg)}

    require("../NN_start.js")
    expect = require("./expect.js")

    LOADED_VERSION = "LOADED_VERSION"
    ADDITIONAL_SCRIPTS = ["ADDITIONAL_SCRIPT_1.js", "ADDITIONAL_SCRIPT_2.js"]

})

beforeEach(function(){

    $ = {}
    $.loaded_scripts = []
    $.loaded_jsons = []
    $.getScript = function(url, callback){this.loaded_scripts.push(url); callback()}
    $.getJSON = function(url, callback){this.loaded_jsons.push(url); callback({version:LOADED_VERSION})}

    localStorage = {}

    LOAD_HELPER = {}
    LOAD_HELPER.loaded = false;
    LOAD_HELPER.on_load = function(){this.loaded = true}.bind(LOAD_HELPER)

})

suite("start")

test("default version and prefix", function(){
    expect(nerthus.addon.version).to.be.equal('master')
    expect(nerthus.addon.filesPrefix).to.be.equal('http://cdn.rawgit.com/akrzyz/nerthusaddon')
})

test("fileUrl concat filesPrefix, version and file_name into url", function(){
    var FILE = 'SCRIPT.JS'
    var PREFIX = 'PREFIX'
    var VERSION = 'VERSION'
    var FILE_URL = 'PREFIX/VERSION/SCRIPT.JS'

    nerthus.addon.filesPrefix = PREFIX
    nerthus.addon.version = VERSION
    expect(nerthus.addon.fileUrl(FILE)).to.be.equal(FILE_URL)
})

test("ScriptsLoader : load empty script list", function(){
    var loader = NerthusAddonUtils.ScriptsLoader()
    loader.load([], LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.loaded_scripts).to.have.length(0)
})

test("ScriptsLoader : load single script", function(){
    var FILE = "SCRIPT.JS"
    var FILE_URL = nerthus.addon.fileUrl(FILE)

    var loader = NerthusAddonUtils.ScriptsLoader()
    loader.load([FILE], LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.loaded_scripts).to.have.length(1)
    expect($.loaded_scripts[0]).to.be.equal(FILE_URL)
})

test("ScriptsLoader : load multiple scripts", function(){
    var FILE_1 = "SCRIPT_1.JS"
    var FILE_2 = "SCRIPT_2.JS"
    var FILE_URL_1 = nerthus.addon.fileUrl(FILE_1)
    var FILE_URL_2 = nerthus.addon.fileUrl(FILE_2)

    var loader = NerthusAddonUtils.ScriptsLoader()
    loader.load([FILE_1, FILE_2], LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.loaded_scripts).to.have.length(2)
    expect($.loaded_scripts[0]).to.be.equal(FILE_URL_1)
    expect($.loaded_scripts[1]).to.be.equal(FILE_URL_2)
})

test("VersionLoader ", function(){
    var version = { ver : null}
    var version_loaded = function(v){this.ver = v}.bind(version)

    loader = NerthusAddonUtils.VersionLoader()
    loader.load(version_loaded)

    expect($.loaded_jsons).to.have.length(1)
    expect(version.ver).to.be.equal(LOADED_VERSION)
})

test("GitHubLoader", function(){
    nerthus.scripts = ADDITIONAL_SCRIPTS

    var loader = NerthusAddonUtils.GitHubLoader()
    loader.load(LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect($.loaded_scripts).to.have.length(2 + ADDITIONAL_SCRIPTS.length)
    expect($.loaded_scripts[0]).to.be.equal(nerthus.addon.fileUrl("NN_dlaRadnych.js"))
    expect($.loaded_scripts[1]).to.be.equal(nerthus.addon.fileUrl("NN_base.js"))
    expect($.loaded_scripts[2]).to.be.equal(nerthus.addon.fileUrl(ADDITIONAL_SCRIPTS[0]))
    expect($.loaded_scripts[3]).to.be.equal(nerthus.addon.fileUrl(ADDITIONAL_SCRIPTS[1]))
})

test("StorageLoader : load addon in current version, nerthus remain in storage", function(){
    localStorage.nerthus = NerthusAddonUtils.Parser().stringify(nerthus)

    loader = NerthusAddonUtils.StorageLoader()
    loader.load(LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect(localStorage.nerthus).to.be.ok()
})

test("StorageLoader : load addon in old version, nerthus is removed from storage", function(){
    var parser = NerthusAddonUtils.Parser()
    nerthus.addon.version = "OLD"
    localStorage.nerthus = NerthusAddonUtils.Parser().stringify(nerthus)

    loader = NerthusAddonUtils.StorageLoader()
    loader.load(LOAD_HELPER.on_load)

    expect(LOAD_HELPER.loaded).to.be.ok()
    expect(localStorage.nerthus).to.not.be.ok()
})
