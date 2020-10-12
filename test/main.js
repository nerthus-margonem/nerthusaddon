import * as cheerio from 'cheerio'

function init()
{
    function resetWindow()
    {
        global.$ = cheerio.load('')
        global.window = {}
        // global.document = {}
    }

    global.Image = function () {this.src = ''}
    global.navigator = {userAgent: 'node.js'}
    global.resetWindow = resetWindow

    resetWindow()
}

init()

context = require.context('./suites', true, /\.js$/)
context.keys().forEach(context)
