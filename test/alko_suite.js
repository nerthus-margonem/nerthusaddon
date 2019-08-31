suite("Alcohol", function ()
{
    if(typeof nerthus !== "undefined")
        console.log(nerthus)
    else
        console.log("No nerthus!")
    const expect = require("expect.js")
    suiteSetup(function ()
    {
        msg = "THIS IS, the test message. It has interpunction and varying size of letters."
        SHUFFLE = []

        nerthus = {}

        require("../NN_alko.js")
        nerthus.alko.shuffleArray = function (array, cc)
        {
            SHUFFLE.push([array, cc])
            return array
        }
    })

    test("dummy", function ()
    {
    })

    test("lvl 100", function ()
    {
        nerthus.alko.lvl = 100

        let returnValue = nerthus.alko.shuffleMessage(msg)
        expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
    })

    test("90 < lvl < 100", function ()
    {
        for (nerthus.alko.lvl = 91; nerthus.alko.lvl < 100; nerthus.alko.lvl++)
        {
            const returnValue = nerthus.alko.shuffleMessage(msg)
            expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
        }
    })

    /*
    test("80 < lvl < 90", function ()
    {
        for (nerthus.alko.lvl = 81; nerthus.alko.lvl < 90; nerthus.alko.lvl++)
        {
            let returnValue = nerthus.alko.shuffleMessage(msg)
            expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
        }
    })

    test("70 < lvl < 80", function ()
    {
        for (nerthus.alko.lvl = 71; nerthus.alko.lvl < 80; nerthus.alko.lvl++)
        {
            let returnValue = nerthus.alko.shuffleMessage(msg)
            expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
        }
    })

    test("60 < lvl < 70", function ()
    {
        for (nerthus.alko.lvl = 61; nerthus.alko.lvl < 70; nerthus.alko.lvl++)
        {
            let returnValue = nerthus.alko.shuffleMessage(msg)
            expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
        }
    })
    */
})

