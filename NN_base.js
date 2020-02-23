/**
 * Name: NerthusBaseFunctions
 * Pierwszy plik z dodatku Nerthusa
 * Zawiera stworzenie obiktu nerthus i jego podstawowe funkcje
 * Zawiera stare opcja jak opisy zamiast lvli
**/

nerthus.seasons = {SPRING: 1, SUMMER: 2, AUTUMN: 3, WINTER: 4}
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

nerthus.setChatInfo = function()
{
    if(this.chatInfoStr)
    {
        g.chat.txt[0] = '<div class="sys_red">' + this.chatInfoStr + '</div>' + g.chat.txt[0];
        if($("#chb0").hasClass("choosen"))
            $("#chattxt").html(g.chat.txt[0])
        chatScroll(-1)
    }
}

nerthus.setEnterMsg = function()
{
    if(this.EnterMsg)
        message(this.EnterMsg)
}

nerthus.isNarr = function(nick)
{
    return this.NerthusNarr.indexOf(nick) >= 0
}

nerthus.isRad = function(nick)
{
    return this.NerthusRad.indexOf(nick) >= 0
}

nerthus.isSpec = function(nick)
{
    return this.NerthusSpec.indexOf(nick) >= 0
}



nerthus.onDefined = function (valueToBeDefined, callback)
{
    const valArr = valueToBeDefined.toString().split(".")
    const len = valArr.length
    let object = window
    for (let i = 0; i < len; i++)
    {
        if (typeof object[valArr[i]] === "undefined")
            return setTimeout(nerthus.onDefined.bind(this, valueToBeDefined, callback), 500)
        else
            object = object[valArr[i]]
    }
    callback()
}

nerthus.base = {}
nerthus.base.start = function()
{
    nerthus.loadSettings()
    nerthus.setChatInfo()
    nerthus.setEnterMsg()

    nerthus.startObservingMapChange_SI()
}
