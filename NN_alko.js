//==================================================================
// OBSŁUGA PICIA - Autor Godfryd
//==================================================================
try
{
nerthus.alko = {}

nerthus.alko.lvl = 0  //stanupojenia alkoholowego 0 trzeźwy 100 urwany film.

nerthus.alko.timer = null

nerthus.alko.run = function()
{
    this.lvl = 0
    if (NerthusAddonUtils.storage() && NerthusAddonUtils.storage().nerthus_alko)
        this.lvl = parseInt(NerthusAddonUtils.storage().nerthus_alko)
    if (this.lvl)
        this.timer = setInterval(this.timer_handler.bind(this), 10000)
}

nerthus.alko.timer_handler = function()
{
    this.lvl--
    if(NerthusAddonUtils.storage())
        NerthusAddonUtils.storage().nerthus_alko = this.lvl
    if (this.lvl < 1)
    {
        this.lvl = 0
        clearInterval(this.timer)
        this.timer = null
    }
}

nerthus.alko.shuffleArray = function(array, cc)
{
    var przestanek = 0
    if(typeof cc == 'undefined' ) cc = 0
    if([".",",","?","!"].lastIndexOf(array[array.length-1]) > -1) przestanek = 1
    for (var i = array.length - 1 - cc - przestanek; i > (0 + cc); i--)
    {
        var j = Math.floor(Math.random() * (i + 1 - cc) + cc)
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

nerthus.alko.shuffleMessage = function(msg)
{

    if(["*/@"].indexOf(msg[0]) >= 0 || (this.lvl <= 0))
        return msg

    switch (Math.floor(this.lvl/10))
    {
        case 9: msg = "/me bełkota coś niezrozumiale."
            break
        case 8:
            msg = this.shuffleArray(msg.split(" ")).join(" ")
        case 7:
            t = msg.split(", ")
            for (tt in t) t[tt]=this.shuffleArray(t[tt].split(" ")).join(" ")
            msg = t.join(", ")
        case 6:
            t = msg.split(", ")
            for (tt in t) t[tt]=this.shuffleArray(t[tt].split(" "),1).join(" ")
            msg = t.join(", ");
        case 5:
            t = msg.split(" ")
            for (tt in t) if (t[tt].length > 4) t[tt]=this.shuffleArray(t[tt].split("")).join("")
            msg = t.join(" ")
        case 4:
            t = msg.split(" ")
            for (tt in t) if (t[tt].length > 5) t[tt]=this.shuffleArray(t[tt].split("")).join("")
            msg = t.join(" ")
        case 3:
            t = msg.split(" ")
            for (tt in t) if (t[tt].length > 4) t[tt]=this.shuffleArray(t[tt].split(""),1).join("")
            msg = t.join(" ")
        case 2:
            t = msg.split(" ");
            for (tt in t) if (t[tt].length > 5) t[tt]=this.shuffleArray(t[tt].split(""),1).join("")
            msg = t.join(" ");
        case 1:
            msg = msg.replace(/\.|\,|\:|\?|\!|\-/g," *hik*")
        case 0:
            msg = msg.replace(/\.|\,|\:|\?|\!|\-/g,"")
    }
    return msg
}

nerthus.alko.drink = function(c,d)
{
    // jeżli użyjemy towaru konsumpcyjnego o wymaganiach levelowych 18 to dodaje nam 10% upojenia alkoholowego
    var match = c.match(/^moveitem.*id=(\d+)/)
    if (match)
    {
        var it = g.item[match[1]]
        if (it.cl == 16 || it.cl == 23)
        if (it.stat.search("lvl=") > -1)
        if (parseInt(it.stat.match(/lvl=([0-9]+)/)[1]) == 18)
        {
            this.lvl += 10
            if (this.lvl > 100)
                this.lvl = 100
            if (!this.timer)
                this.timer = setInterval(this.timer_handler.bind(this), 10000)
        }
    }
}

nerthus.alko.start = function()
{
    var _nerthg = _g
    _g = function (c,d) {
        this.drink(c,d)
        _nerthg(c,d)
    }.bind(this)

    var _chatSendMsg = chatSendMsg;
    chatSendMsg = function(msg) {
        _chatSendMsg(this.shuffleMessage(msg))
    }.bind(this)

    nerthus.defer(this.run.bind(this))
}

}catch(e){log('NerthusAlk Error: '+e.message,1)}
