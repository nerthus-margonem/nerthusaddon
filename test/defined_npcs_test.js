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
/*
    var readFiles = function(dirname, onFileContent, onError, done)
    {
        fs.readdir(dirname, function(err, filenames)
        {
            if (err)
                return onError(err, dirname);
            filenames.forEach(function(filename)
            {
                var file = path.join(dirname, filename)
                fs.readFile(file, 'utf-8', function(err, content)
                {
                    if (err)
                      return onError(err, file);
                    onFileContent(filename, content);
                });
            });
            done()
        });
    }

    var onError = function(err, where)
    {
        done("An error occured during reading: " + where + ", error: " + err)
    }
    var onFile = function(filename, content)
    {
        try
        {
            console.log("checking file: " + filename)
            var npcs = JSON.parse(content)
            for(i in npcs)
                console.log(npcs[i].name)
        }
        catch(e)
        {
            done("An error occured during reading: " + filename + ", error: " + err)
        }
    }

    var dupa = readFiles("./npcs", onFile, onError, done)
*/
})
