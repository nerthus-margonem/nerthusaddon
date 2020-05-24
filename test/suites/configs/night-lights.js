import * as expect from 'expect.js'
import * as path from 'path'
import * as fs from 'fs'

const LIGHTS_DIR = './res/configs/night-lights'

function checkLight(light)
{
    expect(light).to.be.an(typeof ({}))

    expect(light).to.have.property('x')
    expect(light.x).to.match(/^-?\d+$/)

    expect(light).to.have.property('y')
    expect(light.y).to.match(/^-?\d+$/)

    expect(light).to.have.property('type')
    expect(light.type).to.be.a(typeof ('string'))
}

function checkFileWithLights(filename)
{
    let file = fs.readFileSync(path.join(LIGHTS_DIR, filename))
    let lights = JSON.parse(file)
    expect(lights).to.be.an(typeof ([]))
    lights.forEach(light => checkLight(light))
}

export function testNightLights()
{
    describe('Night lights config files', function ()
    {
        const files = fs.readdirSync(LIGHTS_DIR)
        for (let i = 0; i < files.length; i++)
        {
            const filename = files[i]
            describe('File: ' + filename, function ()
            {
                it('should have correct structure', function ()
                {
                    checkFileWithLights(filename)
                })
            })
        }
    })
}
