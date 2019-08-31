suite("defs", function ()
{
    const expect = require("expect.js")
    suiteSetup(function ()
    {
        log = function (msg)
        {
            console.log(msg)
        }

        nerthus = {
            addon: {
                fileUrl: function ()
                {
                }
            }
        }

        g = {}
        g.names = {}
        g.names.ranks = []

        require("../NN_dlaRadnych.js")
    })


    test("Proper rank names count on SI", function ()
    {
        nerthus.ranks.start()
        expect(g.names.ranks.length).to.be.greaterThan(7)
    })

    test("Proper rank names count on NI", function ()
    {
        nerthus.ranks.start_ni()
        expect(nerthus.ranks.rankName.length).to.be.greaterThan(7)
    })

})
