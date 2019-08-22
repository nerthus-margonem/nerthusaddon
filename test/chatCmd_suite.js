suite("chatCmd")

before(function()
{
    NerthusAddonUtils = {
        log: function (msg)
        {
            console.log(msg)
        }
    }

    //helper object to check proper argument passing to NN_worldEdit.js
    WorldEdit = {}

    nerthus = {}
    nerthus.defer = function(){}
    nerthus.worldEdit = {
        changeMap(url, layer)
        {
            WorldEdit.changeMap = [url, layer]
        },
        changeLight(opacity) {
            WorldEdit.changeLight = opacity
        },
        addNpc(x, y, url, name, collision)
        {
            WorldEdit.addNpc = [x, y, url, name, collision]
        },
        deleteNpc(x, y)
        {
            WorldEdit.deleteNpc = [x, y]
        },
        hideGameNpc(id){
            WorldEdit.hideGameNpc = id
        }
    }
    //to be moved to worldEdit
    nerthus.weather = {
        set_weather: function (number)
        {

        }
    }

    //game constants
    g = {}
    g.chat = {}
    g.chat.parsers = []
    hero = {
        nick: "NICK_SI"
    }
    Engine = {
        map: {
            d: {
                id: 0
            }
        },
        chat: {
            setAvatarData: function ()
            {
                
            }
        },
        hero: {
            d: {
                nick: "NICK_NI"
            }
        }
    }

    API = {
        addCallbackToEvent(eventName, func) {

        }
    }


    expect = require("expect.js")
    require("../NN_chatCmd.js")

    const jsdom = require("jsdom")
    const {JSDOM} = jsdom
    const {window} = new JSDOM()
    const {document} = (new JSDOM('')).window
    global.document = document


})

beforeEach(function()
{
    document.head.innerHTML = ""
})

//TODO tests of changing objects in map functions
// due to pointers when passing objects
// are they needed/wanted?
test("dummy", function()
{
})

test("run when there is no command", () =>
{
    const fetch_cmd = nerthus.chatCmd.fetch_cmd
    nerthus.chatCmd.fetch_cmd = () =>
    {
        return undefined
    }
    const command = {
        t: "*command ",
        k: 0,
        n: ""
    }

    expect(nerthus.chatCmd.run(command)).to.equal(false)

    nerthus.chatCmd.fetch_cmd = fetch_cmd
})

test("run when there is a command, but not a callback", () =>
{
    const fetch_cmd = nerthus.chatCmd.fetch_cmd
    nerthus.chatCmd.fetch_cmd = (ch) =>
    {
        return {
            t: "command",
            k: 0,
            n: "author"
        }
    }
    const fetch_callback = nerthus.chatCmd.fetch_callback
    nerthus.chatCmd.fetch_callback = () =>
    {
        return false
    }

    const command = {
        t: "*command ",
        k: 0,
        n: "author"
    }

    expect(nerthus.chatCmd.run(command)).to.equal(false)

    nerthus.chatCmd.fetch_cmd = fetch_cmd
    nerthus.chatCmd.fetch_callback = fetch_callback
})

test("run when there is a command and callback which hides msg", () =>
{
    const fetch_cmd = nerthus.chatCmd.fetch_cmd
    nerthus.chatCmd.fetch_cmd = (ch) =>
    {
        return {
            t: "command",
            k: 0,
            n: "author"
        }
    }
    const fetch_callback = nerthus.chatCmd.fetch_callback
    nerthus.chatCmd.fetch_callback = () =>
    {
        return function ()
        {
            return false
        }
    }
    const fixUrl = nerthus.chatCmd.fixUrl
    nerthus.chatCmd.fixUrl = (t) =>
    {
        console.log(t)
        return t
    }

    const command = {
        t: "*command ",
        k: 0,
        n: "author"
    }

    expect(nerthus.chatCmd.run(command)).to.equal(true)

    nerthus.chatCmd.fetch_cmd = fetch_cmd
    nerthus.chatCmd.fetch_callback = fetch_callback
    nerthus.chatCmd.fixUrl = fixUrl
})

