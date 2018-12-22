suite("maps")

before(function()
{
    nerthus = {}
    nerthus.defer = function(){}

    expect = require("expect.js")
    let fs = require('fs')

    eval(fs.readFileSync('./NN_maps.js')+'')

})

test("dummy", function()
{
})


