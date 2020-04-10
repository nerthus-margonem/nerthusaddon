import sinon from 'sinon'
import * as expect from 'expect.js'

export function testZodiac()
{
    describe('zodiac', function ()
    {
        const inject = require('inject-loader!babel-loader!../../src/zodiac')

        describe('getZodiacSign()', function ()
        {
            const maps = inject({
                './widgets': {addWidget: sinon.fake()},
                '../res/descriptions/zodiac.json': sinon.fake(),
                './settings': {settings: {zodiac: true}}
            })
            const expectSignToBeBetween = function (sign, begin, end)
            {
                expect(maps.getZodiacSign(begin.day, begin.month - 1)).to.be(sign)
                expect(maps.getZodiacSign(end.day, end.month - 1)).to.be(sign)
            }

            it('should return Aquarius between 20.01 and 18.02', function ()
            {
                expectSignToBeBetween('Aquarius', {day: 20, month: 1}, {day: 18, month: 2})
            })

            it('should return Pisces between 19.02 and 20.03', function ()
            {
                expectSignToBeBetween('Pisces', {day: 19, month: 2}, {day: 20, month: 3})
            })

            it('should return Aries between 21.03 and 19.04', function ()
            {
                expectSignToBeBetween('Aries', {day: 21, month: 3}, {day: 19, month: 4})
            })

            it('should return Taurus between 20.04 and 22.05', function ()
            {
                expectSignToBeBetween('Taurus', {day: 20, month: 4}, {day: 22, month: 5})
            })

            it('should return Gemini between 23.05 and 21.06', function ()
            {
                expectSignToBeBetween('Gemini', {day: 23, month: 5}, {day: 21, month: 6})
            })

            it('should return Cancer between 22.06 and 22.07', function ()
            {
                expectSignToBeBetween('Cancer', {day: 22, month: 6}, {day: 22, month: 7})
            })

            it('should return Leo between 23.07 and 21.08', function ()
            {
                expectSignToBeBetween('Leo', {day: 23, month: 7}, {day: 23, month: 8})
            })

            it('should return Virgo between 24.08 and 22.09', function ()
            {
                expectSignToBeBetween('Virgo', {day: 24, month: 8}, {day: 22, month: 9})
            })

            it('should return Libra between 23.09 and 22.10', function ()
            {
                expectSignToBeBetween('Libra', {day: 23, month: 9}, {day: 22, month: 10})
            })

            it('should return Scorpio between 23.10 and 22.11', function ()
            {
                expectSignToBeBetween('Scorpio', {day: 23, month: 10}, {day: 21, month: 11})
            })

            it('should return Sagittarius between 22.11 and 21.12', function ()
            {
                expectSignToBeBetween('Sagittarius', {day: 22, month: 11}, {day: 21, month: 12})
            })
            it('should return Capricorn between 22.12 and 19.01', function ()
            {
                expectSignToBeBetween('Capricorn', {day: 22, month: 12}, {day: 19, month: 1})
            })
            it('should return Capricorn at the beginning and the end of the year', function ()
            {
                expectSignToBeBetween('Capricorn', {day: 31, month: 12}, {day: 1, month: 1})
            })
        })
    })
}
