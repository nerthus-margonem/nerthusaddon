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

    expect = require("expect.js")
    require("../NN_chatCmd.js")

})

test("dummy", function()
{
})

test("change https*Krzywi się.*/ to normal link", function() {
    const buggedLink = "https*Krzywi się.*/www.link.pl/images/image.gif"
    const fixedLink = "https://www.link.pl/images/image.gif"
    expect(nerthus.chatCmd.fixUrl(buggedLink)).to.be(fixedLink)
})

test("change http*Krzywi się.*/ to normal link", function() {
    const buggedLink = "http*Krzywi się.*/www.link.pl/images/image.gif"
    const fixedLink = "http://www.link.pl/images/image.gif"
    expect(nerthus.chatCmd.fixUrl(buggedLink)).to.be(fixedLink)
})
