try{

nerthus.chatCmd = {};
nerthus.chatCmd.map = {};
nerthus.chatCmd.public_map = {};

nerthus.chatCmd.run = function(ch)
{
    var cmd = this.fetch_cmd(ch)
    if(cmd)
    {
        var callback = this.fetch_callback(cmd,ch)
        if(callback)
        {
            log("["+ch.k+"] " + ch.n + " -> " + ch.t) //gdze kto co
            return callback(ch)
        }
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
    var callback = this.public_map[cmd[1]]
    if(!callback && (nerthus.isNarr(ch.n) || nerthus.isRad(ch.n) || nerthus.isSpec(ch.n)))
        callback = this.map[cmd[1]]
    return callback
}

nerthus.chatCmd.map["nar"] = function(ch)
{
    ch.s = "nar";
    ch.n = "";
    ch.t = ch.t.replace(/^\*nar/,"");
}

nerthus.chatCmd.map["nar2"] = function(ch)
{
    ch.s = "nar2";
    ch.n = "";
    ch.t = ch.t.replace(/^\*nar2/,"");
}

nerthus.chatCmd.map["nar3"] = function(ch)
{
    ch.s = "nar3";
    ch.n = "";
    ch.t = ch.t.replace(/^\*nar3/,"");
}

nerthus.chatCmd.map["dial1"] = function(ch)
{
    ch.s = "dial1";
    ch.n = "";
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t);
}

nerthus.chatCmd.map["dial2"] = function(ch)
{
    ch.s = "dial2";
    ch.n = "";
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t);
}

nerthus.chatCmd.map["dial3"] = function(ch)
{
    ch.s ="dial3";
    ch.n ="";
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t);
}

nerthus.chatCmd.map["dial666"] = function(ch)
{
    ch.s ="dial666";
    ch.n ="";
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t);
}

nerthus.chatCmd.makeDialogTextWithSpeaker = function(str)
{
    str = str.split(" ").slice(1).join(" ").split(",");
    return "«"+str[0]+"» " + str.slice(1).join(",");
}

nerthus.chatCmd.map["sys"] = function(ch)
{
    ch.s="sys_comm";
    ch.n="";
    ch.t=ch.t.replace(/^\*sys/,"");
}

nerthus.chatCmd.map["map"] = function(ch)
{
    var map_url = ch.t.split(" ").slice(1).join(" ");
    map_url = nerthus.chatCmd.extractUrlFromDecorator(map_url);
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
    var _url = nerthus.chatCmd.extractUrlFromDecorator(cmd[2]);
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

nerthus.chatCmd.extractUrlFromDecorator = function(text)
{
    if(text[0]=='<') //is text wrapped by html tag
    {
        var url = RegExp(/goToUrl\(\"(\S+)\"\)/).exec(text);
        if(url) return "http://" + url[1];
    }
    return text;
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
    ch.s="me";
    ch.n="";
    ch.t=ch.t.replace(/^\*me/,"");
}

nerthus.chatCmd.start = function()
{
    //style do dialogów
    $("<style type='text/css'> #chattxt .nar2{ color:#D6A2FF ; } </style>").appendTo("head");
    $("<style type='text/css'> #chattxt .nar3{ color:#00CED1 ; } </style>").appendTo("head");
    $("<style type='text/css'> #chattxt .dial1{ color:#33CC66 ; } </style>").appendTo("head");
    $("<style type='text/css'> #chattxt .dial2{ color:#CC9966 ; } </style>").appendTo("head");
    $("<style type='text/css'> #chattxt .dial3{ color:#D3D3D3 ; } </style>").appendTo("head");
    $("<style type='text/css'> #chattxt .dial666{ color:#FF66FF ; } </style>").appendTo("head");
    g.chat.parsers.push(nerthus.chatCmd.run.bind(this));
}

nerthus.chatCmd.start()

}catch(e){log('nerthus chatCmd: '+e.message,1);}

