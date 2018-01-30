beforeEach(function(){

    localStorage = {}
    log = function(){}
    bot = require("../NN_start.js").bot
    expect = require("./expect.js")
})

suite("start")

test("dummy", function(){
    var dummy = true
    expect(dummy).to.be.ok()
})
