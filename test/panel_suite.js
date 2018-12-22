suite("panel")

before(function()
{
    nerthus = {}
    nerthus.defer = function(){}

    expect = require("expect.js")
    let fs = require('fs')

    eval(fs.readFileSync('./NN_panel.js')+'')
})

test("dummy", function()
{
})
