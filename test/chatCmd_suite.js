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

    Engine = {
        map: {
            d: {
                id: 0
            }
        }
    }

    Image = function() {
        this.src = ""
    }

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

test("*map command with map url - NI", function() {
    const command = {
        t: "*map http://MAPS.COM/MAP.PNG",
        n: ""
    }
    const ch = nerthus.chatCmd.map_ni["map"](command)
    expect(ch.t).to.be.equal("")
    expect(ch.n).to.be.equal("")
    expect(nerthus.chatCmd.mapImage.src).to.be.equal("http://MAPS.COM/MAP.PNG")
})

test("*map command without map url - NI", function() {
    const command = {
        t: "*map",
        n: ""
    }
    const ch = nerthus.chatCmd.map_ni["map"](command)
    expect(ch.t).to.be.equal("")
    expect(ch.n).to.be.equal("")
    expect(nerthus.chatCmd.mapImage.src).to.be.equal("")
})

test("*me command", function() {
    const command = {
        t: "*me TESTING COMMANDS",
        n: ""
    }
    const ch = nerthus.chatCmd.public_map["me"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("me")
    expect(ch.t).to.be.equal("TESTING COMMANDS")
})
