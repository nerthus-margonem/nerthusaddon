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

test("zmiana https*Krzywi się.*/ na poprawny link", function() {
    let buggedText = "https*Krzywi się.*/www.link.pl/images/image.gif",
        fixedText = "https://www.link.pl/images/image.gif"
    expect(nerthus.chatCmd.extractUrlFromDecorator(buggedText)).to.be(fixedText)
})
