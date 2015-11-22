/**	Name: NerthusBaseFunctions
	Pierwszy plik z dodatku Nerthusa
	Zawiera stworzenie obiktu nerthus i jego podstawowe funkcje
	Zawiera stare opcja jak opisy zamiast lvli
**/
try{
	//daty zwykła i GMT
	nerthus.date = new Date();
	nerthus.dateGMT = new Date(parseInt(nerthus.date) + nerthus.date.getTimezoneOffset()*60*1000);

	//zwraca sezon 1 - wiosna, 2 - lato, 3 - jesień, 4 - zima
	nerthus.season = function()
	{
		var retVal=1;
		var a=new Date();
		var b=new Date();

		//wiosna 21.3 - 22.6
		a.setUTCDate(21); a.setUTCMonth(2);
		b.setUTCDate(22); b.setUTCMonth(5);
		if( nerthus.dateGMT>=a && nerthus.dateGMT<b )
		{
			retVal = 1;
		}
		//lato 22.6 - 23.9
		a.setUTCDate(21); a.setUTCMonth(5);
		b.setUTCDate(23); b.setUTCMonth(8);
		if( nerthus.dateGMT>=a && nerthus.dateGMT<b )
		{
			retVal = 2;
		}
		//lato 23.9 - 22.12
		a.setUTCDate(23); a.setUTCMonth(8);
		b.setUTCDate(22); b.setUTCMonth(10);
		if( nerthus.dateGMT>=a && nerthus.dateGMT<b )
		{
			retVal = 3;
		}
		//zima 22.12 - 21.3
		a.setUTCDate(22); a.setUTCMonth(10);
		b.setUTCDate(21); b.setUTCMonth(2);
		if( nerthus.dateGMT>=a || nerthus.dateGMT<b )
		{
			retVal = 4;
		}

		return retVal;
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

	//sprawdza czy wip tak zwraca jego index+1 nie zwraca 0
	nerthus.isVip = function(player_id)
    {
        return nerthus.vipList.indexOf(player_id)+1
    }

    nerthus.Settings='111111';
	nerthus.loadSettings = function()
	{
		try{
		    var cookie = getCookie('nerthusCookie');
			cookie=cookie.split('|');
			nerthus.Settings=cookie[1];
		}catch(e){}
	}

	nerthus.storeSettings = function(settings)
	{
        nerthus.Settings = settings
		data = new Date();
		data.setTime(data.getTime()+30758400000);
		setCookie('nerthusCookie', parseInt(nerthus.dateGMT) + '|' + nerthus.Settings, data);
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
		var vip;
		if( vip= nerthus.isVip(parseInt(player.id)))
            return nerthus.vipNames[vip-1]
		else if (player.lvl)
            return nerthus.lvlNames[Math.min(nerthus.lvlNames.length - 1, (player.lvl - 1) >> 3)]
        return ""
    }

    nerthus.loadSettings();
    nerthus.setChatInfo();
    nerthus.setEnterMsg();

}catch(e){log('NerthusBase Error: '+e.message)}
try{

    hero.tip = function()
    {
        var tip = "<b><font color='white'>" + this.nick + "</font></b>"
        tip += "<center>" + nerthus.tips.title(this) + "</center>"
        tip += "<i><font color='red'>" + nerthus.tips.rank(this) + "</font></i>"
        return tip
    }
    g.loadQueue.push({fun:function()
    {
        hero.rights = hero.uprawnienia
        $("#hero").attr('tip', function(){return hero.tip()})
    }, data:""})

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
	};

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
	};

}catch(e){log('NerthusOld Error: '+e.message,1)}
