//==================================================================
// OBSŁUGA PICIA - Autor Godfryd
//==================================================================
try
{
nerthus_alk = {};

nerthus_alk.lvl = 0;  //stanupojenia alkoholowego 0 trzeźwy 100 urwany film.

nerthus_alk.timer = 0;

nerthus_alk.start = function()
{
    if (getCookie('nerthus_alk') != null) 
        nerthus_alk.lvl = getCookie('nerthus_alk')
    else
        nerthus_alk.lvl = 0;
    if (nerthus_alk.lvl) nerthus_alk.timer = setInterval(nerthus_alk.timer_handler, 5000);
}

nerthus_alk.timer_handler = function()
{
    nerthus_alk.lvl--;
    expiry = new Date(parseInt(new Date().getTime()) * 2);
    setCookie("nerthus_alk", nerthus_alk.lvl, expiry)
    if (nerthus_alk.lvl<1) 
    {
        nerthus_alk.lvl=0;
        clearInterval(nerthus_alk.timer);
        nerthus_alk.timer=0
    };
}

// przechwytujemy _g
_nerthg = _g;
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
            nerthus_alk.lvl+= 10;
            if (nerthus_alk.lvl > 100) nerthus_alk.lvl = 100
            if (!nerthus_alk.timer) nerthus_alk.timer = setInterval(nerthus_alk.timer_handler,5000);
        }
    }
    _nerthg(c,d);
}


//==================================================================
//Pijackie gadanie
//==================================================================

function shuffleArray(array,cc) 
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
    if ((a[0]!="*") && (a[0]!="/")&& (a[0]!="@") && (nerthus_alk.lvl>0))
    {
        switch (Math.floor(nerthus_alk.lvl/10))
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
};

g.loadQueue.push({fun:nerthus_alk.start,data:""});
}catch(e){log('NerthusAlk Error: '+e.message,1)}
