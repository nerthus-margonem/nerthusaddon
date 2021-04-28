import {default as lvlNames} from '../../res/configs/lvl-names'
import {default as vips} from '../../res/configs/vips'
import {checkPermissionLvl, PERMISSION_LVL} from '../permissions'

const RANK_NAMES = [
    'Kreator',
    'Uber Miszcz Gry',
    'Miszcz Gry',
    'Strażnik Słowa',
    'Tkacz Słów',
    'Trubadur',
    'Piewca Słowa',
    'Radny',
    'Namiestnik'
]
const RANKS = {NONE: -1, ADM: 0, SMG: 1, MG: 2, MC: 3, SMC: 4, NARRATOR: 5, NARRATOR_MC: 6, COUNCILOR: 7, NAMIESTNIK: 8}
const RIGHTS = {ADM: 1, MG: 2, SMG: 16}

function rights2rank(rights)
{
    if (rights & RIGHTS.ADM) return RANKS.ADM
    if (rights & RIGHTS.SMG) return RANKS.SMG
    if (rights & RIGHTS.MG) return RANKS.MG
    if (rights) return RANKS.MC
    return RANKS.NONE
}

function getRankNameOf(player)
{
    let rank = RANKS.NONE
    if (player.rights) rank = rights2rank(player.rights)

    switch (checkPermissionLvl(player.nick))
    {
        case PERMISSION_LVL.NARRATOR:
            if (rank === RANKS.MC)
                rank = RANKS.NARRATOR_MC
            else
                rank = RANKS.NARRATOR
            break
        case PERMISSION_LVL.COUNCILOR:
            rank = RANKS.COUNCILOR
            break
        case PERMISSION_LVL.NAMIESTNIK:
            rank = RANKS.NAMIESTNIK
            break
    }
    return rank === RANKS.NONE ? '' : RANK_NAMES[rank]
}

function getTitle(player)
{
    const title = vips[parseInt(player.id)]
    if (title)
        return title
    if (player.lvl)
        return lvlNames[Math.min(lvlNames.length - 1, (parseInt(player.lvl) - 1) >> 3)]
    return ''
}

function createPlayerTip(player)
{
    let tip = '<div style="text-align: center"><b>' + player.nick + '</b>'
    tip += player.ble ? '<b class="bless">' + player.ble + '</b>' : ''
    tip += player.clan ? '[' + player.clan.name + ']<br>' : ''
    tip += '<div style="text-align: center;">' + getTitle(player) + '</div>'
    const rank = getRankNameOf(player)
    tip += rank ? '<i style="color: #f90">' + rank + '</i>' : ''
    tip += (player.attr & 1) ? '<img src=img/mute.gif>' : ''
    tip += '</div>'
    return tip
}

function parseTip(player)
{
    if (INTERFACE === 'NI')
    {
        let tip = ''
        const rank = getRankNameOf(player)
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

        const title = getTitle(player.d)
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
}


function getNpcTypeName(worldType)
{
    if (worldType > 99)
        return 'tytan'
    if (worldType > 79)
        return 'heros'
    if (worldType > 29)
        return 'elita III'
    if (worldType > 19)
        return 'elita II'
    if (worldType > 9)
        return 'elita'
    return ''
}

function getNpcDanger(npc)
{
    if (npc.type === 2 || npc.type === 3)
    {
        const lvlDiff = npc.lvl - hero.lvl
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

function createNpcTip(npc)
{
    let tip = '<b>' + npc.nick + '</b>'
    if (npc.type === 4)
        return tip

    const type = getNpcTypeName(npc.wt)
    tip += type ? '<i>' + type + '</i>' : ''

    if (npc.type <= 0)
        return tip

    const danger = getNpcDanger(npc)
    const grp = npc.grp ? ', w grupie' : ''
    tip += '<span ' + danger.style + '>' + danger.str + grp + '</span>'
    return tip
}

export function initTips()
{
    if (INTERFACE === 'NI')
    {
        const othersDrawableList = Engine.others.getDrawableList
        Engine.others.getDrawableList = function ()
        {
            const list = othersDrawableList()
            for (const i in list)
            {
                if (list[i].isPlayer)
                    list[i].tip[0] = parseTip(list[i], false)
            }
            return list
        }

        Engine.hero.createStrTip = function ()
        {
            return parseTip(Engine.hero, true)
        }
        Engine.hero.tip[0] = Engine.hero.createStrTip()
    }
    else
    {
        g.loadQueue.push({
            fun: function ()
            {
                $('#hero').attr('tip', createPlayerTip(hero))

                g.tips.other = createPlayerTip
                g.tips.npc = createNpcTip
            }
        })
    }
}
