nerthus.chatCmd = {}
nerthus.chatCmd.map = {}
nerthus.chatCmd.public_map = {}

nerthus.chatCmd.cards = {}
nerthus.chatCmd.cards.currentDecks = {}
nerthus.chatCmd.cards.pseudoRandom = function (seed)
{
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
}
nerthus.chatCmd.cards.getCard = function (deckId, ts)
{
    if (!this.currentDecks[deckId]) this.currentDecks[deckId] = []

    const card = Math.floor(this.pseudoRandom(ts) * 52) + 1
    const value = Math.floor(card / 4)
    const color = card % 4

    const len = this.currentDecks[deckId].length
    if (len === 52)
        return false
    for (let i = 0; i < len; i++)
        if (this.currentDecks[deckId][i] === card)
            return this.getCard(deckId, ts + 2901)

    this.currentDecks[deckId].push(card)
    return [this.values[value], this.colors[color]]
}

nerthus.chatCmd.cards.numbers = [
    "",
    "jedną kartę",
    "dwie karty",
    "trzy karty",
    "cztery karty",
    "pięć kart",
    "sześć kart",
    "siedem kart",
    "osiem kart",
    "dziewięć kart",
    "dziesięć kart"
]
nerthus.chatCmd.cards.colors = [
    "pik",
    "kier",
    "trefl",
    "karo"
]
nerthus.chatCmd.cards.values = [
    "asa",
    "dwójkę",
    "trójkę",
    "czwórkę",
    "piątkę",
    "szóstkę",
    "siódemkę",
    "ósemkę",
    "dziewiątkę",
    "dziesiątkę",
    "waleta",
    "królową",
    "króla"
]

nerthus.chatCmd.run = function (ch)
{
    // return TRUE if you want message to NOT show in chat
    // return FALSE if you want message to show in chat
    // change message by directly editing object passed as reference


    const cmd = this.fetch_cmd(ch)
    if (cmd)
    {
        const callback = this.fetch_callback(cmd, ch)
        if (callback)
        {
            ch.t = this.fixUrl(ch.t)
            NerthusAddonUtils.log("[" + ch.k + "] " + ch.n + " -> " + ch.t) //[which tab] author -> command

            // return negation so that on callbacks returning TRUE or OBJECT message is visible
            // and on callbacks returning FALSE or UNDEFINED it is not
            return !callback(ch)
        }
        return false
    }
    return false
}

