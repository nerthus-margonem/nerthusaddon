suite("user defined NPC check", function ()
{
    if(typeof nerthus !== "undefined")
        console.log(nerthus)
    else
        console.log("No nerthus!")
    const expect = require("expect.js")
    const fs = require('fs')
    const path = require('path')
    const NPC_DIR = "./npcs"

    function checkNpc(npc)
    {
        try
        {
            expect(npc).to.be.an(typeof ({}))

            expect(npc).to.have.property("name")
            expect(npc.name).to.be.a("string")

            expect(npc).to.have.property("x")
            expect(npc.x).to.match(/^\d+$/)

            expect(npc).to.have.property("y")
            expect(npc.y).to.match(/^\d+$/)

            expect(npc).to.have.property("url")

            if (npc.hasOwnProperty("time"))
                expect(npc.time).to.match(/^[0-9]+(:[0-9]+)?-[0-9]+(:[0-9]+)?$/)

            if (npc.hasOwnProperty("days"))
                expect(npc.days).to.be.an("object")

            if (npc.hasOwnProperty("date"))
                expect(npc.date).to.match(/^[0-9]+(\.[0-9]+){0,2}-[0-9]+(\.[0-9]+){0,2}$/)

            if (npc.hasOwnProperty("dialog"))
                checkDialog(npc.dialog)
        } catch (e)
        {
            e.message = "npc name " + npc.name + " : " + e.message
            throw e
        }
    }

    function checkDialog(dialog)
    {
        expect(dialog).to.be.an("object")
        expect(dialog).to.have.property("0")
        for (const i in dialog)
            checkDialogSet(dialog[i])
    }

    function checkDialogSet(dialog)
    {
        expect(dialog).to.be.an("object")
        expect(dialog.length).to.be.greaterThan(1)
        for (const i in dialog)
        {
            expect(dialog[i]).to.be.a("string")
            const HAS_GO_TO_ON_END = /(->END|->[0-9]+)$/
            if (i === "0") //nps text
                expect(dialog[i]).to.not.match(HAS_GO_TO_ON_END)
            if (parseInt(i) > 0) //answer
                expect(dialog[i]).to.match(HAS_GO_TO_ON_END)
        }

    }

    function checkFileWithNpcs(filename)
    {
        const file = fs.readFileSync(path.join(NPC_DIR, filename))
        const npcs = JSON.parse(file)
        expect(npcs).to.be.an("object")
        npcs.forEach(npc => checkNpc(npc))
    }

    const files = fs.readdirSync(NPC_DIR)
    files.forEach(filename => test("check map " + filename, () => checkFileWithNpcs(filename)))
})
