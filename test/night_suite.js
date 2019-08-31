suite("night", function ()
{
    const expect = require("expect.js")
    suiteSetup(function ()
    {
        WorldEdit = {}


        nerthus = {}
        nerthus.options = {}
        nerthus.addon = {}
        nerthus.addon.fileUrl = function (url)
        {
            return "URL-" + url
        }
        nerthus.defer = function ()
        {
        }

        nerthus.worldEdit = {
            lightTypes: {},
            changeLight: function (opacity)
            {
                WorldEdit.changeLight = opacity
            }
        }

        Engine = {
            map: {
                d: {
                    mainid: 0
                }
            }
        }

        map = {
            mainid: 0
        }

        require("../NN_night.js")
    })

    teardown(function ()
    {
        nerthus.worldEdit.lightTypes = {}
    })

    test("add light type", function ()
    {
        nerthus.night.lights.types.add("type", "10px")

        let lightTypes = {
            type: {
                url: "URL-/img/night_light_type.png",
                width: "10px",
                height: "10px"
            }
        }
        expect(nerthus.worldEdit.lightTypes).to.eql(lightTypes)
    })

    test("add light type when another is present", function ()
    {
        nerthus.worldEdit.lightTypes = {
            type1: {
                url: "URL-/img/night_light_type1.png",
                width: "10px",
                height: "10px"
            },
            type2: {
                url: "URL-/img/night_light_type2.png",
                width: "20px",
                height: "20px"
            }
        }
        nerthus.night.lights.types.add("type3", "30px")

        let lightTypes = {
            type1: {
                url: "URL-/img/night_light_type1.png",
                width: "10px",
                height: "10px"
            },
            type2: {
                url: "URL-/img/night_light_type2.png",
                width: "20px",
                height: "20px"
            },
            type3: {
                url: "URL-/img/night_light_type3.png",
                width: "30px",
                height: "30px"
            }
        }
        expect(nerthus.worldEdit.lightTypes).to.eql(lightTypes)
    })

    test("NI: Light when map is outdoor one", function ()
    {
        Engine.map.d.mainid = 0
        nerthus.night.dim_ni(0.4)
        expect(WorldEdit.changeLight).to.equal(0.4)
    })

    test("NI: Light when map is indoor one", function ()
    {
        Engine.map.d.mainid = 1
        nerthus.night.dim_ni(0.4)
        expect(WorldEdit.changeLight).to.equal(0)
    })
})
