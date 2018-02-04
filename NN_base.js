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

nerthus.settings='111111'
nerthus.options = {'night':true, 'weather':true}
nerthus.loadSettings = function()
{
    if(typeof Storage)
    {
        var options = localStorage.nerthus_options
        if(options)
            this.options = JSON.parse(options)
        else
            localStorage.nerthus_options = JSON.stringify(this.options)
    }
    else
    {
        try{
            var cookie = getCookie('nerthusCookie');
            cookie=cookie.split('|');
            this.settings=cookie[1];
            this.options.night   = Boolean(parseInt(this.settings[0]))
            this.options.weather = Boolean(parseInt(this.settings[3]))
        }catch(e){}
    }
}

nerthus.storeSettings = function(options)
{
    this.options = options
    if(typeof Storage)
    {
        localStorage.nerthus_options = JSON.stringify(this.options)
        this.addon.store()
    }
    else
    {
        this.settings = (options['night'] ? '1' : '0') + '11' + (options['weather'] ? '1' : '0') + '111'
        data = new Date();
        data.setTime(data.getTime()+30758400000);
        setCookie('nerthusCookie', data + '|' + this.settings, data);
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
        rank = this.rights2rank(player.rights)
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
    tip += this.title(other)
    var rank = this.rank(other)
    tip += rank ? "<i>" + rank + "</i>" : ""
    tip += (other.attr & 1) ? "<img src=img/mute.gif>" : ""
    return tip
}

nerthus.tips.hero = function(hero)
{
    var title = this.title(hero)
    var rank =  this.rank(hero)
    var tip = "<b><font color='white'>" + hero.nick + "</font></b>"
    tip += title ? "<center>" + title + "</center>" : ""
    tip += rank ? "<i><font color='red'>" + rank + "</font></i>" : ""
    return tip
}

nerthus.tips.npcType = function(npc)
{
    if(npc.wt > 99)
        return "tytan"
    if(npc.wt > 79)
        return "heros"
    if(npc.wt > 29)
        return "elita III"
    if(npc.wt > 19)
        return "elita II"
    if(npc.wt > 9)
        return "elita"
    return ""
}

nerthus.tips.npcDanger = function(npc)
{
    if (npc.type == 2 || npc.type == 3)
    {
        var lvlDiff = npc.lvl - hero.lvl;
        if(lvlDiff < -13)
            return {style:'style="color:#888"', str:"Niewarty uwagi"}
        if(lvlDiff > 19)
           return {style:'style="color:#f50"', str:"Potężny przeciwnik"}
        if(lvlDiff > 9)
            return {style:'style="color:#ff0"', str:"Poważny rywal"}
        return {style:"", str:"Zwykły przeciwnik"}
    }
    return {style:"", str:""}
}

nerthus.tips.npc = function (npc)
{
    var tip = "<b>" + npc.nick + "</b>"
    if (npc.type == 4)
        return tip

    var type =  this.npcType(npc)
    tip += type ? "<i>" + type + "</i>" : ""

    if (npc.type <= 0)
        return tip

    var danger = this.npcDanger(npc)
    var grp = npc.grp ? ", w grupie" : ""
    tip += "<span " + danger.style + ">" + danger.str + grp + "</span>"
    return tip
}

nerthus.tips.start = function()
{
    nerthus.defer(function()
    {
        hero.rights = hero.uprawnienia
        $("#hero").attr('tip', this.hero.bind(this, hero))
    }.bind(this))

    g.tips.other = this.other.bind(this)
    g.tips.npc = this.npc.bind(this)
}

nerthus.base = {}
nerthus.base.start = function()
{
    nerthus.setChatInfo()
    nerthus.setEnterMsg()
}

nerthus.loadSettings();
nerthus.base.start()
nerthus.tips.start()

}catch(e){log('NerthusBase Error: '+e.message)}
