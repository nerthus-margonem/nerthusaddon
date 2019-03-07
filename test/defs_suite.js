suite("defs")

before(function()
{
    log = function(msg){console.log(msg)}

    nerthus = {
        addon : { fileUrl : function(){} }
    }

    g = {}
    g.names = {}
    g.names.ranks = []
    expect = require("expect.js")
    require("../NN_dlaRadnych.js")

})

test("dummy", function()
{
})

