
minimal_npc = function(name="Stefan", x=8, y=42, url="")
{
    return { "name" : name, "x" : x, "y" : y, "url" : url}
}

before(function()
{
    log = function(msg){console.log(msg)}
    nerthus = {}
    nerthus.defer = function(){}
    nerthus.addon = {}
    nerthus.addon.PREFIX = "NERTH_PREFIX:"
    nerthus.addon.fileUrl = function(url){return this.PREFIX + url}

    expect = require("expect.js")
    require("../NN_npc.js")

    var jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const { window } = new JSDOM();
    const { document } = (new JSDOM('')).window;
    global.document = document;
    $ = require("jquery")(window)
    $.fn.load = function(){} //load stub

    g = {}
    g.npccol = {} //npc colision set
    g.lock = { //lock mock
        lock : null,
        add : function(lock){this.lock = lock},
        remove : function(){this.lock = null}
    }

    NPC = minimal_npc("Kici")
    NPC.x = 8
    NPC.y = 4
    NPC.url = "http://game1.margonem.pl/obrazki/itemy/eve/ka-kotek.gif"
    NPC.dialog =
    {
        "0" : //Simple dialog
        [
            "Hej wam!",
            "A no Hej",
            "Elo"
        ],
        "1" : //normal dialog
        [
            "A jakoś leci",
            "a tak sobie... ->2",
            "dobrze ->END"
        ],
        "2" : //normal dialog
        [
            "To już koniec",
            "a no konie ->END"
        ],
        "3" : //placeholder #NAME
        [
            "Witaj #NAME dawno cie nie widaiłem",
            "Ja #NAME mam wiele obowiązków"
        ]

    }

    dialog = nerthus.npc.dialog

    //dialog object
    $("<div>").attr("id","dialog")
    .append($("<div>").attr("id","dlgin")
            .append($("<div>").attr("id","message").addClass("message"))
            .append($("<div>").attr("id","replies").addClass("replies")))
    .appendTo("body")

    //base object
    $("<div>").attr("id","base").appendTo("body")

})

suite("npc dialog parse message")

test("message shall includes first dialog from given index", function()
{
    const INDEX = 0
    const message = dialog.parse_message(NPC,INDEX)
    expect(message).to.contain(NPC.dialog[INDEX][0])
})

suite("npc dialog parse replies")

test("replies shall includes dialogs from given index expect first one, first is message", function()
{
    const INDEX = 0
    const replies = dialog.parse_replies(NPC,INDEX)

    expect(replies).to.have.length(2)

    expect(replies[0].text).to.contain(NPC.dialog[INDEX][1])
    expect(replies[0].click).to.not.ok()
    expect(replies[0].icon).to.not.ok()

    expect(replies[1].text).to.contain(NPC.dialog[INDEX][2])
    expect(replies[1].click).to.not.ok()
    expect(replies[1].icon).to.not.ok()
})

test("replies shall not contains arrows (->)", function()
{
    const INDEX = 1
    const replies = dialog.parse_replies(NPC,INDEX)
    const ARROW = "->"

    expect(NPC.dialog[INDEX][1]).to.contain(ARROW)
    expect(NPC.dialog[INDEX][2]).to.contain(ARROW)

    expect(replies).to.have.length(2)
    expect(replies[0].text).to.not.contain(ARROW)
    expect(replies[1].text).to.not.contain(ARROW)
})

test("replies with ->END shall has LINE_EXIT class and click handler", function()
{
    const INDEX = 1
    const replies = dialog.parse_replies(NPC,INDEX)
    const END_MARKER = "->END"

    expect(NPC.dialog[INDEX][2]).to.contain(END_MARKER)

    expect(replies[1].icon).to.be(dialog.decorator.classes.EXIT)
    expect(replies[1].click).to.be.ok()
})

test("replies with ->$LINE shall has LINE_OPTION class and click handler", function()
{
    const INDEX = 1
    const replies = dialog.parse_replies(NPC,INDEX)
    const GO_TO_LINE_MARKER = /->\d+/

    expect(NPC.dialog[INDEX][1]).to.match(GO_TO_LINE_MARKER)

    expect(replies[0].icon).to.be(dialog.decorator.classes.LINE)
    expect(replies[0].click).to.be.ok()
})

suite("npc dialog placeholders")

