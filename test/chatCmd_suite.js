suite("chatCmd")

before(function()
{
    log = function(msg){console.log(msg)}

    nerthus = {}
    nerthus.defer = function(){}

    jqObjMock = {}
    jqObjMock.appendTo = function(){}
    $ = function (){return jqObjMock}

    g = {}
    g.chat = {}
    g.chat.parsers = []

    expect = require("./expect.js")
    require("../NN_chatCmd.js")

})

test("dummy", function()
{
})

