suite("user defined night lights")

let expect = require("expect.js")
let fs = require('fs')
let path = require('path')
const LIGHTS_DIR = "./night_lights"

let checkLight = function(light)
{
    expect(light).to.be.an(typeof({}))

    expect(light).to.have.property("x")
    expect(light.x).to.match(/^-{0,1}\d+$/)

    expect(light).to.have.property("y")
    expect(light.y).to.match(/^-{0,1}\d+$/)

    expect(light).to.have.property("type")
    expect(light.type).to.be.a(typeof("string"))
}

let checkFileWithLights = function(filename)
{
    let file = fs.readFileSync(path.join(LIGHTS_DIR, filename))
    let lights = JSON.parse(file)
    expect(lights).to.be.an(typeof([]))
    lights.forEach(light => checkLight(light))
}

let files = fs.readdirSync(LIGHTS_DIR)
files.forEach(filename => test("check map " + filename, () => checkFileWithLights(filename)))
