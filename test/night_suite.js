suite("night")

before(function()
{
    nerthus = {}
    nerthus.options = {}
    nerthus.addon = {}
    nerthus.addon.fileUrl = function(){}
    nerthus.defer = function(){}
    nerthus.lightDrawList = []
    setTimeout = function(a){eval(a)}
    Engine = {
        map: {
            d: {},
            gateways: {
                getDrawableItems: function(){}
            }
        }
    }
    API = {
        addCallbackToEvent: Function.prototype
    }
    map = {
        mainid: 0
    }

    expect = require("expect.js")
    require("../NN_night.js")
})

test("Light when map is outdoor one - NI", function ()
{
    Engine.map.d.mainid = 0
    nerthus.night.dim_ni(0.4)
    expect(nerthus.night.dimValue).to.be.equal(0.4)
})

test("Light when map is indoor one - NI", function ()
{
    Engine.map.d.mainid = 1
    nerthus.night.dim_ni(0.4)
    expect(nerthus.night.dimValue).to.be.equal(0)
})
