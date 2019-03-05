
suite("maps")

before(function()
{
    this.SEASON = 1
    this.ANY_SEASON = 0
    this.MAP_ID = 42
    this.MAP_URL = "some_url"
    this.DEFERRED = []

    map = {id : this.MAP_ID}

    nerthus = {}
    nerthus.defer = function(func){this.DEFERRED.push(func)}.bind(this)
    nerthus.season = function(){return this.SEASON}.bind(this)

    expect = require("expect.js")
    require("../NN_maps.js")

    var jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const { window } = new JSDOM();
    const { document } = (new JSDOM('')).window;
    global.document = document;
    $ = require("jquery")(window)

    $("<div>").attr("id","ground").appendTo("body")
})

beforeEach(function()
{
    nerthus.mapsArr = []
    this.DEFERRED = []
    $("#ground").css("backgroundImage", "")
})

test("No maps defined", function()
{
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).empty()
})

test("Maps with matching id and season is defined", function()
{
    nerthus.mapsArr = [[this.SEASON, this.MAP_ID, this.MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).to.contain(this.MAP_URL)
})

test("Maps with matching id and any season is defined", function()
{
    nerthus.mapsArr = [[this.ANY_SEASON, this.MAP_ID, this.MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).to.contain(this.MAP_URL)
})

test("Maps with not matching season is defined", function()
{
    const OTHER_SEASON = this.SEASON + 1
    nerthus.mapsArr = [[OTHER_SEASON, this.MAP_ID, this.MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).empty()
})

test("Maps with not matching id is defined", function()
{
    const OTHER_MAP_ID = this.MAP_ID + 1
    nerthus.mapsArr = [[this.SEASON, OTHER_MAP_ID, this.MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).empty()
})

test("start defer map change", function()
{
    nerthus.maps.start()
    expect(this.DEFERRED).to.contain(nerthus.maps.customMaps)
})