nerthus.chatCmd.run_ni = function (e)
{
    let ch = e[1],
        $msg = e[0]

    if (ch.s !== "abs" && ch.s !== "") return

    const cmd = this.fetch_cmd(ch)
    //if there is a command
    if (cmd)
    {
        const callback = this.fetch_callback(cmd, ch)
        //if user typing command have permission for it
        if (callback)
        {
            ch.t = this.fixUrl(ch.t)
            NerthusAddonUtils.log("[" + ch.k + "] " + ch.n + " -> " + ch.t) //[which tab] author -> command

            //if after executing command you need to show results on chat
            if (callback(ch))
            {
                $msg.addClass(ch.s)
                let content = $msg.children().eq(2).contents()
                $msg.children(2).addClass(ch.s)
                for (let i = 0; i < content.length; i++)
                {
                    let text = content.eq(i)
                    if (i === 0)
                        text.replaceWith(e[1].t)
                    else
                        text.remove()
                }
                $msg.children().eq(0).contents().eq(0).replaceWith(ch.n)
            }
            else
                $msg.remove()

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
    {
        const command = RegExp(/^\*(\S+)/).exec(ch.t)
        //fixes bug with /dice, and presumably '* text' messages
        if (command)
            return command[1]
    }
}

nerthus.chatCmd.fetch_callback = function (cmd, ch)
{
    if ((nerthus.isNarr(ch.n) || nerthus.isRad(ch.n) || nerthus.isSpec(ch.n)) && this.map[cmd])
        return this.map[cmd]
    else
        return this.public_map[cmd]
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
    const map_url = ch.t.split(" ").slice(1).join(" ")
    nerthus.worldEdit.changeMap(map_url, 1)

    return false
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

    return false
}

nerthus.chatCmd.map["addGraf"] = function (ch)
{  //cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol, cmd[5]=map_id
    const cmd = ch.t.split(" ").slice(1).join(" ").split(",")
    const x = parseInt(cmd[0])
    const y = parseInt(cmd[1])
    const _url = cmd[2]
    const name = cmd[3]
    const isCol = parseInt(cmd[4]) > 0
    const map_id = cmd[5]

    nerthus.worldEdit.addNpc(x, y, _url, name, isCol, map_id)

    return false
}

nerthus.chatCmd.map["delGraf"] = function(ch)
{
    const cmd = ch.t.split(" ")[1].split(",")
    const x = parseInt(cmd[0])
    const y = parseInt(cmd[1])
    const map_id = cmd[2]

    nerthus.worldEdit.deleteNpc(x, y, map_id)

    return false
}

nerthus.chatCmd.map["hide"] = function(ch)
{
    const cmd = ch.t.split(" ")[1].split(",")
    const id = parseInt(cmd[0])

    nerthus.worldEdit.hideGameNpc(id)

    return false
}

nerthus.chatCmd.map["weather"] = function(ch)
{
    var weather_id = parseInt(ch.t.split(" ")[1])
    nerthus_weather_bard_id = weather_id
    nerthus.weather.set_weather(weather_id)

    return false
}

nerthus.chatCmd.public_map["me"] = function (ch)
{
    ch.s = "me"
    ch.n = ""
    ch.t = ch.t.replace(/^\*me /, "")
    return ch
}

//playing cards
//todo varying deck sizes
nerthus.chatCmd.public_map["draw"] = function (ch)
{
    const nick = ch.n
    ch.s = "draw"
    ch.n = ""

    if(ch.k !== 0)
        ch.t = nick + " próbował zagrać w karty, ale za bardzo się z nimi krył (można grać tylko na czacie głównym)."
    else
    {
        const cmd = ch.t.split(" ").slice(1).join(" ").split(",")
        const number_of_cards = parseInt(cmd[0])
        const deck_number = cmd[1] ? cmd[1] : "1"

        if (nerthus.chatCmd.cards.currentDecks[deck_number] && nerthus.chatCmd.cards.currentDecks[deck_number].length === 52)
            ch.t = nick + " próbował pociągnąć kartę z talii numer " + deck_number + ", ale nie było w niej już ani jednej karty."
        else
        {
            const ts = ch.ts

            let cards = ""
            let cardDrawnCount = 0
            let lastCardDrawn = "."
            for (let i = 0; i < number_of_cards; i++)
            {
                const card = nerthus.chatCmd.cards.getCard(deck_number, ts)
                if (!card)
                {
                    lastCardDrawn = ", tym samym nie pozostawiając już ani jednej karty."
                    break
                }
                if (i === 0)
                    cards += card[0] + " " + card[1]
                else if (i + 1 === number_of_cards)
                    cards += " i " + card[0] + " " + card[1]
                else
                    cards += ", " + card[0] + " " + card[1]

                cardDrawnCount++
            }

            if (nerthus.cardCheat || nick === nerthus.chatCmd.getHeroNick())
                ch.t = nick + " pociągnął " + cards + " z talii numer " + deck_number + lastCardDrawn
            else
                ch.t = nick + " pociągnął " + nerthus.chatCmd.cards.numbers[cardDrawnCount] + " z talii numer " + deck_number + lastCardDrawn
        }
    }
    return ch
}

nerthus.chatCmd.public_map["shuffle"] = function (ch)
{

    const nick = ch.n
    ch.s = "draw"
    ch.n = ""

    if(ch.k !== 0)
        ch.t = nick + " próbował przetasować talię, ale pogubił karty (można tasować tylko na czacie głównym)."
    else
    {
        const cmd = ch.t.split(" ").slice(1).join(" ").split(",")
        const deck_number = cmd[0]
        ch.t = nick + " przestasował talię nr " + deck_number
        nerthus.chatCmd.cards.currentDecks[deck_number] = []
    }
    return ch
}

nerthus.chatCmd.createStyles = function ()
{
    const style = document.createElement('style')
    style.innerHTML = ".me{ color: #f70 !important }"
        + ".sys_comm{ color: #f33 !important }"
        + ".nar{ color: lightblue !important }"
        + ".nar2{ color: #D6A2FF !important }"
        + ".nar3{ color: #00CED1 !important }"
        + ".dial1{ color: #33CC66 !important }"
        + ".dial2{ color: #CC9966 !important }"
        + ".dial3{ color: #D3D3D3 !important }"
        + ".dial666{ color: #FF66FF !important }"

    return style
}

nerthus.chatCmd.getHeroNick = function ()
{
    if (hero)
        return hero.nick
    else
        return Engine.hero.d.nick
}

nerthus.chatCmd.start = function()
{
    document.head.appendChild(this.createStyles())

    g.chat.parsers.push(nerthus.chatCmd.run.bind(this))
}

nerthus.chatCmd.start_ni = function()
{
    if (typeof nerthus.mapDraw !== "function")
        nerthus.mapDraw = Engine.map.draw

    document.head.appendChild(this.createStyles())

    API.addCallbackToEvent('newMsg', this.run_ni.bind(this))
    API.addCallbackToEvent('updateMsg', this.run_ni.bind(this))
}
