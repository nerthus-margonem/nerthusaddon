before(function(){
    log = function(msg){console.log(msg)}

    require("../NN_start.js")
    expect = require("./expect.js")

    LOADED_VERSION = "LOADED_VERSION"
})

beforeEach(function(){

    $ = {}
    $.loaded_scripts = []
    $.loaded_jsons = []
    $.getScript = function(url, callback){this.loaded_scripts.push(url); callback()}
    $.getJSON = function(url, callback){this.loaded_jsons.push(url); callback({version:LOADED_VERSION})}

    localStorage = {}
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

test("ScriptsLoader : load single script", function(){
    var FILE = "SCRIPT.JS"
    var FILE_URL = nerthus.addon.fileUrl(FILE)

    var loader = NerthusAddonUtils.ScriptsLoader()
    loader.load([FILE])

    expect($.loaded_scripts).to.have.length(1)
    expect($.loaded_scripts[0]).to.be.equal(FILE_URL)
})

test("ScriptsLoader : load multiple scripts", function(){
    var FILE_1 = "SCRIPT_1.JS"
    var FILE_2 = "SCRIPT_2.JS"
    var FILE_URL_1 = nerthus.addon.fileUrl(FILE_1)
    var FILE_URL_2 = nerthus.addon.fileUrl(FILE_2)

    var loader = NerthusAddonUtils.ScriptsLoader()
    loader.load([FILE_1, FILE_2])

    expect($.loaded_scripts).to.have.length(2)
    expect($.loaded_scripts[0]).to.be.equal(FILE_URL_1)
    expect($.loaded_scripts[1]).to.be.equal(FILE_URL_2)
})

test("VersionLoader ", function(){
    var version = null
    var loaded = function(v){version = v}

    loader = NerthusAddonUtils.VersionLoader()
    loader.load(loaded)

    expect($.loaded_jsons).to.have.length(1)
    expect(version).to.be.equal(LOADED_VERSION)
})
