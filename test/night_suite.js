suite("night")

before(function()
{
    nerthus = {}
    nerthus.options = {}
    nerthus.addon = {}
    nerthus.addon.fileUrl = function(){}

    expect = require("expect.js")
    let fs = require('fs')

    eval(fs.readFileSync('./NN_night.js')+'')
})

test("dummy", function()
{
})
