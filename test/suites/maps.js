const sinon = require('sinon')
const expect = require('expect.js')

describe('maps', function ()
{
    let $mapImage

    const injectors = {
        loaders: {
            loadOnEveryMap: sinon.fake()
        },
        time: {
            getCurrentSeason: sinon.fake.returns('current-season')
        },
        mapsJson: {
            'default': {},
            'current-season': {1: 'map-url'}
        },
        utilityFunctions: {
            resolveUrl: sinon.fake.returns('resolved-url')
        },
        cssManager: {
            changeCustomStyle: sinon.fake(),
            removeCustomStyle: sinon.fake()
        }
    }
    const inject = require('inject-loader!../../src/app/maps')
    const module = inject({
        './game-integration/loaders': injectors.loaders,
        './time': injectors.time,
        '../res/configs/maps.json': injectors.mapsJson,
        './utility-functions': injectors.utilityFunctions,
        './interface/css-manager': injectors.cssManager
    })
    describe('applyCurrentMapChange()', function ()
    {
        beforeEach(function ()
        {
            window.map = {
                id: 1
            }
            $mapImage = $('<div id="ground"></div>').appendTo('body')

            injectors.cssManager.changeCustomStyle = sinon.fake()
            injectors.cssManager.removeCustomStyle = sinon.fake()

            injectors.mapsJson['default'] = {}
            injectors.mapsJson['current-season'] = {1: 'map-url'}
            delete injectors.mapsJson['other-season']

            injectors.utilityFunctions.resolveUrl = sinon.fake.returns('resolved-url')
        })
        afterEach(resetWindow)
        it('should not change anything when no custom map defined', function ()
        {
            window.map.id = 0
            module.applyCurrentMapChange()
            if (INTERFACE === 'SI')
            {
                expect(injectors.cssManager.changeCustomStyle.called).to.be(false)
                expect(injectors.cssManager.removeCustomStyle.calledOnce).to.be(true)
                expect(injectors.cssManager.removeCustomStyle.calledWith('map-background-image')).to.be(true)
            }
        })

        it('should change map when there is custom map in current season', function ()
        {
            window.map.id = 1

            module.applyCurrentMapChange()
            if (INTERFACE === 'SI')
            {
                expect(injectors.cssManager.changeCustomStyle.calledOnce).to.be(true)
                expect(injectors.cssManager.removeCustomStyle.called).to.be(false)
                expect(injectors.cssManager.changeCustomStyle.calledWith(
                    'map-background-image', `#ground {
                            background-image: url(${injectors.utilityFunctions.resolveUrl()}) !important;
                            background-color: transparent !important;
                        }`.replace(/ /g, '')
                )).to.be(true)
            }
        })

        it('should change map when there is custom map in default', function ()
        {
            window.map.id = 1

            module.applyCurrentMapChange()
            if (INTERFACE === 'SI')
            {
                expect(injectors.cssManager.changeCustomStyle.calledOnce).to.be(true)
                expect(injectors.cssManager.removeCustomStyle.called).to.be(false)
                expect(injectors.cssManager.changeCustomStyle.calledWith(
                    'map-background-image', `#ground {
                            background-image: url(${injectors.utilityFunctions.resolveUrl()}) !important;
                            background-color: transparent !important;
                        }`.replace(/ /g, '')
                )).to.be(true)
            }
        })

        it('should load season map when both default and season maps are defined', function ()
        {
            const customResolveUrl = (str) => str
            injectors.mapsJson['default'] = {1: 'default-map-url'}
            injectors.mapsJson['current-season'] = {1: 'season-map-url'}

            injectors.utilityFunctions.resolveUrl = customResolveUrl

            window.map.id = 1

            module.applyCurrentMapChange()
            if (INTERFACE === 'SI')
            {
                expect(injectors.cssManager.changeCustomStyle.calledOnce).to.be(true)
                expect(injectors.cssManager.removeCustomStyle.called).to.be(false)
                expect(injectors.cssManager.changeCustomStyle.calledWith(
                    'map-background-image', `#ground {
                            background-image: url(${customResolveUrl('season-map-url')}) !important;
                            background-color: transparent !important;
                        }`.replace(/ /g, '')
                )).to.be(true)
            }
        })

        it('should not change map when there is custom map but not in current season', function ()
        {
            injectors.mapsJson['default'] = {}
            injectors.mapsJson['current-season'] = {}
            injectors.mapsJson['other-season'] = {1: 'season-map-url'}

            window.map.id = 1

            module.applyCurrentMapChange()
            if (INTERFACE === 'SI')
            {
                expect(injectors.cssManager.changeCustomStyle.called).to.be(false)
                expect(injectors.cssManager.removeCustomStyle.calledOnce).to.be(true)
                expect(injectors.cssManager.removeCustomStyle.calledWith('map-background-image')).to.be(true)
            }
        })

        it('should not change map when there is custom map but wrong id', function ()
        {
            injectors.mapsJson['default'] = {}
            injectors.mapsJson['current-season'] = {2: 'map-url'}

            window.map.id = 1

            module.applyCurrentMapChange()
            if (INTERFACE === 'SI')
            {
                expect(injectors.cssManager.changeCustomStyle.called).to.be(false)
                expect(injectors.cssManager.removeCustomStyle.calledOnce).to.be(true)
                expect(injectors.cssManager.removeCustomStyle.calledWith('map-background-image')).to.be(true)
            }
        })
    })
})
