suite("user defined NPC check")

let expect = require("expect.js")
let fs = require('fs')
let path = require('path')
const NPC_DIR = "./npcs"

let checkNpc = function(npc)
{
    try
    {
        expect(npc).to.be.an(typeof({}))

        expect(npc).to.have.property("name")
        expect(npc.name).to.be.a(typeof("string"))

        expect(npc).to.have.property("x")
        expect(npc.x).to.match(/^\d+$/)

        expect(npc).to.have.property("y")
        expect(npc.y).to.match(/^\d+$/)

        expect(npc).to.have.property("url")

        if(npc.hasOwnProperty("time"))
            expect(npc.time).to.match(/^[0-9]+(:[0-9]+){0,1}-[0-9]+(:[0-9]+){0,1}$/)

        if(npc.hasOwnProperty("days"))
            expect(npc.days).to.be.an(typeof([]))

        if(npc.hasOwnProperty("date"))
            expect(npc.date).to.match(/^[0-9]+(\.[0-9]+){0,2}-[0-9]+(\.[0-9]+){0,2}$/)

        if(npc.hasOwnProperty("dialog"))
            checkDialog(npc.dialog)
    }
    catch(e)
    {
        e.message = "npc name " + npc.name + " : " + e.message
        throw e
    }
}

let checkDialog = function(dialog)
{
    expect(dialog).to.be.a(typeof({}))
    expect(dialog).to.have.property("0")
    for(let i in dialog)
    {
        checkDialogSet(dialog[i])
    }
}

let checkDialogSet = function(dialog)
{
    expect(dialog).to.be.an(typeof([]))
    expect(dialog.length).to.be.greaterThan(1)
    for(let i in dialog)
    {
        expect(dialog[i]).to.be.a(typeof(""))
        const HAS_GO_TO_ON_END = /(->END|->[0-9]+)$/
        if(i == 0) //nps text
            expect(dialog[i]).to.not.match(HAS_GO_TO_ON_END)
        if(i > 0) //answer
            expect(dialog[i]).to.match(HAS_GO_TO_ON_END)
    }

}

let checkFileWithNpcs = function(filename)
{
    let file = fs.readFileSync(path.join(NPC_DIR, filename))
    let npcs = JSON.parse(file)
    expect(npcs).to.be.an(typeof([]))
    npcs.forEach(npc => checkNpc(npc))
}

let files = fs.readdirSync(NPC_DIR)
files.forEach(filename => test("check map " + filename, () => checkFileWithNpcs(filename)))
