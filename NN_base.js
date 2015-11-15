/**	Name: NerthusBaseFunctions
	Pierwszy plik z dodatku Nerthusa
	Zawiera stworzenie obiktu nerthus i jego podstawowe funkcje
	Zawiera stare opcja jak opisy zamiast lvli
**/
try{

	//stworzenie obiektu nerthus;
	nerthus = {};
	
	//daty zwykła i GMT
	nerthus.date = new Date();
	nerthus.dateGMT = new Date(nerthus.date*1 + nerthus.date.getTimezoneOffset()*60*1000);

    nerthus.grafPath = {}
	nerthus.grafPath.loading='http://img826.imageshack.us/img826/4792/loadingnerthus.png';
	nerthus.grafPath.dazed='http://i55.tinypic.com/2mds2so.png';
	nerthus.grafPath.chat='http://img180.imageshack.us/img180/3678/okienko3.png';
	nerthus.grafPath.weather='http://fs5.directupload.net/images/151113/38zszora.gif';
	nerthus.grafPath.panelTop='http://img441.imageshack.us/img441/9302/nerthuspanel.png';
	nerthus.grafPath.ithan='http://www.iv.pl/images/91715678912998391289.png';
	nerthus.grafPath.musicButtons='http://img692.imageshack.us/img692/5538/iconsc.gif';
	
	//zwraca date zmian w GMT
	nerthus.czasZmian = function()
	{
	 var retVal = new Date();
	 var a=nerthus.dataZmian.split('.');
	 retVal.setFullYear(a[2],a[1]-1,a[0])
	 var b=nerthus.godzinaZmian.split(':');
	 retVal.setHours(b[0],b[1]);

	 retVal=retVal*1+retVal.getTimezoneOffset()*60*1000;
	 return new Date(retVal); 
	}
	
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
	
	//klejenie tablicy w string - do zapisu ciastek itp
	nerthus.glue = function(pieces,glue)	
	{
		var retVal='';
		var tGlue='';
		for (i in pieces) 
		{
			  retVal += tGlue + pieces[i];   
			  tGlue = glue;
		}
		return retValue;
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
	//dwie funkcje do chatu i tipów other.
	//sprawdzanie uprawnień do narracji
	nerthus.isNarr = function(a)
	{
		return nerthus.NerthusNarr.indexOf(a) >= 0
	}

	//sprawdzanie czy radny
	nerthus.isRad = function(a)
	{
		return nerthus.NerthusRad.indexOf(a) >= 0
   	}

    //sprawdzanie czy special
	nerthus.isSpec = function(a)
	{
		return nerthus.NerthusSpec.indexOf(a) >= 0
   	}
	
	//sprawdza czy wip tak zwraca jego index+1 nie zwraca 0
	nerthus.isVip = function(a)
    { 
        return nerthus.vipList.indexOf(a)+1
    }

	//ładowanie ustawień z ciastek
	nerthus.loadSettings = function()
	{
		try{
		    var cookie = getCookie('nerthusCookie');
			cookie=cookie.split('|');
			nerthus.LastVisitTime=new Date(cookie[0]*1);
			nerthus.Settings=cookie[1];
		}catch(e){}	
	}

	//zapisywanie samej daty - panel nie
	nerthus.saveDate = function()
	{
		data = new Date();
		data.setTime(data.getTime()+30758400000);
		setCookie('nerthusCookie', nerthus.dateGMT*1+'|'+nerthus.Settings + '|' + nerthus.altPlaylistSrc.trim() , data);
	}

	//zapisywanie daty i ustawień - panel tak
	nerthus.saveDateAndSettings = function()
	{
		try{
		    nerthus.Settings='';
		    if($('#panCbNoc').attr('checked')){nerthus.Settings+='1';}else{nerthus.Settings+='0'};
		    nerthus.Settings+='0'; //nocnce mapy do wywalenia
            nerthus.Settings+='0';	//muzyka do wywalenia	
		    if($('#panCbPog').attr('checked')){nerthus.Settings+='1';}else{nerthus.Settings+='0'};
		    nerthus.Settings+='0'; //z dysku do wywalenia
		    nerthus.Settings+='0'; //większy chat do wywalenia
		}catch(e){message('nie udało się zapisać')}
		data = new Date();
		data.setTime(data.getTime()+30758400000);
		setCookie('nerthusCookie', nerthus.dateGMT*1 + '|' + nerthus.Settings + '|' + nerthus.altPlaylistSrc.trim(), data);
		message('zapisano, wciśnij f5');
	}

    nerthus.rightsToRank = function (rights)
    {
    	if(rights & 1) return 0 //adm
        if(rights & 16) return 1 //smg
        if(rights & 2) return 2 //mg
        return 3 //mc
    }

    nerthus.getPlayerRank = function (player)
    {
        var d = -1;
		if (player.rights)
        {
			d = nerthus.rightsToRank(player.rights)
        }
        if (nerthus.isNarr(player.nick))
        {
            if(d == 3)
            {
                d = 6 //bard + mc
            } else
            {
                d = 5 //bard
            }
        }
        if (nerthus.isRad(player.nick))
        {
            d = 7 //radny
        }
        if(d > -1)
        {
            return "<i>" + g.names.ranks[d] + "</i>"
        }
        return ""
    }
    
    nerthus.getPlayerTitle = function (player)
    {
    	//sprawdza czy vip, jeśli tak, to daje inny opis	
		var vip;
		if( vip= nerthus.isVip(player.id*1) )
        {
            return "<center>" + nerthus.vipNames[vip-1] + "</center>"; 
        }
		else if (player.lvl) 
        {
            return "<center>" + nerthus.lvlNames[Math.min(nerthus.lvlNames.length - 1, (player.lvl - 1) >> 3)] + "</center>"; 
        }
        return ""
    }

    nerthus.loadSettings();

}catch(e){log('NerthusBase Error: '+e.description)}
try{
	nerthus.NerthusRad=[];
	nerthus.NerthusNarr=[];
	nerthus.lvlNames = ['Ciułacz','Łowca Wilków','Tropiciel Zulusów','Poganiacz Goblinów','Piętno Orków','Miłośnik Harpii','Rezun Olbrzymów','Hycel Gnolli','Koszmar Tolloków','Magazynier Pełną Gębą','Zguba Minotaurów','Niszczyciel Szkieletów','Treser Centaurów','Nieustraszony Pogromca Korsarzy','Tańczący z Mumiami','Szabrownik Wraków','Gobliński Kat','Postrach Berserkerów','Władca Kazamatów','Młot na Czarownice','Dręczyciel Praorków','Zguba Czarnej Gwardii','Poskramiacz Furboli','Egzekutor Myświórów','Wielki Inkwizytor','Zaklinacz Arachnidów','Kat Demonisa','Oprawca Maddoków','Potomek Najwyższych','Piekielny Jeźdźca', 'Ponury Żniwiarz','Gwardzista Piekieł','Tytan'];
	nerthus.vipList=[];
	nerthus.vipNames=[];	
	
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
	g.names.ranks[3] = "Członek Rady";
	g.names.ranks[4] = "Większy Członek Rady";
	g.names.ranks[5] = "Bard";
    g.names.ranks[6] = "Modelator struny";

	g.tips.other = function (a) {   
		var b = "<b>" + a.nick + "</b>";
		if (a.clan != "") {
			b += "[" + a.clan + "]<br>"
		}
        b += nerthus.getPlayerTitle(a)
        b += nerthus.getPlayerRank(a)
		if (a.attr & 1) {
			b += "<img src=img/mute.gif>";
		}
		return b
	};
	
}catch(e){log('NerthusOld Error: '+e.message,1)}
