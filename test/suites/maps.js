import sinon from 'sinon'
import * as expect from 'expect.js'

export function testMaps()
{
    describe('maps', function ()
    {
        let $mapImage

        const loadOnEveryMap = sinon.fake()
        const resolveNerthusUrl = sinon.fake.returns('resolved-url')
        const getCurrentSeason = sinon.fake.returns('curent-season')

        describe('applyCurrentMapChange()', function ()
        {
            beforeEach(function ()
            {
                window.map = {
                    id: 1
                }
                $mapImage = $('<div id="ground"></div>').appendTo('body')
            })
            afterEach(resetWindow)
            it('should not change anything when no map', function ()
            {
                const maps = require('../../src/maps')
                const image = $mapImage.css('background-image')
                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(image)
            })

            it('should change map when season map is defined', function ()
            {
                const inject = require('inject-loader!babel-loader!../../src/maps')
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'curent-season': {1: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl}
                })


                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(`url(${resolveNerthusUrl()})`)
            })
        })
    })
}