test("run when there is a command and callback which doesn't hide msg", () =>
{
    const fetch_cmd = nerthus.chatCmd.fetch_cmd
    nerthus.chatCmd.fetch_cmd = (ch) =>
    {
        return {
            t: "command",
            k: 0,
            n: "author"
        }
    }
    const fetch_callback = nerthus.chatCmd.fetch_callback
    nerthus.chatCmd.fetch_callback = () =>
    {
        return function ()
        {
            return true
        }
    }
    const fixUrl = nerthus.chatCmd.fixUrl
    nerthus.chatCmd.fixUrl = (t) =>
    {
        return t
    }

    const command = {
        t: "*command ",
        k: 0,
        n: "author"
    }

    expect(nerthus.chatCmd.run(command)).to.equal(false)

    nerthus.chatCmd.fetch_cmd = fetch_cmd
    nerthus.chatCmd.fetch_callback = fetch_callback
    nerthus.chatCmd.fixUrl = fixUrl
})

test("getHeroNick on SI", () =>
{
    Engine.hero = undefined
    hero.nick = "NICK_SI"
    expect(nerthus.chatCmd.getHeroNick()).to.equal("NICK_SI")
})

test("getHeroNick on NI", () =>
{
    hero = undefined
    Engine.hero = {
        d: {
            nick: "NICK_NI"
        }
    }
    expect(nerthus.chatCmd.getHeroNick()).to.equal("NICK_NI")
})

test("styles appended when start SI executed", () =>
{
    const style = nerthus.chatCmd.createStyles()
    nerthus.chatCmd.start()
    expect(document.head.innerHTML).to.contain(style.innerHTML)
})

test("styles appended when start NI executed", () =>
{
    const style = nerthus.chatCmd.createStyles()
    nerthus.chatCmd.start_ni()
    expect(document.head.innerHTML).to.contain(style.innerHTML)
})

test("fetch callback public map - not nar", () =>
{
    const public_map = nerthus.chatCmd.public_map
    nerthus.isNarr = nerthus.isRad = nerthus.isSpec = () => {return false}
    nerthus.chatCmd.public_map = {
        "PUBLIC": "public"
    }
    const ch = {
        n: "Tester"
    }

    const callback = nerthus.chatCmd.fetch_callback("PUBLIC",ch)

    expect(callback).to.equal("public")

    nerthus.chatCmd.public_map = public_map
})

test("fetch callback public map - nar", () =>
{
    const public_map = nerthus.chatCmd.public_map
    nerthus.isNarr = nerthus.isRad = nerthus.isSpec = () => {return true}
    nerthus.chatCmd.public_map = {
        "PUBLIC": "public"
    }
    const ch = {
        n: "Tester"
    }

    const callback = nerthus.chatCmd.fetch_callback("PUBLIC",ch)

    expect(callback).to.equal("public")

    nerthus.chatCmd.public_map = public_map
})

test("fetch callback narrator's map - not nar", () =>
{
    const map = nerthus.chatCmd.map
    nerthus.isNarr = nerthus.isRad = nerthus.isSpec = () => {return false}
    nerthus.chatCmd.map = {
        "PUBLIC": "private"
    }
    const ch = {
        n: "Tester"
    }

    const callback = nerthus.chatCmd.fetch_callback("PUBLIC",ch)
    expect(callback).to.equal(undefined)

    nerthus.chatCmd.map = map
})

test("fetch callback narrator's map - nar", () =>
{
    const map = nerthus.chatCmd.map
    nerthus.isNarr = nerthus.isRad = nerthus.isSpec = () => {return true}
    nerthus.chatCmd.map = {
        "NARRATORS": "private"
    }
    const ch = {
        n: "Tester"
    }

    const callback = nerthus.chatCmd.fetch_callback("NARRATORS",ch)

    expect(callback).to.equal("private")

    nerthus.chatCmd.map = map
})

test("fetch command from ch object", function()
{
    const ch = {
        i: "/paid/g18-m1.gif",  //url to outfit of sender
        k: 3,                   //on which channel
        n: "Kris Aphalon",      //sender name
        nd: "Kris Aphalon",     //sender name parsed (?)
        s: "",                  //???
        t: "*cmd TEST",         //message
        ts: 1553126972.192146   //timestamp (dokładniej?)
    }
    const command = nerthus.chatCmd.fetch_cmd(ch)
    expect(command).to.be("cmd")
})

