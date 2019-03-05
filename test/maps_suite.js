
suite("maps")

const SEASON = 1
const ANY_SEASON = 0
const MAP_ID = 42
const MAP_URL = "some_url"
let DEFERRED = []

before(function()
{

    map = {id : MAP_ID}

    nerthus = {}
    nerthus.defer = function(func){DEFERRED.push(func)}
    nerthus.season = function(){return SEASON}

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
    DEFERRED = []
    $("#ground").css("backgroundImage", "")
})

test("No maps defined", function()
{
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).empty()
})

test("Maps with matching id and season is defined", function()
{
    nerthus.mapsArr = [[SEASON, MAP_ID, MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).to.contain(MAP_URL)
})

test("Maps with matching id and any season is defined", function()
{
    nerthus.mapsArr = [[ANY_SEASON, MAP_ID, MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).to.contain(MAP_URL)
})

test("Maps with not matching season is defined", function()
{
    const OTHER_SEASON = SEASON + 1
    nerthus.mapsArr = [[OTHER_SEASON, MAP_ID, MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).empty()
})

test("Maps with not matching id is defined", function()
{
    const OTHER_MAP_ID = MAP_ID + 1
    nerthus.mapsArr = [[SEASON, OTHER_MAP_ID, MAP_URL]]
    nerthus.maps.customMaps()
    expect($("#ground").css("backgroundImage")).empty()
})

test("start defer map change", function()
{
    nerthus.maps.start()
    expect(DEFERRED).to.contain(nerthus.maps.customMaps)
})

