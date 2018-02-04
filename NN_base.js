/**    Name: NerthusBaseFunctions
    Pierwszy plik z dodatku Nerthusa
    Zawiera stworzenie obiktu nerthus i jego podstawowe funkcje
    Zawiera stare opcja jak opisy zamiast lvli
**/
try{

nerthus.defer = function(fun,data)
{
    if(typeof fun !== 'function')
        throw new TypeError('fun must be function when it is ' + typeof fun)
    g.loadQueue.push({'fun':fun, 'data':data})
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

//info wyświetlane na chacie po zalogowaniu
nerthus.setChatInfo = function()
{
    if( nerthus.chatInfoStr != '')
    {
        g.chat.txt[0]='<div class="sys_red">'+nerthus.chatInfoStr+'</div>'+g.chat.txt[0];
        if ($("#chb0").hasClass("choosen")) {$("#chattxt").html(g.chat.txt[0]);}
        chatScroll(-1);
    }
}

//wiadomość na start
nerthus.setEnterMsg = function()
{
    if(nerthus.EnterMsg != '')
        message(nerthus.EnterMsg)
}

nerthus.isNarr = function(nick)
{
    return nerthus.NerthusNarr.indexOf(nick) >= 0
}

nerthus.isRad = function(nick)
{
    return nerthus.NerthusRad.indexOf(nick) >= 0
}

nerthus.isSpec = function(nick)
{
    return nerthus.NerthusSpec.indexOf(nick) >= 0
}

nerthus.settings='111111'
nerthus.options = {'night':true, 'weather':true}
nerthus.loadSettings = function()
{
    if(typeof Storage)
    {
        var options = localStorage.nerthus_options
        if(options)
            nerthus.options = JSON.parse(options)
        else
            localStorage.nerthus_options = JSON.stringify(nerthus.options)
    }
    else
    {
        try{
            var cookie = getCookie('nerthusCookie');
            cookie=cookie.split('|');
            nerthus.settings=cookie[1];
            nerthus.options.night   = Boolean(parseInt(nerthus.settings[0]))
            nerthus.options.weather = Boolean(parseInt(nerthus.settings[3]))
        }catch(e){}
    }
}

nerthus.storeSettings = function(options)
{
    nerthus.options = options
    if(typeof Storage)
    {
        localStorage.nerthus_options = JSON.stringify(nerthus.options)
        nerthus.addon.store()
    }
    else
    {
        nerthus.settings = (options['night'] ? '1' : '0') + '11' + (options['weather'] ? '1' : '0') + '111'
        data = new Date();
        data.setTime(data.getTime()+30758400000);
        setCookie('nerthusCookie', data + '|' + nerthus.settings, data);
    }
}

nerthus.tips = {}
nerthus.tips.rights2rank = function (rights)
{
    if(rights & 1) return 0 //adm
    if(rights & 16) return 1 //smg
    if(rights & 2) return 2 //mg
    return 3 //mc
}

nerthus.tips.rank = function(player)
{
    var rank = -1;
    if (player.rights)
        rank = nerthus.tips.rights2rank(player.rights)
    if (nerthus.isNarr(player.nick))
    {
        if(rank == 3)
            rank = 6 //bard + mc
        else
            rank = 5 //bard
    }
    if (nerthus.isRad(player.nick))
        rank = 7 //radny
    if(rank > -1)
        return g.names.ranks[rank]
    return ""
}

nerthus.tips.title = function(player)
{
    //sprawdza czy vip, jeśli tak, to daje inny opis
    var title = nerthus.vips[parseInt(player.id)]
    if(title)
        return title
    if (player.lvl)
        return nerthus.lvlNames[Math.min(nerthus.lvlNames.length - 1, (parseInt(player.lvl) - 1) >> 3)]
    return ""
}

nerthus.tips.other = function(other)
{
    var tip = "<b>" + other.nick + "</b>"
    tip += other.clan ? "[" + other.clan + "]<br>" : ""
    tip += nerthus.tips.title(other)
    var rank = nerthus.tips.rank(other)
    tip += rank ? "<i>" + rank + "</i>" : ""
    tip += (other.attr & 1) ? "<img src=img/mute.gif>" : ""
    return tip
}

nerthus.tips.hero = function()
{
    var title = nerthus.tips.title(this)
    var rank =  nerthus.tips.rank(this)
    var tip = "<b><font color='white'>" + this.nick + "</font></b>"
    tip += title ? "<center>" + title + "</center>" : ""
    tip += rank ? "<i><font color='red'>" + rank + "</font></i>" : ""
    return tip
}

nerthus.base = {}
nerthus.base.start = function()
{
    nerthus.setChatInfo();
    nerthus.setEnterMsg();

    nerthus.defer(function()
    {
        hero.rights = hero.uprawnienia
        $("#hero").attr('tip', nerthus.tips.hero.bind(hero))
    })

    g.tips.other = nerthus.tips.other

    g.tips.npc = function (c) {
        var e = "<b>" + c.nick + "</b>";
        if (c.type != 4) {
            if (c.wt > 99) {
                e += "<i>tytan</i>"
            } else {
                if (c.wt > 79) {
                    e += "<i>heros</i>"
                } else {
                    if (c.wt > 29) {
                        e += "<i>elita III</i>"
                    } else {
                        if (c.wt > 19) {
                            e += "<i>elita II</i>"
                        } else {
                            if (c.wt > 9) {
                                e += "<i>elita</i>"
                            }
                        }
                    }
                }
            }
            var d = "",
                b = "";
            if (c.type == 2 || c.type == 3) {
                var a = c.lvl - hero.lvl;
                if (a < -13) {
                    d = 'style="color:#888"';
                    b = "Niewarty uwagi"
                } else {
                    if (a > 19) {
                        d = 'style="color:#f50"';
                        b = "Potężny przeciwnik"
                    } else {
                        if (a > 9) {
                            d = 'style="color:#ff0"';
                            b = "Poważny rywal"
                        } else {
                            b = "Zwykły przeciwnik"
                        }
                    }
                }
            }
            if (c.type > 0) {
                e += "<span " + d + ">" + b + (c.grp ? ", w grupie" : "") + "</span>"
            }
        }
        return e
    }

}

nerthus.loadSettings();
nerthus.base.start()

}catch(e){log('NerthusBase Error: '+e.message)}
