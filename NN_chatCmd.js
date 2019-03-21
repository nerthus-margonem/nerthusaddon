nerthus.chatCmd = {}
nerthus.chatCmd.map = {}
nerthus.chatCmd.public_map = {}

nerthus.chatCmd.run = function(ch)
{
    let cmd = this.fetch_cmd(ch)
    if(cmd)
    {
        var callback = this.fetch_callback(cmd,ch)
        if(callback)
        {
            ch.t = this.fixUrl(ch.t)
            NerthusAddonUtils.log("["+ch.k+"] " + ch.n + " -> " + ch.t) //gdzie kto co
            return callback(ch)
        }
        return false
    }
    return false
}

nerthus.chatCmd.run_ni = function (e)
{
    if (e[1].s !== "abs" && e[1].s !== "") return
    let clone = JSON.parse(JSON.stringify(e[1]))
    let ch = nerthus.chatCmd.run(clone)
    if (ch)
    {
        if (ch.t === "")
            e[0].remove()
        else
        {
            e[0].addClass(ch.s)
            let content = e[0].children().eq(2).contents()
            e[0].children(2).addClass(ch.s)
            for (let i = 0; i < content.length; i++)
            {
                let text = content.eq(i)
                if (i === 0)
                    text.replaceWith(ch.t)
                else
                    text.replaceWith("")	//delete?
            }
            e[0].children().eq(0).contents().eq(0).replaceWith(ch.n)
        }
    }
}

nerthus.chatCmd.fixUrl = function(text)
{
    let url = RegExp(/(https?)\*Krzywi się\.\*(\S+)/)
    return text.replace(url, "$1:/$2")
}

nerthus.chatCmd.fetch_cmd = function (ch)
{
    if (ch.t[0] === '*')
        return RegExp(/^\*(\S+)/).exec(ch.t)[1]
}

nerthus.chatCmd.fetch_callback = function(cmd,ch)
{
    let callback = this.public_map[cmd]
    if(!callback && (nerthus.isNarr(ch.n) || nerthus.isRad(ch.n) || nerthus.isSpec(ch.n)))
        callback = this.map[cmd]
    return callback
}

nerthus.chatCmd.map["nar"] = function(ch)
{
    ch.s = "nar"
    ch.n = ""
    ch.t = ch.t.replace(/^\*nar1? /,"")
    return ch
}

nerthus.chatCmd.map["nar1"] = nerthus.chatCmd.map["nar"]

nerthus.chatCmd.map["nar2"] = function(ch)
{
    ch.s = "nar2"
    ch.n = ""
    ch.t = ch.t.replace(/^\*nar2 /,"")
    return ch
}

nerthus.chatCmd.map["nar3"] = function(ch)
{
    ch.s = "nar3"
    ch.n = ""
    ch.t = ch.t.replace(/^\*nar3 /,"")
    return ch
}

//shouldn't ch.n be the speaker?
nerthus.chatCmd.map["dial"] = function(ch)
{
    ch.s = "dial1"
    ch.n = ""
    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t)
    return ch
}

nerthus.chatCmd.map["dial1"] = nerthus.chatCmd.map["dial"]

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
    ch.t=ch.t.replace(/^\*sys /,"")
    return ch
}

nerthus.chatCmd.map["map"] = function(ch)
{
    let map_url = ch.t.split(" ").slice(1).join(" ")
    nerthus.worldEdit.changeMap(map_url, 1)
    ch.n = ""
    ch.t = ""
    return ch
}

nerthus.chatCmd.map["light"] = function(ch)
{
    let opacity = ch.t.split(" ")[1]
    if(typeof opacity === "undefined")
        nerthus.worldEdit.changeLight()
    else
    {
        opacity = opacity.replace(",",".")
        nerthus.worldEdit.changeLight(1 - opacity)
    }

    ch.n = ""
    ch.t = ""
    return ch
}

nerthus.chatCmd.map["addGraf"] = function (ch)
{  //cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol
    let cmd = ch.t.split(" ").slice(1).join(" ").split(",")
    let x = parseInt(cmd[0])
    let y = parseInt(cmd[1])
    let _url = cmd[2]
    let name = cmd[3]
    let isCol = parseInt(cmd[4]) > 0

    nerthus.worldEdit.addNpc(x, y, _url, name, isCol)
    ch.n = ""
    ch.t = ""
    return ch
}

nerthus.chatCmd.map["delGraf"] = function(ch)
{
    let cmd = ch.t.split(" ")[1].split(",")
    let x = parseInt(cmd[0])
    let y = parseInt(cmd[1])

    nerthus.worldEdit.deleteNpc(x, y)
    ch.n = ""
    ch.t = ""
    return ch
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
    ch.t=ch.t.replace(/^\*me /,"")
    return ch
}

nerthus.chatCmd.appendStyles = function()
{
    let style = document.createElement('style')
    style.type = "text/css"
    style.innerHTML =  ".me{ color: #e7d798 !important }"
        + ".sys_comm{ color: #f33 !important }"
        + ".nar{ color: lightblue !important }"
        + ".nar2{ color: #D6A2FF !important }"
        + ".nar3{ color: #00CED1 !important }"
        + ".dial1{ color: #33CC66 !important }"
        + ".dial2{ color: #CC9966 !important }"
        + ".dial3{ color: #D3D3D3 !important }"
        + ".dial666{ color: #FF66FF !important }"
    document.head.appendChild(style)
}

nerthus.chatCmd.start = function()
{
    this.appendStyles()

    g.chat.parsers.push(nerthus.chatCmd.run.bind(this))
}

nerthus.chatCmd.start_ni = function()
{
    if (typeof nerthus.mapDraw !== "function")
        nerthus.mapDraw = Engine.map.draw

    this.appendStyles()

    API.addCallbackToEvent('newMsg', this.run_ni)
    API.addCallbackToEvent('updateMsg', this.run_ni)
}
