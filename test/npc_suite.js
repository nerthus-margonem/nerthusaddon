
before(function()
{
    log = function(msg){console.log(msg)}
    nerthus = {}

    expect = require("expect.js")
    require("../NN_npc.js")

    var jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const { window } = new JSDOM();
    const { document } = (new JSDOM('')).window;
    global.document = document;
    $ = require("jquery")(window)

    NPC = {}
    NPC.name = "Kicia"
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

    $dialog = $("<div>").attr("id","dialog")
    .append($("<div>").attr("id","dlgin")
            .append($("<div>").attr("id","message").addClass("message"))
            .append($("<div>").attr("id","replies").addClass("replies")))
    .appendTo("body")

})

suite("npc dialog parse message")

test("message shall includes first dialog from given index", function()
{
    const INDEX = 0
    const message = dialog.parse.message(NPC,INDEX)
    expect(message).to.contain(NPC.dialog[INDEX][0])
})

suite("npc dialog parse replies")

test("replies shall includes dialogs from given index expect first one, first is message", function()
{
    const INDEX = 0
    const replies = dialog.parse.replies(NPC,INDEX)

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
    const replies = dialog.parse.replies(NPC,INDEX)
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
    const replies = dialog.parse.replies(NPC,INDEX)
    const END_MARKER = "->END"

    expect(NPC.dialog[INDEX][2]).to.contain(END_MARKER)

    expect(replies[1].icon).to.be(dialog.decorator.classes.EXIT)
    expect(replies[1].click).to.be.ok()
})

test("replies with ->$LINE shall has LINE_OPTION class and click handler", function()
{
    const INDEX = 1
    const replies = dialog.parse.replies(NPC,INDEX)
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

    const replies = dialog.parse.replies(NPC,INDEX)
    const message = dialog.parse.message(NPC,INDEX)

    expect(NPC.dialog[INDEX][0]).to.contain("#NAME")
    expect(NPC.dialog[INDEX][1]).to.contain("#NAME")

    expect(message).to.not.contain("#NAME")
    expect(message).to.contain(NICK)

    expect(replies[0].text).to.not.contain("#NAME")
    expect(replies[0].text).to.contain(NICK)
})

suite("npc dialog API")

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
