suite("defs")

before(function()
{
    log = function(msg){console.log(msg)}

    nerthus = {}
    nerthus.addon = {}
    nerthus.addon.fileUrl = Function.prototype

    g = {}
    g.names = {}
    g.names.ranks = []
    expect = require("expect.js")
    let fs = require('fs')

    eval(fs.readFileSync('./NN_dlaRadnych.js')+'')

})

test("dummy", function()
{
})

