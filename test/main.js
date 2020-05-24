import {testMaps} from './suites/maps'
import * as cheerio from 'cheerio'
import {testZodiac} from './suites/zodiac'
import {testNpcsFiles} from './suites/configs/npcs'
import {testNightLights} from './suites/configs/night-lights'

function init()
{
    global.resetWindow = function ()
    {
        global.$ = cheerio.load('')
        global.window = {}
        global.document = {}
    }

    global.Image = function () {this.src = ''}

    global.navigator = {
        userAgent: 'node.js'
    }

    resetWindow()
}

init()

testNightLights()
testNpcsFiles()

testMaps()
testZodiac()
