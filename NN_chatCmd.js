try{

nerthus.chatCmd = {};
nerthus.chatCmd.map = {};
nerthus.chatCmd.public_map = {};

nerthus.chatCmd.run = function(ch)
{
    let cmd = this.fetch_cmd(ch)
    if(cmd)
    {
        var callback = this.fetch_callback(cmd,ch)
        if(callback)
        {
            ch.t = this.fixUrl(ch.t)
            log("["+ch.k+"] " + ch.n + " -> " + ch.t) //gdzie kto co
            return callback(ch)
        }
        return false
    }
    return false
}

nerthus.chatCmd.run_ni = function(e)
{
    if (e[1].s !== "abs" && e[1].s !== "") return;
    let clone = JSON.parse(JSON.stringify(e[1]))
    let ch = nerthus.chatCmd.run(clone)
    if(ch) {
        e[0].addClass(ch.s)
        e[0].children().eq(2).contents().eq(0).replaceWith(ch.t)
        e[0].children(2).addClass(ch.s)
        e[0].children().eq(0).contents().eq(0).replaceWith(ch.n)
    }
}

nerthus.chatCmd.fetch_cmd = function(ch)
{
    if(ch.t[0]=='*')
        return RegExp(/^\*(\S+)/).exec(ch.t)
    return null
}

nerthus.chatCmd.fetch_callback = function(cmd,ch)
{
    let callback = this.public_map[cmd[1]]
    if(!callback && (nerthus.isNarr(ch.n) || nerthus.isRad(ch.n) || nerthus.isSpec(ch.n)))
        callback = this.map[cmd[1]]
    return callback
}

nerthus.chatCmd.map["nar"] = function(ch)
{
    ch.s = "nar"
    ch.n = ""
    ch.t = ch.t.replace(/^\*nar/,"")
    return ch
}

nerthus.chatCmd.map["nar2"] = function(ch)
{
    ch.s = "nar2"
    ch.n = ""
    ch.t = ch.t.replace(/^\*nar2/,"")
    return ch
}

nerthus.chatCmd.map["nar3"] = function(ch)
{
    ch.s = "nar3"
    ch.n = ""
    ch.t = ch.t.replace(/^\*nar3/,"")
    return ch
}

nerthus.chatCmd.map["dial1"] = function(ch)
{
    ch.s = "dial1"
    ch.n = ""
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t)
    return ch
}

nerthus.chatCmd.map["dial2"] = function(ch)
{
    ch.s = "dial2"
    ch.n = ""
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t)
    return ch
}

nerthus.chatCmd.map["dial3"] = function(ch)
{
    ch.s ="dial3"
    ch.n =""
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t)
    return ch
}

nerthus.chatCmd.map["dial666"] = function(ch)
{
    ch.s ="dial666"
    ch.n =""
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t)
    return ch
}

nerthus.chatCmd.makeDialogTextWithSpeaker = function(str)
{
    str = str.split(" ").slice(1).join(" ").split(",")
    return "«"+str[0]+"» " + str.slice(1).join(",")
}

nerthus.chatCmd.map["sys"] = function(ch)
{
    ch.s="sys_comm"
    ch.n=""
    ch.t=ch.t.replace(/^\*sys/,"")
    return ch
}

nerthus.chatCmd.map["map"] = function(ch)
{
    var map_url = ch.t.split(" ").slice(1).join(" ");
    $("#ground").css("backgroundImage","url(" + map_url + ")")
    return true;
}

nerthus.chatCmd.map["light"] = function(ch)
{
    var opacity = ch.t.split(" ")[1];
    $("#base").css("opacity",opacity);
    return true;
}

nerthus.chatCmd.map["addGraf"] = function(ch)
{  //cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol
    var cmd = ch.t.split(" ").slice(1).join(" ").split(",");
    var x = parseInt(cmd[0]);
    var y = parseInt(cmd[1]);
    var _url = cmd[2];
    var _tip = cmd[3] ? ' tip="<b>'+cmd[3]+'</b>" ctip="t_npc"' : "";
    var isCol = parseInt(cmd[4]);
    $('<img id="_ng-' + cmd[0] + '-' + cmd[1] + '" src="'+ _url +'"'+_tip+'>').css("position","absolute").appendTo('#base')
        .load(function()
        {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
            var _x = 32 * x + 16 - Math.floor($(this).width() / 2);
            var _y = 32 * y + 32 - $(this).height();
            $(this).css({top:"" + _y + "px", left: "" + _x + "px"}).css("z-index", y * 2 + 9);
        })
    if(isCol) g.npccol[ x + 256 * y] = true;
    return true;
}

nerthus.chatCmd.fixUrl = function(text)
{
    let url = RegExp(/(https?)\*Krzywi się\.\*(\S+)/)
    return text.replace(url, "$1:/$2")
}


nerthus.chatCmd.map["delGraf"] = function(ch)
{
    var cmd = ch.t.split(" ")[1].split(",");
    var x = parseInt(cmd[0]);
    var y = parseInt(cmd[1]);
    $('#_ng-' + x + '-' + y).remove();
    delete g.npccol[x + 256 * y];
    return true;
}

nerthus.chatCmd.map["weather"] = function(ch)
{
    var weather_id = parseInt(ch.t.split(" ")[1])
    nerthus_weather_bard_id = weather_id
    try
    {
        nerthus.weather.set_weather(weather_id)
    }catch(e)
    {
        //nothing to do now
    }
    return true;
}

nerthus.chatCmd.public_map["me"] = function(ch)
{
    ch.s="me"
    ch.n=""
    ch.t=ch.t.replace(/^\*me/,"")
    return ch
}

nerthus.chatCmd.start = function()
{
    //style do dialogów
    $("<style type='text/css'>.sys_comm{ color: #f33 !important }</style>").appendTo("head")
    $("<style type='text/css'>.nar{ color: lightblue !important }</style>").appendTo("head")
    $("<style type='text/css'>.nar2{ color: #D6A2FF !important }</style>").appendTo("head")
    $("<style type='text/css'>.nar3{ color: #00CED1 !important }</style>").appendTo("head")
    $("<style type='text/css'>.dial1{ color: #33CC66 !important }</style>").appendTo("head")
    $("<style type='text/css'>.dial2{ color: #CC9966 !important }</style>").appendTo("head")
    $("<style type='text/css'>.dial3{ color: #D3D3D3 !important }</style>").appendTo("head")
    $("<style type='text/css'>.dial666{ color: #FF66FF !important }</style>").appendTo("head")
    if(nerthus.interface === "ni") {
        API.addCallbackToEvent('newMsg', this.run_ni)
        API.addCallbackToEvent('updateMsg', this.run_ni)
    }
    else
        g.chat.parsers.push(nerthus.chatCmd.run.bind(this))
}

}catch(e){log('nerthus chatCmd: '+e.message,1);}