test("fetch command from ch object - not a command", function()
{
    const ch = {
        i: "/paid/g18-m1.gif",  //url to outfit of sender
        k: 3,                   //on which channel
        n: "Kris Aphalon",      //sender name
        nd: "Kris Aphalon",     //sender name parsed (?)
        s: "",                  //???
        t: "cmd TEST",          //message
        ts: 1553126972.192146   //timestamp (dokładniej?)
    }
    const command = nerthus.chatCmd.fetch_cmd(ch)
    expect(command).to.be(undefined)
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

test("*map command with map url", function() {
    const command = {
        t: "*map http://MAPS.COM/MAP.PNG",
        n: ""
    }
    const ch = nerthus.chatCmd.map["map"](command)

    expect(ch).to.be.equal(false)

    //first argument - map_url
    expect(WorldEdit.changeMap[0]).to.equal("http://MAPS.COM/MAP.PNG")
    //second argument - layer
    expect(WorldEdit.changeMap[1]).to.equal(1)
})

test("*map command without map url", function() {
    const command = {
        t: "*map",
        n: ""
    }
    const ch = nerthus.chatCmd.map["map"](command)

    expect(ch).to.be.equal(false)

    //first argument - map_url
    expect(WorldEdit.changeMap[0]).to.equal("")
    //second argument - layer
    expect(WorldEdit.changeMap[1]).to.equal(1)
})

test("*addGraf command with collision", function() {
    const command = {
        t: "*addGraf 2,3,http://NPCS.COM/NPC.PNG,NPC_NAME,1",
        n: ""
    }
    const ch = nerthus.chatCmd.map["addGraf"](command)

    expect(ch).to.be.equal(false)

    //first argument - x
    expect(WorldEdit.addNpc[0]).to.equal(2)
    //second argument - y
    expect(WorldEdit.addNpc[1]).to.equal(3)
    //third argument - url
    expect(WorldEdit.addNpc[2]).to.equal("http://NPCS.COM/NPC.PNG")
    //forth argument - name
    expect(WorldEdit.addNpc[3]).to.equal("NPC_NAME")
    //fifth argument - collision
    expect(WorldEdit.addNpc[4]).to.equal(true)
})

test("*addGraf command without collision", function() {
    const command = {
        t: "*addGraf 2,3,http://NPCS.COM/NPC.PNG,NPC_NAME",
        n: ""
    }
    const ch = nerthus.chatCmd.map["addGraf"](command)

    expect(ch).to.be.equal(false)

    //first argument - x
    expect(WorldEdit.addNpc[0]).to.equal(2)
    //second argument - y
    expect(WorldEdit.addNpc[1]).to.equal(3)
    //third argument - url
    expect(WorldEdit.addNpc[2]).to.equal("http://NPCS.COM/NPC.PNG")
    //forth argument - name
    expect(WorldEdit.addNpc[3]).to.equal("NPC_NAME")
    //fifth argument - collision
    expect(WorldEdit.addNpc[4]).to.equal(false)
})

test("*addGraf command with collision set to 0", function() {
    const command = {
        t: "*addGraf 2,3,http://NPCS.COM/NPC.PNG,NPC_NAME,0",
        n: ""
    }
    const ch = nerthus.chatCmd.map["addGraf"](command)

    expect(ch).to.be.equal(false)

    //first argument - x
    expect(WorldEdit.addNpc[0]).to.equal(2)
    //second argument - y
    expect(WorldEdit.addNpc[1]).to.equal(3)
    //third argument - url
    expect(WorldEdit.addNpc[2]).to.equal("http://NPCS.COM/NPC.PNG")
    //forth argument - name
    expect(WorldEdit.addNpc[3]).to.equal("NPC_NAME")
    //fifth argument - collision
    expect(WorldEdit.addNpc[4]).to.equal(false)
})

test("*delGraf command", function() {
    const command = {
        t: "*delGraf 2,3",
        n: ""
    }
    const ch = nerthus.chatCmd.map["delGraf"](command)

    expect(ch).to.be.equal(false)

    //first argument - x
    expect(WorldEdit.deleteNpc[0]).to.equal(2)
    //second argument - y
    expect(WorldEdit.deleteNpc[1]).to.equal(3)
})

test("*light command", function() {
    const command = {
        t: "*light 0.3",
        n: ""
    }
    const ch = nerthus.chatCmd.map["light"](command)
    expect(ch).to.be.equal(false)

    //first argument - opacity
    expect(WorldEdit.changeLight).to.equal(0.7)
})

test("*light command reset to default light", function() {
    const command = {
        t: "*light",
        n: ""
    }
    const ch = nerthus.chatCmd.map["light"](command)

    expect(ch).to.be.equal(false)

    //first argument - opacity
    expect(WorldEdit.changeLight).to.equal(undefined)
})

test("*light command with ','", function() {
    const command = {
        t: "*light 0,3",
        n: ""
    }
    const ch = nerthus.chatCmd.map["light"](command)

    expect(ch).to.be.equal(false)

    //first argument - opacity
    expect(WorldEdit.changeLight).to.equal(0.7)
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

test("*nar command", function() {
    const command = {
        t: "*nar TESTING NAR",
        n: ""
    }
    const ch = nerthus.chatCmd.map["nar"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("nar")
    expect(ch.t).to.be.equal("TESTING NAR")
})

test("*nar1 command", function() {
    const command = {
        t: "*nar1 TESTING NAR1",
        n: ""
    }
    const ch = nerthus.chatCmd.map["nar1"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("nar")
    expect(ch.t).to.be.equal("TESTING NAR1")
})

test("*nar2 command", function() {
    const command = {
        t: "*nar2 TESTING NAR2",
        n: ""
    }
    const ch = nerthus.chatCmd.map["nar2"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("nar2")
    expect(ch.t).to.be.equal("TESTING NAR2")
})

test("*nar3 command", function() {
    const command = {
        t: "*nar3 TESTING NAR3",
        n: ""
    }
    const ch = nerthus.chatCmd.map["nar3"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("nar3")
    expect(ch.t).to.be.equal("TESTING NAR3")
})

test("*sys command", function() {
    const command = {
        t: "*sys TESTING SYS",
        n: ""
    }
    const ch = nerthus.chatCmd.map["sys"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("sys_comm")
    expect(ch.t).to.be.equal("TESTING SYS")
})

test("Create text with speaker", function() {
    const command = "*dialX NAME,WHAT NPC SAYS"
    const text = nerthus.chatCmd.makeDialogTextWithSpeaker(command)
    expect(text).to.equal("«NAME» WHAT NPC SAYS")
})

test("*dial command", function() {
    nerthus.chatCmd.makeDialogTextWithSpeaker = function ()
    {
        return "PARSED_DIALOG"
    }
    const command = {
        t: "*dial NAME,WHAT NPC SAYS",
        n: ""
    }
    const ch = nerthus.chatCmd.map["dial"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("dial1")
    expect(ch.t).to.be.equal("PARSED_DIALOG")
})

test("*dial1 command", function() {
    nerthus.chatCmd.makeDialogTextWithSpeaker = function ()
    {
        return "PARSED_DIALOG"
    }
    const command = {
        t: "*dial1 NAME,WHAT NPC SAYS",
        n: ""
    }
    const ch = nerthus.chatCmd.map["dial1"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("dial1")
    expect(ch.t).to.be.equal("PARSED_DIALOG")
})

test("*dial2 command", function() {
    nerthus.chatCmd.makeDialogTextWithSpeaker = function ()
    {
        return "PARSED_DIALOG"
    }
    const command = {
        t: "*dial2 NAME,WHAT NPC SAYS",
        n: ""
    }
    const ch = nerthus.chatCmd.map["dial2"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("dial2")
    expect(ch.t).to.be.equal("PARSED_DIALOG")
})

test("*dial3 command", function() {
    nerthus.chatCmd.makeDialogTextWithSpeaker = function ()
    {
        return "PARSED_DIALOG"
    }
    const command = {
        t: "*dial3 NAME,WHAT NPC SAYS",
        n: ""
    }
    const ch = nerthus.chatCmd.map["dial3"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("dial3")
    expect(ch.t).to.be.equal("PARSED_DIALOG")
})

test("*dial666 command", function() {
    nerthus.chatCmd.makeDialogTextWithSpeaker = function ()
    {
        return "PARSED_DIALOG"
    }
    const command = {
        t: "*dial666 NAME,WHAT NPC SAYS",
        n: ""
    }
    const ch = nerthus.chatCmd.map["dial666"](command)
    expect(ch.n).to.be.equal("")
    expect(ch.s).to.be.equal("dial666")
    expect(ch.t).to.be.equal("PARSED_DIALOG")
})



test("*weather command", function() {
    const command = {
        t: "*weather 7",
        n: ""
    }
    const ch = nerthus.chatCmd.map["weather"](command)

    expect(ch).to.be.equal(false)
    expect(nerthus_weather_bard_id).to.be.equal(7)
})

test("*hide command", function ()
{
    const command = {
        t: "*hide 7456",
        n: ""
    }
    const ch = nerthus.chatCmd.map["hide"](command)

    expect(ch).to.be.equal(false)
    expect(WorldEdit.hideGameNpc).to.be.equal(7456)
})

test("*hide command with map name", function ()
{
    //npc id is unique, so there is no need for distinguishing map
    const command = {
        t: "*hide 7456,6436",
        n: ""
    }
    const ch = nerthus.chatCmd.map["hide"](command)

    expect(ch).to.be.equal(false)
    expect(WorldEdit.hideGameNpc).to.be.equal(7456)
})


suite("playing cards")
beforeEach(() =>
{
    nerthus.chatCmd.cards.currentDecks = {
        52: {},
        54: {}
    }
})

test("pseudo random generates same number with same seed", () =>
{
    const number = 235325.123
    expect(nerthus.chatCmd.cards.pseudoRandom(number))
        .to.be.equal(nerthus.chatCmd.cards.pseudoRandom(number))
})

test("pseudo random generates different numbers with different seed", () =>
{
    const number = 235325.123
    const number2 = 123123123.22
    expect(nerthus.chatCmd.cards.pseudoRandom(number))
        .to.not.be.equal(nerthus.chatCmd.cards.pseudoRandom(number2))
})

test("getCard defines deck when it's not yet defined", () =>
{
    const pseudoRandom = nerthus.chatCmd.cards.pseudoRandom
    nerthus.chatCmd.cards.pseudoRandom = (number) =>
    {
        return number
    }

    const deck_type = 52
    const deck_id = 1

    nerthus.chatCmd.cards.getCard(deck_id, 1, deck_type)
    expect(nerthus.chatCmd.cards.currentDecks[deck_type][deck_id]).to.be.ok()

    nerthus.chatCmd.cards.pseudoRandom = pseudoRandom
})

test("getCard returns proper card with correct arguments", () =>
{
    const pseudoRandom = nerthus.chatCmd.cards.pseudoRandom
    nerthus.chatCmd.cards.pseudoRandom = (number) =>
    {
        return number
    }

    const deck_type = 52
    const deck_id = 1

    const card = nerthus.chatCmd.cards.getCard(deck_id, Math.random(), deck_type)
    expect(card.id).to.be.within(0, 51)
    expect(typeof card.value).to.be.equal("string")
    expect(typeof card.color).to.be.equal("string")

    nerthus.chatCmd.cards.pseudoRandom = pseudoRandom
})

test("getCard returns 52 cards proper cards in deck type 52 (depended on pseudorandom)", () =>
{
    const deck_type = 52
    const deck_id = 1

    for (let i = 0; i < deck_type; i++)
    {
        const card = nerthus.chatCmd.cards.getCard(deck_id, Math.random(), deck_type)
        console.log(card)
        expect(card.id).to.be.within(0, 51)
        expect(typeof card.value).to.be.equal("string")
        expect(typeof card.color).to.be.equal("string")
    }
})

test("getCard returns false after 52th card in deck type 52 (depended on pseudorandom)", () =>
{
    const deck_type = 52
    const deck_id = 1

    for (let i = 0; i < deck_type; i++)
        nerthus.chatCmd.cards.getCard(deck_id, Math.random(), deck_type)

    const card = nerthus.chatCmd.cards.getCard(deck_id, Math.random(), deck_type)
    expect(card).to.be.equal(false)
})

test("getCard returns 54 cards proper cards in deck type 54 (depended on pseudorandom)", () =>
{
    const deck_type = 54
    const deck_id = 1

    for (let i = 0; i < deck_type; i++)
    {
        const card = nerthus.chatCmd.cards.getCard(deck_id, Math.random(), deck_type)
        console.log(card)
        expect(card.id).to.be.within(0, 53)
        expect(typeof card.value).to.be.equal("string")
        expect(typeof card.color).to.be.equal("string")
    }
})

test("getCard returns false after 54th card in deck type 54 (depended on pseudorandom)", () =>
{
    const deck_type = 54
    const deck_id = 1

    for (let i = 0; i < deck_type; i++)
        nerthus.chatCmd.cards.getCard(deck_id, Math.random(), deck_type)

    const card = nerthus.chatCmd.cards.getCard(deck_id, Math.random(), deck_type)
    expect(card).to.be.equal(false)
})

test("*draw command does not execute getDrawnCards when it is on chat other than global", () =>
{
    let drawnCardsExecuted = false
    const getDrawnCards = nerthus.chatCmd.getDrawnCards
    nerthus.chatCmd.cards.getDrawnCards = function ()
    {
        drawnCardsExecuted = true
        return "PARSED"
    }
    const command = {
        t: "*draw 1",
        n: "",
        k: 1
    }
    const ch = nerthus.chatCmd.public_map["draw"](command)
    expect(ch.t).to.not.be.equal("PARSED")
    expect(drawnCardsExecuted).to.be.equal(false)

    nerthus.chatCmd.getDrawnCards = getDrawnCards
})

test("*draw command executes getDrawnCards with proper attributes", () =>
{
    let drawnCardsExecuted = []
    const getDrawnCards = nerthus.chatCmd.getDrawnCards
    nerthus.chatCmd.cards.getDrawnCards = function (number_of_cards, deck_number, deck_type, ts, nick)
    {
        drawnCardsExecuted = [number_of_cards, deck_number, deck_type, ts, nick]
        return "PARSED"
    }
    const nick = "NICK"
    const ts = 123456.123
    const command = {
        t: "*draw 3,5,52",
        n: nick,
        k: 0,
        ts: ts
    }
    const ch = nerthus.chatCmd.public_map["draw"](command)
    expect(drawnCardsExecuted[0]).to.be.equal(3)
    expect(drawnCardsExecuted[1]).to.be.equal(5)
    expect(drawnCardsExecuted[2]).to.be.equal(52)
    expect(drawnCardsExecuted[3]).to.be.equal(ts)
    expect(drawnCardsExecuted[4]).to.be.equal(nick)

    nerthus.chatCmd.getDrawnCards = getDrawnCards
})

test("*draw command executes getDrawnCards with proper attributes, even when there are spaces in command", () =>
{
    let drawnCardsExecuted = []
    const getDrawnCards = nerthus.chatCmd.getDrawnCards
    nerthus.chatCmd.cards.getDrawnCards = function (number_of_cards, deck_number, deck_type, ts, nick)
    {
        drawnCardsExecuted = [number_of_cards, deck_number, deck_type, ts, nick]
        return "PARSED"
    }
    const nick = "NICK"
    const ts = 123456.123
    const command = {
        t: "*draw 3, 5, 52",
        n: nick,
        k: 0,
        ts: ts
    }
    const ch = nerthus.chatCmd.public_map["draw"](command)
    expect(drawnCardsExecuted[0]).to.be.equal(3)
    expect(drawnCardsExecuted[1]).to.be.equal(5)
    expect(drawnCardsExecuted[2]).to.be.equal(52)
    expect(drawnCardsExecuted[3]).to.be.equal(ts)
    expect(drawnCardsExecuted[4]).to.be.equal(nick)

    nerthus.chatCmd.getDrawnCards = getDrawnCards
})
