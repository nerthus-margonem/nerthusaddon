//==================================================================
// OBSŁUGA PICIA - Autor Godfryd
//==================================================================
try
{
nerthus.alko = {};

nerthus.alko.lvl = 0;  //stanupojenia alkoholowego 0 trzeźwy 100 urwany film.

nerthus.alko.timer = 0;

nerthus.alko.run = function()
{
    if (getCookie('nerthus.alko') != null) 
        this.lvl = getCookie('nerthus.alko')
    else
        this.lvl = 0;
    if (this.lvl)
        this.timer = setInterval(this.timer_handler.bind(this), 5000);
}

nerthus.alko.timer_handler = function()
{
    this.lvl--;
    expiry = new Date(parseInt(new Date().getTime()) * 2);
    setCookie("nerthus.alko", this.lvl, expiry)
    if (this.lvl<1) 
    {
        this.lvl=0;
        clearInterval(this.timer);
        this.timer=0
    };
}


nerthus.alko.start = function()
{
    // przechwytujemy _g
    var _nerthg = _g;
    _g = function (c,d)
    {
        // jeżli użyjemy towaru konsumpcyjnego o wymaganiach levelowych 18 to dodaje nam 10% upojenia alkoholowego
        if (c.search("moveitem&st=1&id=") > -1) 
        {
            var it = g.item[c.slice(17)];
            if (it.cl == 16 || it.cl == 23)
            if (it.stat.search("lvl=")>-1)
            if (parseInt(it.stat.match(/lvl=([0-9]+)/)[1]) == 18)
            {
                this.lvl+= 10;
                if (this.lvl > 100)
                    this.lvl = 100
                if (!this.timer)
                    this.timer = setInterval(this.timer_handler.bind(this),5000);
            }
        }
        _nerthg(c,d);
    }.bind(this)

    var shuffleArray = function (array,cc) 
    { // funkcja z netu tasujÄ?ca  tablicÄ? pozostawiajÄ?c 
        var przestanek = 0;
        if (typeof cc == 'undefined' ) cc = 0;
        if ([".",",","?","!"].lastIndexOf(array[array.length-1]) > -1) przestanek = 1;
        for (var i = array.length - 1 - cc - przestanek; i > (0+cc); i--) 
        {
            var j = Math.floor(Math.random() * (i + 1 - cc) + cc);
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    var nerth_chatSendMsg = chatSendMsg;
    chatSendMsg = function (a)
    {
        if ((a[0]!="*") && (a[0]!="/")&& (a[0]!="@") && (this.lvl>0))
        {
            switch (Math.floor(this.lvl/10))
            {
            case 9: a = "/me bełkota coś niezrozumiale.";
                break;
            case 8:
                a = shuffleArray(a.split(" ")).join(" ");
            case 7: 
                t = a.split(", ");
                for (tt in t) t[tt]=shuffleArray(t[tt].split(" ")).join(" ");
                a = t.join(", ");
            case 6: 
                t = a.split(", ");
                for (tt in t) t[tt]=shuffleArray(t[tt].split(" "),1).join(" ");
                a = t.join(", ");
            case 5: 
                t = a.split(" ");
                for (tt in t) if (t[tt].length > 4) t[tt]=shuffleArray(t[tt].split("")).join("");
                a = t.join(" ");
            case 4: 
                t = a.split(" ");
                for (tt in t) if (t[tt].length > 5) t[tt]=shuffleArray(t[tt].split("")).join("");
                a = t.join(" ");
            case 3: 
                t = a.split(" ");
                for (tt in t) if (t[tt].length > 4) t[tt]=shuffleArray(t[tt].split(""),1).join("");
                a = t.join(" ");
            case 2: 
                t = a.split(" ");
                for (tt in t) if (t[tt].length > 5) t[tt]=shuffleArray(t[tt].split(""),1).join("");
                a = t.join(" ");
            case 1:
                a = a.replace(/\.|\,|\:|\?|\!|\-/g," *hik*");
            case 0:
                a = a.replace(/\.|\,|\:|\?|\!|\-/g,"");
            }  
        }    
        nerth_chatSendMsg(a)
    }.bind(this)

    nerthus.defer(this.run.bind(this))
}

nerthus.alko.start()

}catch(e){log('NerthusAlk Error: '+e.message,1)}
