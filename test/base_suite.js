suite("Base")

before(function()
{
    log = function(msg){console.log(msg)}

    nerthus = {}
    nerthus.addon = {}
    nerthus.addon.store = function(){}

    g = {}
    g.chat = {}
    g.chat.txt = []
    g.loadQueue = []
    g.tips = {}
    g.tips.npc = function(){}
    hero = {}
    chatScroll = function(){}
    _message = null
    message = function(m){_message = m}

    jqObjMock = {}
    jqObjMock.hasClass = function(){}
    jqObjMock.html = function(){}
    jqObjMock.attr = function(){}
    $ = function (){return jqObjMock}

    expect = require("expect.js")
    require("../NN_base.js")
})

beforeEach(function()
{
    g.loadQueue = []
    g.chat.txt = []
    nerthus.NerthusRad = []
})

test("defer a functio", function()
{
    var foo = function(){}
    nerthus.defer(foo)

    expect(g.loadQueue).to.have.length(1)
    expect(g.loadQueue[0].fun).to.be.equal(foo)
})

test("defer a functio with args", function()
{
    var foo = function(){}
    var foo_args = 42
    nerthus.defer(foo, foo_args)

    expect(g.loadQueue).to.have.length(1)
    expect(g.loadQueue[0].fun).to.be.equal(foo)
    expect(g.loadQueue[0].data).to.be.equal(foo_args)
})

test("defer a non function arg throw error", function()
{
    expect(nerthus.defer).withArgs("invalid arg").to.throwException()
})

test("has sepcial privilege" , function()
{
    var RADNY = "radny"
    var SPEC = "specialny"
    var NARR = "narrator"
    var DUMMY = "dummy"
    nerthus.NerthusRad = [RADNY]
    nerthus.NerthusSpec = [SPEC]
    nerthus.NerthusNarr = [NARR]

    expect(nerthus.isRad(RADNY)).to.be.ok()
    expect(nerthus.isSpec(SPEC)).to.be.ok()
    expect(nerthus.isNarr(NARR)).to.be.ok()

    expect(nerthus.isRad(DUMMY)).to.not.be.ok()
    expect(nerthus.isSpec(DUMMY)).to.not.be.ok()
    expect(nerthus.isNarr(DUMMY)).to.not.be.ok()
})

test("season", function()
{
    var seasons = { SPRING : 1, SUMMER : 2, AUTUMN : 3, WINTER : 4 }
    var _date = Date

    var setDate = function(day, month)
    {
        Date = function()
        {
            var date = new _date(0)
            date.setUTCDate(day)
            date.setUTCMonth(month-1)
            return date
        }
    }

    var expectSeasonToBeBetween = function(season, begin, end)
    {
        setDate(begin.day, begin.month)
        expect(nerthus.season()).to.be(season)
        setDate(end.day, end.month)
        expect(nerthus.season()).to.be(season)
    }

    //SPRING <21.3-22.6)
    expectSeasonToBeBetween(seasons.SPRING,{day:21,month:3},{day:20,month:6}) //bug should be 21.6

    //SUMMER <22.6-23.9)
    expectSeasonToBeBetween(seasons.SUMMER,{day:22,month:6},{day:22,month:9})

    //AUTUMN <23.9-22.12) // -22.11 ..
    expectSeasonToBeBetween(seasons.AUTUMN,{day:23,month:9},{day:21,month:11})

    //WINTER <22.12-21.3) // 22.11 - .. let it snow a bit longer :D
    expectSeasonToBeBetween(seasons.WINTER,{day:22,month:11},{day:20,month:3})

    Date = _date
})

test("setChatInfo : info not present", function()
{
    nerthus.chatInfoStr = ""
    nerthus.setChatInfo()
    expect(g.chat.txt).to.be.empty()
})

test("setChatInfo : info present", function()
{
    nerthus.chatInfoStr = "INFO"
    nerthus.setChatInfo()
    expect(g.chat.txt).to.have.length(1)
    expect(g.chat.txt[0]).to.contain(nerthus.chatInfoStr)
})

test("setEnterMsg : msg not present", function()
{
    nerthus.EnterMsg = ""
    nerthus.setEnterMsg()
    expect(_message).to.not.be.ok()
})

test("setEnterMsg : msg present", function()
{
    nerthus.EnterMsg = "MSG"
    nerthus.setEnterMsg()
    expect(_message).to.be.equal(nerthus.EnterMsg)
})

test("stor and load settions", function()
{
    var opt = {op1:true, op2:false, op3:"Hmm"}
    nerthus.storeSettings(opt)

    expect(nerthus.options.op1).to.be.equal(opt.op1)
    expect(nerthus.options.op2).to.be.equal(opt.op2)
    expect(nerthus.options.op3).to.be.equal(opt.op3)

    nerthus.options = {}

    nerthus.loadSettings()

    expect(nerthus.options.op1).to.be.equal(opt.op1)
    expect(nerthus.options.op2).to.be.equal(opt.op2)
    expect(nerthus.options.op3).to.be.equal(opt.op3)
})
