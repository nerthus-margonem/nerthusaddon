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


test("Rank names on SI",function()
{
    nerthus.ranks.start()
    expect(g.names.ranks.length).to.be.greaterThan(7)
})

test("Rank names on NI", function()
{
    nerthus.ranks.start_ni()
    expect(nerthus.ranks.rankName.length).to.be.greaterThan(7)
})

