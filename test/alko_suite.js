suite("Alko")

before(function ()
{
    msg = "THIS IS, the test message. It has interpunction and varying size of letters."

    nerthus = {}
    nerthus.defer = function ()
    {
    }


    localStorage = {}
    chatSendMsg = function ()
    {
    }
    _g = {}

    //expect = require("expect.js")
    require("../NN_alko.js")
})

after(function ()
{
    delete msg
    delete nerthus
    delete localStorage
    delete chatSendMsg
    delete _g
    delete expect
    //delete require
})

test("dummy", function ()
{
})

suite("Alko - shuffleMessage")

before(function ()
{
    msg = "THIS IS, the test message. It has interpunction and varying size of letters."
    SHUFFLE = []


    nerthus = {}

    expect = require("expect.js")
    let e = require("../NN_alko.js")
    console.log(e)
    console.log(nerthus)
    nerthus.alko.shuffleArray = function (array, cc)
    {
        SHUFFLE.push([array,cc])
        return array
    }
})

after(function ()
{
    delete msg
    delete nerthus
    delete expect
})
test("lvl 100", function ()
{

    nerthus.alko.lvl = 100

    let returnValue = nerthus.alko.shuffleMessage(msg)
    expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
})

test("90 < lvl < 100", function ()
{
    nerthus.alko.lvl = 91
    for (; nerthus.alko.lvl < 100; nerthus.alko.lvl++)
    {
        let returnValue = nerthus.alko.shuffleMessage(msg)
        expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
    }
})

test("80 < lvl < 90", function ()
{
    nerthus.alko.lvl = 81
    for (; nerthus.alko.lvl < 90; nerthus.alko.lvl++)
    {
        let returnValue = nerthus.alko.shuffleMessage(msg)
        expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
    }
})

test("70 < lvl < 80", function ()
{
    nerthus.alko.lvl = 71
    for (; nerthus.alko.lvl < 80; nerthus.alko.lvl++)
    {
        let returnValue = nerthus.alko.shuffleMessage(msg)
        expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
    }
})

test("60 < lvl < 70", function ()
{
    nerthus.alko.lvl = 61
    for (; nerthus.alko.lvl < 70; nerthus.alko.lvl++)
    {
        let returnValue = nerthus.alko.shuffleMessage(msg)
        expect(returnValue).to.equal("/me bełkota coś niezrozumiale.")
    }
})
