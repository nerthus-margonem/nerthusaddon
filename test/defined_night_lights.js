suite("user defined night lights", function ()
{
    const expect = require("expect.js")
    const fs = require('fs')
    const path = require('path')
    const LIGHTS_DIR = "./night_lights"

    function checkLight(light)
    {
        expect(light).to.be.an("object")

        expect(light).to.have.property("x")
        expect(light.x).to.match(/^-?\d+$/)

        expect(light).to.have.property("y")
        expect(light.y).to.match(/^-?\d+$/)

        expect(light).to.have.property("type")
        expect(light.type).to.be.a("string")
    }

    function checkFileWithLights(filename)
    {
        const file = fs.readFileSync(path.join(LIGHTS_DIR, filename))
        const lights = JSON.parse(file)
        expect(lights).to.be.an("object")
        lights.forEach(light => checkLight(light))
    }

    const files = fs.readdirSync(LIGHTS_DIR)
    files.forEach(filename => test("check map " + filename, () => checkFileWithLights(filename)))
})
