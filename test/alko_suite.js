suite("Alko")

before(function()
{
    log = function(msg){console.log(msg)}

    nerthus = {}
    nerthus.defer = function(){}
    localStorage = {}
    chatSendMsg = function(){}
    _g = {}

    expect = require("expect.js")
    require("../NN_alko.js")

})

test("dummy", function()
{
})



