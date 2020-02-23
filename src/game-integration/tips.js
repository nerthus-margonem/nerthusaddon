g.names.ranks[0] = "Kreator"
g.names.ranks[1] = "Uber Miszcz Gry"
g.names.ranks[2] = "Miszcz Gry"
g.names.ranks[3] = "Strażnik Słowa" //"Modelator Czasu";            //"Moderator czatu";
g.names.ranks[4] = "Tkacz Słów"     //"Modelator czasoprzestrzeni"; //"Super moderator";
g.names.ranks[5] = "Trubadur"       //"Męczystruna";                //"Bard";
g.names.ranks[6] = "Piewca Słowa"   //"Modelator struny";           //"Bard + MC";
g.names.ranks[7] = "Radny"                                          //"Radny";

const RANKS = {NONE: -1, ADM: 0, SMG: 1, MG: 2, MC: 3, SMC: 4, BARD: 5, BARD_MC: 6, RADNY: 7}
const RIGHTS = {ADM: 1, MG: 2, SMG: 16}

function rights2rank(rights)
{
    if (rights & RIGHTS.ADM) return RANKS.ADM
    if (rights & RIGHTS.SMG) return RANKS.SMG
    if (rights & RIGHTS.MG) return RANKS.MG
    if (rights) return RANKS.MC
    return RANKS.NONE
}

function rank(player)
{
    let rank = RANKS.NONE
    if (player.RIGHTS)
        rank = rights2rank(player.RIGHTS)
    if (nerthus.isNarr(player.nick))
    {
        if (rank === RANKS.MC)
            rank = RANKS.BARD_MC
        else
            rank = RANKS.BARD
    }
    if (nerthus.isRad(player.nick))
        rank = RANKS.RADNY

    //TODO rankname always?
    if (INTERFACE === 'NI')
        return rank === RANKS.NONE ? '' : nerthus.ranks.rankName[rank]
    else
        return rank === RANKS.NONE ? '' : g.names.ranks[rank]

}

function title(player)
{
    //sprawdza czy vip, jeśli tak, to daje inny opis
    var title = nerthus.vips[parseInt(player.id)]
    if (title)
        return title
    if (player.lvl)
        return nerthus.lvlNames[Math.min(nerthus.lvlNames.length - 1, (parseInt(player.lvl) - 1) >> 3)]
    return ''
}

function other(other)
{
    var tip = '<b>' + other.nick + '</b>'
    tip += other.clan ? '[' + other.clan.name + ']<br>' : ''
    tip += this.title(other)
    var rank = this.rank(other)
    tip += rank ? '<i>' + rank + '</i>' : ''
    tip += (other.attr & 1) ? '<img src=img/mute.gif>' : ''
    return tip
}

function other_ni()
{
    nerthus.othersDrawableList = Engine.others.getDrawableList
    Engine.others.getDrawableList = function ()
    {
        let list = nerthus.othersDrawableList()
        for (const i in list)
        {
            if (list[i].isPlayer)
                list[i].tip[0] = parseNiTip(list[i], false)
        }
        return list
    }
    return Engine.others.getDrawableList
}

function hero(hero)
{
    var title = this.title(hero)
    var rank = this.rank(hero)
    var tip = '<b>' + hero.nick + '</b>'
    tip += hero.clan ? '[' + hero.clan.name + ']' : ''
    tip += title ? 'title' : ''
    tip += rank ? '<i><font color=\'red\'>' + rank + '</font></i>' : ''
    return tip
}

hero_ni = function ()
{
    nerthus.heroCreateStrTip = Engine.hero.createStrTip
    Engine.hero.createStrTip = function ()
    {
        return parseNiTip(Engine.hero, true)
    }
    Engine.hero.tip[0] = Engine.hero.createStrTip()
    return Engine.hero.createStrTip
}

parseNiTip = function (player, isHero)
{
    let tip = ''
    if (isHero)
        tip += '<div class="rank">' + _t('my_character', null, 'map') + '</div>'
    const rank = this.rank_ni(player)
    if (rank)
        tip += '<div class="rank">' + rank + '</div>'

    if (player.d.guest)
        tip += '<div class="rank">' + _t('deputy') + '</div>'

    const nick = '<div class="nick">' + player.d.nick + '</div>'
    const prof = player.d.prof ? '<div class="profs-icon ' + player.d.prof + '"></div>' : ''
    tip += '<div class="info-wrapper">' + nick + prof + '</div>'

    if (parseInt(player.wanted) === 1)
        tip += '<div class=wanted></div>'
    if (player.d.clan)
        tip += '<div class="clan-in-tip">[' + player.d.clan.name + ']</div>'

    const title = this.title(player.d)
    tip += '<div class="clan-in-tip">' + title + '</div>'

    let buffs = ''
    const line = player.d.clan ? '<div class="line"></div>' : ''
    const wanted = player.d.wanted ? '<div class="wanted-i"></div>' : ''
    const bless = player.d.ble ? '<div class="bless"></div>' : ''
    const mute = player.d.attr & 1 ? '<div class="mute"></div>' : ''
    const kB = player.d.vip === '1' ? '<div class="k-b"></div>' : ''
    const warn = player.d.attr & 2 ? '<div class="warn"></div>' : ''

    if (bless !== '' || mute !== '' || kB !== '' || warn !== '' || wanted !== '')
        buffs = '<div class="buffs-wrapper">' + line + wanted + bless + mute + kB + warn + '</div>'
    tip += buffs

    return tip
}

npcType = function (npc)
{
    if (npc.wt > 99)
        return 'tytan'
    if (npc.wt > 79)
        return 'heros'
    if (npc.wt > 29)
        return 'elita III'
    if (npc.wt > 19)
        return 'elita II'
    if (npc.wt > 9)
        return 'elita'
    return ''
}

npcDanger = function (npc)
{
    if (npc.type == 2 || npc.type == 3)
    {
        var lvlDiff = npc.lvl - hero.lvl
        if (lvlDiff < -13)
            return {style: 'style="color:#888"', str: 'Niewarty uwagi'}
        if (lvlDiff > 19)
            return {style: 'style="color:#f50"', str: 'Potężny przeciwnik'}
        if (lvlDiff > 9)
            return {style: 'style="color:#ff0"', str: 'Poważny rywal'}
        return {style: '', str: 'Zwykły przeciwnik'}
    }
    return {style: '', str: ''}
}

npc = function (npc)
{
    var tip = '<b>' + npc.nick + '</b>'
    if (npc.type == 4)
        return tip

    var type = this.npcType(npc)
    tip += type ? '<i>' + type + '</i>' : ''

    if (npc.type <= 0)
        return tip

    var danger = this.npcDanger(npc)
    var grp = npc.grp ? ', w grupie' : ''
    tip += '<span ' + danger.style + '>' + danger.str + grp + '</span>'
    return tip
}

start = function ()
{
    nerthus.defer(function ()
    {
        hero.RIGHTS = hero.uprawnienia
        $('#hero').attr('tip', this.hero.bind(this, hero))
    }.bind(this))

    g.tips.other = this.other.bind(this)
    g.tips.npc = this.npc.bind(this)
}

start_ni = function ()
{
    nerthus.loadSettings()
    if (typeof Engine.hero.tip === 'undefined')
        setTimeout(this.start_ni.bind(this), 500)
    else
    {
        this.other_ni()
        this.hero_ni()
        API.addCallbackToEvent('clear_map_npcs',
            function ()
            {
                setTimeout(function ()
                {
                    nerthus.loadNewMapQueue()
                }, 500)
            })
    }
}