test("placeholder #NAME is replace by hero.nick", function()
{
    const INDEX = 3
    const NICK = "Karyna"
    hero = {nick : NICK}

    const replies = dialog.parse_replies(NPC,INDEX)
    const message = dialog.parse_message(NPC,INDEX)

    expect(NPC.dialog[INDEX][0]).to.contain("#NAME")
    expect(NPC.dialog[INDEX][1]).to.contain("#NAME")

    expect(message).to.not.contain("#NAME")
    expect(message).to.contain(NICK)

    expect(replies[0].text).to.not.contain("#NAME")
    expect(replies[0].text).to.contain(NICK)
})

suite("npc dialog API")

beforeEach(function()
{
    $("#body").empty()
    $("#base").empty()
    $(".message").empty()
    $(".replies").empty()
})

test("open dialog display dialog from given index", function()
{
    const INDEX = 0
    dialog.open(NPC,INDEX)

    expect($("#dialog #dlgin .message").html()).to.contain(NPC.name)
    expect($("#dialog #dlgin .message").html()).to.contain(NPC.dialog[INDEX][0])

    expect($("#dialog #dlgin .replies").html()).to.contain(NPC.dialog[INDEX][1])
    expect($("#dialog #dlgin .replies").html()).to.contain(NPC.dialog[INDEX][2])
})

test("reply with ->$LINE go to next dialog", function()
{
    const BEGIN_INDEX = 1
    const NEXT_INDEX = 2
    dialog.open(NPC,BEGIN_INDEX)

    expect($("#dialog #dlgin .message").html()).to.contain(NPC.name)
    expect($("#dialog #dlgin .message").html()).to.contain(NPC.dialog[BEGIN_INDEX][0])

    $("#dialog #dlgin .replies li")[0].click() // dialog[1][1] go to dialog 2
    expect($("#dialog #dlgin .message").html()).to.contain(NPC.name)
    expect($("#dialog #dlgin .message").html()).to.contain(NPC.dialog[NEXT_INDEX][0])
})

test("reply with ->END close dialog", function()
{
    const INDEX = 1
    dialog.open(NPC,INDEX)

    expect($("#dialog #dlgin .message").html()).to.contain(NPC.name)
    expect($("#dialog #dlgin .message").html()).to.contain(NPC.dialog[INDEX][0])

    expect($("#dialog").css("display")).to.be("block")

    $("#dialog #dlgin .replies li")[1].click() //dialog[1][2] go to END

    expect($("#dialog").css("display")).to.be("none")
})

test("dialog.open lock game, dialog.close unlock game", function()
{
    expect(g.lock.lock).not.ok()

    dialog.open(NPC,0)
    expect(g.lock.lock).ok()

    dialog.close()
    expect(g.lock.lock).not.ok()
})

suite("npc deployment")

beforeEach(function()
{
    $("#body").empty()
    $("#base").empty()
    $(".message").empty()
    $(".replies").empty()
})

test("deployed npc is added to #base", function()
{
    expect($("#base").children()).empty()

    nerthus.npc.deploy(NPC)

    expect($("#base").children()).not.empty()
    expect($("#base").children().hasClass("nerthus_npc")).ok()
})

test("npc has tip same as name", function()
{
    nerthus.npc.deploy(NPC)
    expect($("#base").children().attr("tip")).to.contain(NPC.name)
})

test("simple npc has no collision", function()
{
    var npc = minimal_npc()
    nerthus.npc.deploy(npc)

    expect(npc.collision).not.ok()
    expect(g.npccol).empty()
})

test("npc with collision", function()
{
    var npc = minimal_npc()
    npc.collision = true
    nerthus.npc.deploy(npc)

    expect(npc.collision).ok()
    expect(g.npccol[npc.x + 256 * npc.y]).ok()
})

test("npc with normal url", function()
{
    var npc = minimal_npc()
    npc.url = "http://img.gif"
    nerthus.npc.deploy(npc)

    expect($("#base").children().attr("src")).to.be.equal(npc.url)
})

test("npc with url starting with # should be resolved as url pointing to local addon path", function()
{
    const URL = "/img/npc/sir.gif"
    var npc = minimal_npc()
    npc.url = "#" + URL
    nerthus.npc.deploy(npc)

    expect($("#base").children().attr("src")).to.be(nerthus.addon.PREFIX + URL)
})

