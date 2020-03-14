/**
 * Name: NerthusBaseFunctions
 * Pierwszy plik z dodatku Nerthusa
 * Zawiera stworzenie obiktu nerthus i jego podstawowe funkcje
 * Zawiera stare opcja jak opisy zamiast lvli
**/



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



nerthus.base = {}
nerthus.base.start = function()
{
    nerthus.loadSettings()
    nerthus.setChatInfo()
    nerthus.setEnterMsg()

    nerthus.startObservingMapChange_SI()
}
