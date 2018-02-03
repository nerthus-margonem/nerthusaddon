suite("Base")

before(function()
{
    log = function(msg){console.log(msg)}

    nerthus = {}

    g = {}
    g.chat = {}
    g.chat.txt = []
    g.loadQueue = []
    g.tips = {}
    g.tips.npc = function(){}
    hero = {}
    chatScroll = function(){}
    message = function(){}

    jqObjMock = {}
    jqObjMock.hasClass = function(){}
    jqObjMock.html = function(){}
    jqObjMock.attr = function(){}
    $ = function (){return jqObjMock}

    expect = require("expect.js")
    require("../NN_base.js")

})

test("dummy", function()
{
})

