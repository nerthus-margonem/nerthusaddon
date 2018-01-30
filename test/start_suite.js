beforeEach(function(){

    localStorage = {}
    log = function(msg){console.log(msg)}


    bot = require("../NN_start.js").bot
    expect = require("./expect.js")
})

suite("start")

test("default version and prefix",function(){
    expect(nerthus.addon.version).to.be.equal('master')
    expect(nerthus.addon.filesPrefix).to.be.equal('http://cdn.rawgit.com/akrzyz/nerthusaddon')
})

test("fileUrl concat filesPrefix, version and file_name into url",function(){

    var file = 'SCRIPT.JS'
    var prefix = 'PREFIX'
    var version = 'VERSION'
    var file_url = 'PREFIX/VERSION/SCRIPT.JS'

    nerthus.addon.filesPrefix = prefix
    nerthus.addon.version = version
    expect(nerthus.addon.fileUrl(file)).to.be.equal(file_url)
})

test("dummy", function(){
    var dummy = true
    expect(dummy).to.be.ok()
})
