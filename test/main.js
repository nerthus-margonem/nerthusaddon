import {testMaps} from './suites/maps'
import * as cheerio from 'cheerio'

function init()
{
    global.resetWindow = function ()
    {
        global.$ = cheerio.load('');
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
testMaps()
