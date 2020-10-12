const sinon = require('sinon')
const expect = require('expect.js')

describe('zodiac', function ()
{
    const inject = require('inject-loader!../../src/zodiac')
    const module = inject({
        './widgets': {addWidget: sinon.fake()},
        '../res/descriptions/zodiac.json': sinon.fake(),
        './settings': {settings: {zodiac: true}},
        './interface/panel': {addSettingToPanel: sinon.fake()}
    })

    describe('getZodiacSign()', function ()
    {
        const expectSignToBeBetween = function (sign, begin, end)
        {
            expect(module.getZodiacSign(begin.day, begin.month - 1)).to.be(sign)
            expect(module.getZodiacSign(end.day, end.month - 1)).to.be(sign)
        }

        it('should return aquarius between 20.01 and 18.02', function ()
        {
            expectSignToBeBetween('aquarius', {day: 20, month: 1}, {day: 18, month: 2})
        })

        it('should return pisces between 19.02 and 20.03', function ()
        {
            expectSignToBeBetween('pisces', {day: 19, month: 2}, {day: 20, month: 3})
        })

        it('should return aries between 21.03 and 19.04', function ()
        {
            expectSignToBeBetween('aries', {day: 21, month: 3}, {day: 19, month: 4})
        })

        it('should return taurus between 20.04 and 22.05', function ()
        {
            expectSignToBeBetween('taurus', {day: 20, month: 4}, {day: 22, month: 5})
        })

        it('should return gemini between 23.05 and 21.06', function ()
        {
            expectSignToBeBetween('gemini', {day: 23, month: 5}, {day: 21, month: 6})
        })

        it('should return cancer between 22.06 and 22.07', function ()
        {
            expectSignToBeBetween('cancer', {day: 22, month: 6}, {day: 22, month: 7})
        })

        it('should return leo between 23.07 and 21.08', function ()
        {
            expectSignToBeBetween('leo', {day: 23, month: 7}, {day: 23, month: 8})
        })

        it('should return virgo between 24.08 and 22.09', function ()
        {
            expectSignToBeBetween('virgo', {day: 24, month: 8}, {day: 22, month: 9})
        })

        it('should return libra between 23.09 and 22.10', function ()
        {
            expectSignToBeBetween('libra', {day: 23, month: 9}, {day: 22, month: 10})
        })

        it('should return scorpio between 23.10 and 22.11', function ()
        {
            expectSignToBeBetween('scorpio', {day: 23, month: 10}, {day: 21, month: 11})
        })

        it('should return sagittarius between 22.11 and 21.12', function ()
        {
            expectSignToBeBetween('sagittarius', {day: 22, month: 11}, {day: 21, month: 12})
        })
        it('should return capricorn between 22.12 and 19.01', function ()
        {
            expectSignToBeBetween('capricorn', {day: 22, month: 12}, {day: 19, month: 1})
        })
        it('should return capricorn at the beginning and the end of the year', function ()
        {
            expectSignToBeBetween('capricorn', {day: 31, month: 12}, {day: 1, month: 1})
        })
    })
})
