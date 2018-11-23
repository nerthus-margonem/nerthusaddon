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

nerthus.options = {'night':true, 'weather':true, 'zodiac':true}
nerthus.loadSettings = function()
{
    if(typeof localStorage !== 'undefined')
    {
        if(localStorage.nerthus_options)
        {
            var options = JSON.parse(localStorage.nerthus_options)
            for(opt in options)
                if(this.options.hasOwnProperty(opt))
                    this.options[opt] = options[opt]
        }
        localStorage.nerthus_options = JSON.stringify(this.options)
    }
}

nerthus.storeSettings = function(options)
{
    this.options = options
    if(typeof localStorage !== 'undefined')
    {
        localStorage.nerthus_options = JSON.stringify(this.options)
        this.addon.store()
    }
}

nerthus.tips = {}
nerthus.tips.ranks = {NONE : -1, ADM : 0, SMG : 1, MG : 2, MC : 3, SMC : 4, BARD : 5, BARD_MC : 6, RADNY : 7}
nerthus.tips.rights = {ADM : 1, MG : 2, SMG : 16}
nerthus.tips.rights2rank = function(rights)
{
    if(rights & this.rights.ADM) return this.ranks.ADM
    if(rights & this.rights.SMG) return this.ranks.SMG
    if(rights & this.rights.MG)  return this.ranks.MG
    if(rights) return this.ranks.MC
    return this.ranks.NONE
}

nerthus.tips.rank = function(player)
{
    var rank = this.ranks.NONE
    if(player.rights)
        rank = this.rights2rank(player.rights)
    if(nerthus.isNarr(player.nick))
    {
        if(rank == this.ranks.MC)
            rank = this.ranks.BARD_MC
        else
            rank = this.ranks.BARD
    }
    if(nerthus.isRad(player.nick))
        rank = this.ranks.RADNY
    return rank != this.ranks.NONE ? g.names.ranks[rank] : ""
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
