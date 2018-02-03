suite("night")

before(function()
{
    nerthus = {}
    nerthus.options = {}
    nerthus.addon = {}
    nerthus.addon.fileUrl = function(){}

    expect = require("expect.js")
    require("../NN_night.js")

})

test("dummy", function()
{
})
