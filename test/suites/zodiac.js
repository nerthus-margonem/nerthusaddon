import sinon from 'sinon'
import * as expect from 'expect.js'

export function testZodiac()
{
    describe('zodiac', function ()
    {
        const inject = require('inject-loader!babel-loader!../../src/zodiac')

        describe('getZodiacSign()', function ()
        {
            it('should have correct zodiac sign around the year', function () // TODO split it
            {
                const maps = inject({
                    './widgets': {addWidget: sinon.fake()},
                    '../res/descriptions/zodiac.json': sinon.fake.returns('fake')
                })

                const expectSignToBeBetween = function(sign, begin, end)
                {
                    expect(maps.getZodiacSign(begin.day, begin.month - 1)).to.be(sign)
                    expect(maps.getZodiacSign(end.day, end.month - 1)).to.be(sign)
                }

                // Wodnik (20 stycznia – 18 lutego)
                expectSignToBeBetween('Aquarius',{day:20,month:1},{day:18,month:2})

                // Ryby (19 lutego – 20 marca)
                expectSignToBeBetween('Pisces',{day:19,month:2},{day:20,month:3})

                // Baran (21 marca – 19 kwietnia)
                expectSignToBeBetween('Aries',{day:21,month:3},{day:19,month:4})

                // Byk (20 kwietnia – 22 maja)
                expectSignToBeBetween('Taurus',{day:20,month:4},{day:22,month:5})

                // Bliźnięta (23 maja – 21 czerwca)
                expectSignToBeBetween('Gemini',{day:23,month:5},{day:21,month:6})

                // Rak (22 czerwca – 22 lipca)
                expectSignToBeBetween('Cancer',{day:22,month:6},{day:22,month:7})

                // Lew (23 lipca – 23 sierpnia)
                expectSignToBeBetween('Leo',{day:23,month:7},{day:23,month:8})

                // Panna (24 sierpnia – 22 września)
                expectSignToBeBetween('Virgo',{day:24,month:8},{day:22,month:9})

                // Waga (23 września – 22 października)
                expectSignToBeBetween('Libra',{day:23,month:9},{day:22,month:10})

                // Skorpion (23 października – 21 listopada)
                expectSignToBeBetween('Scorpio',{day:23,month:10},{day:21,month:11})

                // Strzelec (22 listopada – 21 grudnia)
                expectSignToBeBetween('Sagittarius',{day:22,month:11},{day:21,month:12})

                // Koziorożec (22 grudnia – 19 stycznia)
                expectSignToBeBetween('Capricorn',{day:22,month:12},{day:19,month:1})

                // Koniec/początek roku (31 grudnia – 1 stycznia)
                expectSignToBeBetween('Capricorn',{day:31,month:12},{day:1,month:1})
            })
        })
    })
}
