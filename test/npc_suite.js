suite("npc")

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
    NPC.name = "Roan"
    NPC.x = 8
    NPC.y = 4
    NPC.dialog =
    {
        0 :
        [
            "Hej wam!",
            "A no Hej",
            "Elo"
        ],
        1 :
        [
            "A jakoś leci",
            "a tak sobie... ->2",
            "dobrze ->END"
        ]
    }

    dialog = nerthus.npc.dialog

})

test("message shall includes npc name and first dialog from given index", function()
{
    const INDEX = 0
    const message = dialog.message(NPC,INDEX)
    expect(message).to.contain(NPC.name)
    expect(message).to.contain(NPC.dialog[INDEX][0])
})

test("npc name in message shall be decorated by <h4>", function()
{
    const INDEX = 0
    const message = dialog.message(NPC,INDEX)
    expect(message).to.contain("<h4>" + NPC.name + "</h4>")
})

test("replies shall includes dialogs from given index expect first one, first is message", function()
{
    const INDEX = 0
    const replies = dialog.replies(NPC,INDEX)
    expect(replies).to.have.length(2)
    expect(replies[0]).to.contain(NPC.dialog[INDEX][1])
    expect(replies[1]).to.contain(NPC.dialog[INDEX][2])
})

test("replies shall be decorated by <li>", function()
{
    const INDEX = 0
    const replies = dialog.replies(NPC,INDEX)
    const is_decorated = /^<li>.*<\/li>/
    expect(replies[0]).to.match(is_decorated)
    expect(replies[1]).to.match(is_decorated)
})

test("replies shall not contains arrows (->)", function()
{
    const INDEX = 1
    const replies = dialog.replies(NPC,INDEX)
    const ARROW = "->"

    expect(NPC.dialog[INDEX][1]).to.contain(ARROW)
    expect(NPC.dialog[INDEX][2]).to.contain(ARROW)
    expect(replies).to.have.length(2)
    expect(replies[0]).to.not.contain(ARROW)
    expect(replies[1]).to.not.contain(ARROW)
})

test("replies with ->END shall has LINE_EXIT class", function()
{
    const INDEX = 1
    const replies = dialog.replies(NPC,INDEX)
    const END_MARKER = "->END"

    expect(NPC.dialog[INDEX][2]).to.contain(END_MARKER)
    expect( $(replies[1]).hasClass(dialog.decorator.classes.EXIT) ).ok()
    expect( $(replies[1]).hasClass(dialog.decorator.classes.ICON) ).ok()
})

test("replies with ->$LINE shall has LINE_OPTION class", function()
{
    const INDEX = 1
    const replies = dialog.replies(NPC,INDEX)
    const GO_TO_LINE_MARKER = /->\d+/

    expect(NPC.dialog[INDEX][1]).to.match(GO_TO_LINE_MARKER)
    expect( $(replies[0]).hasClass(dialog.decorator.classes.LINE) ).ok()
    expect( $(replies[0]).hasClass(dialog.decorator.classes.ICON) ).ok()
})
