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

//zwraca sezon 1 - wiosna, 2 - lato, 3 - jesień, 4 - zima
nerthus.season = function()
{
    var season=1;
    var date = new Date();
    var seasonBegin = new Date();
    var seasonEnd = new Date();

    //wiosna 21.3 - 22.6
    seasonBegin.setUTCDate(21); seasonBegin.setUTCMonth(2);
    seasonEnd.setUTCDate(22); seasonEnd.setUTCMonth(5);
    if(date>=seasonBegin && date<seasonEnd)
    {
        season = 1;
    }
    //lato 22.6 - 23.9
    seasonBegin.setUTCDate(21); seasonBegin.setUTCMonth(5);
    seasonEnd.setUTCDate(23); seasonEnd.setUTCMonth(8);
    if(date>=seasonBegin && date<seasonEnd)
    {
        season = 2;
    }
    //lato 23.9 - 22.12
    seasonBegin.setUTCDate(23); seasonBegin.setUTCMonth(8);
    seasonEnd.setUTCDate(22); seasonEnd.setUTCMonth(10);
    if(date>=seasonBegin && date<seasonEnd)
    {
        season = 3;
    }
    //zima 22.12 - 21.3
    seasonBegin.setUTCDate(22); seasonBegin.setUTCMonth(10);
    seasonEnd.setUTCDate(21); seasonEnd.setUTCMonth(2);
    if(date>=seasonBegin || date<seasonEnd)
    {
        season = 4;
    }
    return season;
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

nerthus.base = {}
nerthus.base.start = function()
{
    nerthus.setChatInfo();
    nerthus.setEnterMsg();

    hero.tip = function()
    {
        var tip = "<b><font color='white'>" + this.nick + "</font></b>"
        tip += "<center>" + nerthus.tips.title(this) + "</center>"
        tip += "<i><font color='red'>" + nerthus.tips.rank(this) + "</font></i>"
        return tip
    }
    nerthus.defer(function()
    {
        hero.rights = hero.uprawnienia
        $("#hero").attr('tip', function(){return hero.tip()})
    })

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

    g.tips.other = function (other) {
        var tip = "<b>" + other.nick + "</b>";
        if (other.clan != "") {
            tip += "[" + other.clan + "]<br>"
        }
        tip += nerthus.tips.title(other)
        tip += "<i>" + nerthus.tips.rank(other) + "</i>"
        if (other.attr & 1) {
            tip += "<img src=img/mute.gif>";
        }
        return tip
    }
}

nerthus.code = {}
nerthus.code.files = []
nerthus.code.loaded_files = []
nerthus.code.all_loaded = null
nerthus.code.load = function (files,callback)
{
    this.all_loaded = callback
    for(var i in files)
        this.load_file(files[i])
}
nerthus.code.load_file = function(file,callback)
{
    this.files.push(file)
    $.getScript(nerthus.addon.fileUrl(file), function(){nerthus.code.loaded(file,callback)})
}
nerthus.code.loaded = function(file,callback)
{
    log(file + " has been loaded, awaiting: " + String(this.files.length - this.loaded_files.length))
    this.loaded_files.push(file)
    if(typeof callback === 'function')
        callback()
    if(this.files.length === this.loaded_files.length)
    {
        log("all files has been loaded")
        if(typeof this.all_loaded === 'function')
            this.all_loaded()
    }
}

nerthus.loadSettings();
nerthus.base.start()

}catch(e){log('NerthusBase Error: '+e.message)}
