suite("Weather", function ()
{
    const expect = require("expect.js")
    suiteSetup(function ()
    {
        nerthus = {}
        nerthus.defer = function ()
        {
        }
        nerthus.options = {}


        require("../NN_pogoda.js")
    })

    test("dummy", function ()
    {
    })
})
