suite("user defined NPC check")

test("read npcs from files", function()
{
    var expect = require("expect.js")
    var fs = require('fs')
    var path = require('path')
    const NPC_DIR = "./npcs"

    var files = fs.readdirSync(NPC_DIR)
    files.forEach(filename =>
    {
        let file = fs.readFileSync(path.join(NPC_DIR, filename))
        try
        {
            let npcs = JSON.parse(file)
            console.log(filename + " contains " + npcs.length + " npcs: " + npcs.map(npc => npc.name).join(","))
        }
        catch(e)
        {
            expect().fail(filename + " is invalid: " + e)
        }
    })
})
