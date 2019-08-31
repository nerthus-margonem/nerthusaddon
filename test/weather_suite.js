suite("Weather", function ()
{
    if(typeof nerthus !== "undefined")
        console.log(nerthus)
    else
        console.log("No nerthus!")
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
