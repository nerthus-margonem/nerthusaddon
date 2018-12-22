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
    let fs = require('fs')

    eval(fs.readFileSync('./NN_alko.js')+'')
})

test("dummy", function()
{
})



