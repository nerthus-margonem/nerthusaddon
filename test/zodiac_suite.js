suite("Zodiak")

before(function()
{
    nerthus = {}
    nerthus.addon = {}
    nerthus.addon.fileUrl = function () {}

    expect = require("expect.js")
    require("../NN_zodiak.js")

})


test("Correct zodiac sign around the year", function()
{
    const SIGNS = {
        AQUARIUS    : 0,
        PISCES      : 1,
        ARIES       : 2,
        TAURUS      : 3,
        GEMINI      : 4,
        CANCER      : 5,
        LEO         : 6,
        VIRGO       : 7,
        LIBRA       : 8,
        SCORPIO     : 9,
        SAGITTARIUS : 10,
        CAPRICORN   : 11
    }

    const _date = Date
    let setDate = function(day, month)
    {
        Date = function()
        {
            var date = new _date(0)
            date.setUTCDate(day)
            date.setUTCMonth(month-1)
            return date
        }
    }

    let expectSignToBeBetween = function(sign, begin, end)
    {
        let date = setDate(begin.day, begin.month)
        expect(nerthus.zodiac.calculate(date)).to.be(sign)
        date = setDate(end.day, end.month)
        expect(nerthus.zodiac.calculate(date)).to.be(sign)
    }

    // Wodnik (20 stycznia – 18 lutego)
    expectSignToBeBetween(SIGNS.AQUARIUS,{day:20,month:1},{day:18,month:2})

    // Ryby (19 lutego – 20 marca)
    expectSignToBeBetween(SIGNS.PISCES,{day:19,month:2},{day:20,month:3})

    // Baran (21 marca – 19 kwietnia)
    expectSignToBeBetween(SIGNS.ARIES,{day:21,month:3},{day:19,month:4})

    // Byk (20 kwietnia – 22 maja)
    expectSignToBeBetween(SIGNS.TAURUS,{day:20,month:4},{day:22,month:5})

    // Bliźnięta (23 maja – 21 czerwca)
    expectSignToBeBetween(SIGNS.GEMINI,{day:23,month:5},{day:21,month:6})

    // Rak (22 czerwca – 22 lipca)
    expectSignToBeBetween(SIGNS.CANCER,{day:22,month:6},{day:22,month:7})

    // Lew (23 lipca – 23 sierpnia)
    expectSignToBeBetween(SIGNS.LEO,{day:23,month:7},{day:23,month:8})

    // Panna (24 sierpnia – 22 września)
    expectSignToBeBetween(SIGNS.VIRGO,{day:24,month:8},{day:22,month:9})

    // Waga (23 września – 22 października)
    expectSignToBeBetween(SIGNS.LIBRA,{day:23,month:9},{day:22,month:10})

    // Skorpion (23 października – 21 listopada)
    expectSignToBeBetween(SIGNS.SCORPIO,{day:23,month:10},{day:21,month:11})

    // Strzelec (22 listopada – 21 grudnia)
    expectSignToBeBetween(SIGNS.SAGITTARIUS,{day:22,month:11},{day:21,month:12})

    // Koziorożec (22 grudnia – 19 stycznia)
    expectSignToBeBetween(SIGNS.CAPRICORN,{day:22,month:12},{day:19,month:1})

    // Koniec/początek roku (31 grudnia – 1 stycznia)
    expectSignToBeBetween(SIGNS.CAPRICORN,{day:31,month:12},{day:1,month:1})

    Date = _date
})

