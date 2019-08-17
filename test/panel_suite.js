suite("panel")

before(function()
{
    nerthus = {}
    nerthus.defer = function(){}



    expect = require("expect.js")
    require("../NN_panel.js")

    nerthus.panel.settings_translations = {
        "translate": "przetłumaczony"
    }
})

test("dummy", function()
{
})

test("translate",() =>{
    expect(nerthus.panel.translate_option("translate")).to.equal("przetłumaczony")
})

test("translate untranslatable",() =>{
    expect(nerthus.panel.translate_option("untranslatable")).to.equal("untranslatable")
})
