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
                const changeCustomStyle = sinon.fake()
                const removeCustomStyle = sinon.fake()
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {1: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl},
                    './interface/css-manager': {
                        changeCustomStyle,
                        removeCustomStyle
                    }
                })

                window.map.id = 0
                maps.applyCurrentMapChange()
                if (INTERFACE === 'SI')
                {
                    expect(changeCustomStyle.called).to.be(false)
                    expect(removeCustomStyle.calledOnce).to.be(true)
                    expect(removeCustomStyle.calledWith('map-background-image')).to.be(true)
                }
            })

            it('should change map when there is custom map in current season', function ()
            {
                const changeCustomStyle = sinon.fake()
                const removeCustomStyle = sinon.fake()
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {1: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl},
                    './interface/css-manager': {
                        changeCustomStyle,
                        removeCustomStyle
                    }
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                if (INTERFACE === 'SI')
                {
                    expect(changeCustomStyle.calledOnce).to.be(true)
                    expect(removeCustomStyle.called).to.be(false)
                    expect(changeCustomStyle.calledWith(
                        'map-background-image', `#ground {
                            background-image: url(${resolveNerthusUrl()}) !important; 
                            background-color: transparent !important;
                        }`.replace(/ /g,'')
                    )).to.be(true)
                }
            })

            it('should change map when there is custom map in default', function ()
            {
                const changeCustomStyle = sinon.fake()
                const removeCustomStyle = sinon.fake()
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {1: 'map-url'},
                        'current-season': {}
                    },
                    './utility-functions': {resolveNerthusUrl},
                    './interface/css-manager': {
                        changeCustomStyle,
                        removeCustomStyle
                    }
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                if (INTERFACE === 'SI')
                {
                    expect(changeCustomStyle.calledOnce).to.be(true)
                    expect(removeCustomStyle.called).to.be(false)
                    expect(changeCustomStyle.calledWith(
                        'map-background-image', `#ground {
                            background-image: url(${resolveNerthusUrl()}) !important; 
                            background-color: transparent !important;
                        }`.replace(/ /g,'')
                    )).to.be(true)
                }
            })

            it('should load season map when both default and season maps are defined', function ()
            {
                const customResolveNerthusUrl = (str) => str
                const changeCustomStyle = sinon.fake()
                const removeCustomStyle = sinon.fake()
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {1: 'default-map-url'},
                        'current-season': {1: 'season-map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl: customResolveNerthusUrl},
                    './interface/css-manager': {
                        changeCustomStyle,
                        removeCustomStyle
                    }
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                if (INTERFACE === 'SI')
                {
                    expect(changeCustomStyle.calledOnce).to.be(true)
                    expect(removeCustomStyle.called).to.be(false)
                    expect(changeCustomStyle.calledWith(
                        'map-background-image', `#ground {
                            background-image: url(${customResolveNerthusUrl('season-map-url')}) !important; 
                            background-color: transparent !important;
                        }`.replace(/ /g,'')
                    )).to.be(true)
                }
            })

            it('should not change map when there is custom map but not in current season', function ()
            {
                const changeCustomStyle = sinon.fake()
                const removeCustomStyle = sinon.fake()
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {},
                        'other-season': {1: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl},
                    './interface/css-manager': {
                        changeCustomStyle,
                        removeCustomStyle
                    }
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                if (INTERFACE === 'SI')
                {
                    expect(changeCustomStyle.called).to.be(false)
                    expect(removeCustomStyle.calledOnce).to.be(true)
                    expect(removeCustomStyle.calledWith('map-background-image')).to.be(true)
                }
            })

            it('should not change map when there is custom map but wrong id', function ()
            {
                const changeCustomStyle = sinon.fake()
                const removeCustomStyle = sinon.fake()
                const maps = inject({
                    './game-integration/loaders': {loadOnEveryMap},
                    './time': {getCurrentSeason},
                    '../res/configs/maps.json': {
                        'default': {},
                        'current-season': {2: 'map-url'}
                    },
                    './utility-functions': {resolveNerthusUrl},
                    './interface/css-manager': {
                        changeCustomStyle,
                        removeCustomStyle
                    }
                })
                window.map.id = 1

                maps.applyCurrentMapChange()
                if (INTERFACE === 'SI')
                {
                    expect(changeCustomStyle.called).to.be(false)
                    expect(removeCustomStyle.calledOnce).to.be(true)
                    expect(removeCustomStyle.calledWith('map-background-image')).to.be(true)
                }
            })
        })
    })
}
