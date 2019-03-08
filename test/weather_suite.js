suite("Weather")

before(function()
{
    nerthus = {}
    nerthus.defer = function(){}
    nerthus.options = {}

    expect = require("expect.js")
    require("../NN_pogoda.js")
})

test("dummy", function()
{
})

/*
//weather slot stats
test("weather function", function()
{
    var _date = Date

    var setDate = function(hour, day, month)
    {
        Date = function()
        {
            var date = new _date(0)
            date.setUTCHours(hour)
            date.setUTCDate(day)
            date.setUTCMonth(month-1)
            return date
        }
    }


nerthus.seasons = {SPRING : 1, SUMMER : 2, AUTUMN : 3, WINTER : 4}
nerthus.season = function()
{
    var makeStartDate = function(day,month)
    {
        var date = new Date()
        date.setUTCDate(day)
        date.setUTCMonth(month - 1)
        return date
    }
    const date = new Date()
    const SPRING_BEGIN = makeStartDate(21,3)
    const SUMMER_BEGIN = makeStartDate(22,6)
    const AUTUMN_BEGIN = makeStartDate(23,9)
    const WINTER_BEGIN = makeStartDate(22,11) //long winter

    if(date >= WINTER_BEGIN)
        return this.seasons.WINTER
    if(date >= AUTUMN_BEGIN)
        return this.seasons.AUTUMN
    if(date >= SUMMER_BEGIN)
        return this.seasons.SUMMER
    if(date >= SPRING_BEGIN)
        return this.seasons.SPRING
    return this.seasons.WINTER
}

    var weather = {}
    var weather_ico = {}
    var days_in_month = { 1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31 }

    var id2ico = function(id)
    {
        if(nerthus.weather.is_raining(id))
            return "R"
        if(nerthus.weather.is_snowing(id))
            return "S"
        return "C"
    }

    for(var month in days_in_month)
    {
        for(var day = 1; day < days_in_month[month]; day++)
        {
            for(var hour = 0; hour < 24; hour+=4)
            {
                setDate(hour,day,month)
                var weather_id = nerthus.weather.calculate()

                if(! weather[month])
                {
                    weather[month]={}
                    weather_ico[month]={}

                }
                if(! weather[month][day])
                {
                    weather[month][day] = []
                    weather_ico[month][day] = []
                }

                weather[month][day].push(weather_id)
                weather_ico[month][day].push(id2ico(weather_id))
            }
        }
    }


    var all_days = 0
    var days = {"C":0, "R":0, "S":0}

    for(var month in weather_ico)
        for(var day in weather_ico[month])
            for(var ico in weather_ico[month][day])
                days[weather_ico[month][day][ico]]++


//    console.log(weather)
//    console.log(weather_ico)
    console.log("Clear days: " , days.C)
    console.log("Rain days: " , days.R)
    console.log("Snow days: " , days.S)


    Date = _date
})
*/


