import sinon from 'sinon'
import expect from 'expect.js'

export function testMaps()
{
    describe('maps', function ()
    {
        let $mapImage

        const loadOnEveryMap = sinon.fake()
        const resolveNerthusUrl = sinon.fake.returns('resolved-url')
        const getCurrentSeason = sinon.fake.returns('current-season')
        const inject = require('inject-loader!babel-loader!../../src/maps')

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
            it('should not change anything when no custom map defined', function ()
            {
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {1: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl}
                })

                window.map.id = 0
                const image = $mapImage.css('background-image')
                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(image)
            })

            it('should change map when there is custom map in current season', function ()
            {
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {1: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl}
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(`url(${resolveNerthusUrl()})`)
            })

            it('should change map when there is custom map in default', function ()
            {
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {1: 'map-url'},
                        'current-season': {}
                    },
                    './utility-functions': {resolveNerthusUrl}
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(`url(${resolveNerthusUrl()})`)
            })

            it('should load season map when both default and season maps are defined', function ()
            {
                const customResolveNerthusUrl = (str) => str
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {1: 'default-map-url'},
                        'current-season': {1: 'season-map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl: customResolveNerthusUrl}
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(
                    `url(${customResolveNerthusUrl('season-map-url')})`
                )
            })

            it('should not change map when there is custom map but not in current season', function ()
            {
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {},
                        'other-season': {1: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl}
                })
                window.map.id = 1

                const image = $mapImage.css('background-image')
                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(image)
            })

            it('should not change map when there is custom map but wrong id', function ()
            {
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {2: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl}
                })
                window.map.id = 1

                const image = $mapImage.css('background-image')
                maps.applyCurrentMapChange()
                expect($mapImage.css('background-image')).to.be.equal(image)
            })
        })
    })
}
