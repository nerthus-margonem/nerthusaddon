suite("maps", function ()
{
    if(typeof nerthus !== "undefined")
        console.log(nerthus)
    else
        console.log("No nerthus!")
    suiteSetup(function ()
    {
        SEASON = 1
        ANY_SEASON = 0
        MAP_ID = 42
        MAP_URL = "some_url"
        DEFERRED = []

        map = {id: MAP_ID}
        Engine = {
            map: {
                d: {
                    id: MAP_ID
                }
            }
        }

        //helper object to check proper argument passing to NN_worldEdit.js
        WorldEdit = []
        //helper for start_ni
        start_HELPER = []

        nerthus = {}
        nerthus.defer = function (func)
        {
            DEFERRED.push(func)
        }
        nerthus.season = function ()
        {
            return SEASON
        }
        nerthus.loadOnEveryMap = function (func)
        {
            start_HELPER.loadOnEveryMap = func
        }

        nerthus.worldEdit = {
            changeMap: function (url, layer)
            {
                WorldEdit.changeMap = [url, layer]
            }
        }
        nerthus.onDefined = (valueToBeDefined, callback) =>
        {
            callback()
        }

        expect = require("expect.js")
        require("../NN_maps.js")

    })
    after(function ()
    {
        delete SEASON
        delete ANY_SEASON
        delete MAP_ID
        delete MAP_URL
        delete DEFERRED
        delete map
        delete Engine

        delete WorldEdit
        delete start_HELPER
        delete nerthus

        delete $
        delete expect
        delete global.document
    })

    beforeEach(function ()
    {
        WorldEdit = []
        nerthus.mapsArr = []
        DEFERRED = []
    })

    test("SI: No maps defined", function ()
    {
        let ret = nerthus.maps.customMaps()

        expect(ret).to.equal(false)
    })

    test("SI: Map with matching id and season is defined", function ()
    {
        nerthus.mapsArr = [[SEASON, MAP_ID, MAP_URL]]

        let ret = nerthus.maps.customMaps()

        expect(ret).to.equal(true)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(MAP_URL)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

    test("SI: Map with matching id and 'any season' is defined", function ()
    {
        nerthus.mapsArr = [[ANY_SEASON, MAP_ID, MAP_URL]]
        nerthus.maps.customMaps()

        let ret = nerthus.maps.customMaps()

        expect(ret).to.equal(true)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(MAP_URL)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

    test("SI: Map with not matching season is defined", function ()
    {
        const OTHER_SEASON = SEASON + 1
        nerthus.mapsArr = [[OTHER_SEASON, MAP_ID, MAP_URL]]

        let ret = nerthus.maps.customMaps()

        expect(ret).to.equal(false)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(false)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

    test("SI: Maps with not matching id is defined", function ()
    {
        const OTHER_MAP_ID = MAP_ID + 1
        nerthus.mapsArr = [[SEASON, OTHER_MAP_ID, MAP_URL]]

        let ret = nerthus.maps.customMaps()

        expect(ret).to.equal(false)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(false)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

//there is no way to check if content of bound function
//equals to content of another

    test("SI: start defer map change is a bound function", function ()
    {
        nerthus.maps.start()

        //function should be bound function
        expect(start_HELPER.loadOnEveryMap.name).to.equal("bound ")
        expect(start_HELPER.loadOnEveryMap.prototype).to.equal(undefined)
    })

    test("SI: start defer map change bound function works the same as normal function", function ()
    {
        nerthus.maps.start()

        let ret = nerthus.maps.customMaps()
        let retBound = start_HELPER.loadOnEveryMap()

        expect(ret).to.equal(retBound)
    })


    test("NI: No maps defined", function ()
    {
        let ret = nerthus.maps.customMaps_ni()

        expect(ret).to.equal(false)
    })

    test("NI: Map with matching id and season is defined", function ()
    {
        nerthus.mapsArr = [[SEASON, MAP_ID, MAP_URL]]

        let ret = nerthus.maps.customMaps_ni()

        expect(ret).to.equal(true)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(MAP_URL)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

    test("NI: Map with matching id and 'any season' is defined", function ()
    {
        nerthus.mapsArr = [[ANY_SEASON, MAP_ID, MAP_URL]]
        nerthus.maps.customMaps_ni()

        let ret = nerthus.maps.customMaps_ni()

        expect(ret).to.equal(true)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(MAP_URL)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

    test("NI: Map with not matching season is defined", function ()
    {
        const OTHER_SEASON = SEASON + 1
        nerthus.mapsArr = [[OTHER_SEASON, MAP_ID, MAP_URL]]

        let ret = nerthus.maps.customMaps_ni()

        expect(ret).to.equal(false)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(false)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

    test("NI: Maps with not matching id is defined", function ()
    {
        const OTHER_MAP_ID = MAP_ID + 1
        nerthus.mapsArr = [[SEASON, OTHER_MAP_ID, MAP_URL]]

        let ret = nerthus.maps.customMaps_ni()

        expect(ret).to.equal(false)
        //first argument - map url
        expect(WorldEdit.changeMap[0]).to.equal(false)
        //second argument - layer
        expect(WorldEdit.changeMap[1]).to.equal(0)
    })

    /*
    TODO implement async test
    test("NI: Engine.map.d.id is undefined / addon loaded too quickly", function ()
    {
        Engine.map.d.id = undefined
    })

    */

    test("NI: start_ni loaded properly", function ()
    {
        nerthus.maps.customMaps_ni = function ()
        {
            start_HELPER.customMaps = true
        }

        nerthus.maps.start_ni()


        expect(start_HELPER.customMaps).to.equal(true)

        //function should be bound function
        expect(start_HELPER.loadOnEveryMap.name).to.equal("bound ")
        expect(start_HELPER.loadOnEveryMap.prototype).to.equal(undefined)
    })

})
