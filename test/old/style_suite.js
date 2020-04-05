before(function ()
{
    expect = require('expect.js')
    FILE_URL = 'example.com'

    nerthus = {}
    nerthus.addon = {
        fileUrl(url)
        {
            return url
        }
    }
    require('../NN_style.js')

    const jsdom = require('jsdom')
    const {JSDOM} = jsdom
    const {window} = new JSDOM()
    const {document} = (new JSDOM('')).window
    global.document = document
    $ = require("jquery")(window)
})

beforeEach(function ()
{
    document.head.innerHTML = ''
})

test('CSS file is properly added after start', function ()
{
    nerthus.style.start()
    expect($('head > link[href="css/style.css"][rel="stylesheet"]').length).to.be.eql(1)
})
