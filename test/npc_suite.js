suite("npc")

before(function()
{
    log = function(msg){console.log(msg)}
    nerthus = {}

    expect = require("expect.js")
    require("../NN_npc.js")

    NPC = {}
    NPC.name = "Roan"
    NPC.x = 8
    NPC.y = 4
    NPC.dialog =
    {
        0 :
        [
            "Hej wam!",
            "co tam? ->1",
            "cześć ci ->END"
        ],
        1 :
        [
            "A jakoś leci",
            "a to ok ->END"
        ]
    }

    dialog = nerthus.npc.dialog

})

test("message shall includes npc name and first dialog from given index", function()
{
    var INDEX = 0
    var message = dialog.message(NPC,INDEX)
    expect(message).to.contain(NPC.name)
    expect(message).to.contain(NPC.dialog[INDEX][0])
})

test("replies shall includes dialogs from given index expect first one, first is message", function()
{
    var INDEX = 0
    var replies = dialog.replies(NPC,INDEX)
    expect(replies).to.not.contain(NPC.dialog[INDEX][0])
    expect(replies).to.contain(NPC.dialog[INDEX][1])
    expect(replies).to.contain(NPC.dialog[INDEX][2])
})
