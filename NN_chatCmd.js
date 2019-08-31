nerthus.chatCmd = {}
nerthus.chatCmd.map = {}
nerthus.chatCmd.public_map = {}

nerthus.chatCmd.cards = {}
nerthus.chatCmd.cards.currentDecks = {}
nerthus.chatCmd.cards.currentDecks[52] = {}
nerthus.chatCmd.cards.currentDecks[54] = {}
nerthus.chatCmd.cards.saveCardsForSession = function (data, ts)
{
    sessionStorage.setItem("nerthus_cards_" + ts, JSON.stringify(data))
}
nerthus.chatCmd.cards.loadCardsFromSession = function (ts)
{
    const cards = sessionStorage.getItem("nerthus_cards_" + ts)
    if (cards)
        return JSON.parse(cards)
}
nerthus.chatCmd.cards.pseudoRandom = function (seed)
{
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
}
nerthus.chatCmd.cards.getCardFromId = function (card_id)
{
    let valueName, colorName
    if (card_id === 52 || card_id === 53)
    {
        valueName = "jokera"
        if (card_id === 52)
            colorName = "czarnego"
        if (card_id === 53)
            colorName = "czerwonego"
    }
    else
    {
        const value = Math.floor(card_id / 4)
        const color = card_id % 4
        valueName = this.values[value]
        colorName = this.colors[color]
    }

    return {
        id: card_id,
        value: valueName,
        color: colorName
    }
}
nerthus.chatCmd.cards.getCard = function (deck_id, ts, deck_type)
{
    if (!this.currentDecks[deck_type][deck_id]) this.currentDecks[deck_type][deck_id] = []

    const card_id = Math.floor(this.pseudoRandom(ts) * deck_type)

    const len = this.currentDecks[deck_type][deck_id].length
    if (len === deck_type)
        return false
    for (let i = 0; i < len; i++)
        if (this.currentDecks[deck_type][deck_id][i] === card_id)
            return this.getCard(deck_id, ts + 2901, deck_type)

    this.currentDecks[deck_type][deck_id].push(card_id)

    return nerthus.chatCmd.cards.getCardFromId(card_id)
}
nerthus.chatCmd.cards.isDeckEmpty = function (deck_type, deck_number)
{
    return this.currentDecks[deck_type][deck_number] &&
        this.currentDecks[deck_type][deck_number].length === deck_type
}
nerthus.chatCmd.cards.getDrawnCards = function (number_of_cards, deck_number, deck_type, ts, nick)
{
    deck_type = deck_type === 54 ? deck_type : 52

    const savedCards = this.loadCardsFromSession(ts)
    if (savedCards)
    {
        this.currentDecks[deck_type][deck_number] = savedCards.cards
        return savedCards.text
    }

    if (this.isDeckEmpty(deck_type, deck_number))
        return nick + " próbował pociągnąć kartę z talii numer " + deck_number + ", ale nie było w niej już ani jednej karty."


    let cards = ""
    let cardDrawnCount = 0
    let endText = "."
    for (let i = 0; i < number_of_cards; i++)
    {
        const card = this.getCard(deck_number, ts, deck_type)
        if (!card)
        {
            endText = ", tym samym nie pozostawiając już ani jednej karty."
            break
        }
        if (i === 0)
            cards += card.value + " " + card.color
        else if (i + 1 === number_of_cards)
            cards += " i " + card.value + " " + card.color
        else
            cards += ", " + card.value + " " + card.color

        cardDrawnCount++
    }

    if (this.isDeckEmpty(deck_type, deck_number))
        endText = ", tym samym nie pozostawiając już ani jednej karty."
    else
        endText = ", zostawiając na stole " +
            (deck_type - this.currentDecks[deck_type][deck_number].length) +
            " z " + deck_type + " kart."


    let returnText = ""
    if (localStorage.nerthus_cardCheat || nick === nerthus.chatCmd.getHeroNick())
        returnText = nick + " pociągnął " + cards + " z talii numer " + deck_number + endText
    else
        returnText = nick + " pociągnął " + this.numbers[cardDrawnCount] + " z talii numer " + deck_number + endText

    const data = {
        text: returnText,
        cards: this.currentDecks[deck_type][deck_number]
    }
    nerthus.chatCmd.cards.saveCardsForSession(data, ts)
    return returnText
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


nerthus.chatCmd.handleChatObj = function (ch)
{
    // change message by directly editing object passed as reference

    const cmd = this.fetch_cmd(ch)
    if (cmd)
    {
        const callback = this.fetch_callback(cmd, ch)
        if (callback)
        {
            ch.t = this.fixUrl(ch.t)
            NerthusAddonUtils.log("[" + ch.k + "] " + ch.n + " -> " + ch.t) //[which tab] author -> command

            return callback(ch)
        }
        return true
    }
    return true
}

nerthus.chatCmd.run = function (ch)
{
    // return TRUE if you want message to NOT show in chat
    // return FALSE if you want message to show in chat

    // function returns negation so that on callbacks returning TRUE or OBJECT message is visible
    // and on callbacks returning FALSE or UNDEFINED it is not
    return !this.handleChatObj(ch)
}

nerthus.chatCmd.edit_ni_msg = function ($msg, ch)
{
    $msg.addClass(ch.s)
    const content = $msg.children().eq(2).contents()
    $msg.children(2).addClass(ch.s)
    for (let i = 0; i < content.length; i++)
    {
        const text = content.eq(i)
        if (i === 0)
            text.replaceWith(ch.t)
        else
            text.remove()
    }
    $msg.children().eq(0).contents().eq(0).replaceWith(ch.n)
}

nerthus.chatCmd.run_ni = function (e)
{
    const $msg = e[0],
            ch = e[1]

    if (ch.s !== "abs" && ch.s !== "") return

    const chatParse = this.handleChatObj(ch)
    if (typeof chatParse === "object")
        this.edit_ni_msg($msg, ch)
    else if (chatParse === false)
        $msg.remove()
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
nerthus.chatCmd.public_map["draw"] = function (ch)
{
    const nick = ch.n
    ch.s = "draw"
    ch.n = ""

    if (ch.k !== 0)
        ch.t = nick + " próbował zagrać w karty, ale za bardzo się z nimi krył (można grać tylko na czacie głównym)."
    else
    {
        const cmd = ch.t.split(" ").slice(1).join(" ").split(",")
        const number_of_cards = parseInt(cmd[0])
        const deck_number = cmd[1] ? parseInt(cmd[1]) : 1
        const deck_type = parseInt(cmd[2])

        ch.t = nerthus.chatCmd.cards.getDrawnCards(number_of_cards, deck_number, deck_type, ch.ts, nick)
    }
    return ch
}

nerthus.chatCmd.public_map["dobierz"] = nerthus.chatCmd.public_map["draw"]

nerthus.chatCmd.public_map["shuffle"] = function (ch)
{

    const nick = ch.n
    ch.s = "draw"
    ch.n = ""


    if (ch.k !== 0)
        ch.t = nick + " próbował przetasować talię, ale pogubił karty (można tasować tylko na czacie głównym)."
    else
    {
        const cmd = ch.t.split(" ").slice(1).join(" ").split(",")
        const deck_number = cmd[0]
        let deck_type = parseInt(cmd[1])
        deck_type = deck_type === 54 ? deck_type : 52

        const savedCards = nerthus.chatCmd.cards.loadCardsFromSession(ts)
        if(savedCards)
        {
            nerthus.chatCmd.cards.currentDecks[deck_type][deck_number] = savedCards.cards
            ch.t = savedCards.text
        }
        else
        {
            ch.t = nick + " przestasował talię numer " + deck_number + ", która składała się z " + deck_type + " kart."
            nerthus.chatCmd.cards.currentDecks[deck_type][deck_number] = []

            const data = {
                text: ch.t,
                cards: nerthus.chatCmd.cards.currentDecks[deck_type][deck_number]
            }
            nerthus.chatCmd.cards.saveCardsForSession(data, ch.ts)
        }
    }
    return ch
}

nerthus.chatCmd.public_map["tasuj"] = nerthus.chatCmd.public_map["shuffle"]

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
    if (typeof hero !== "undefined")
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

    const setAvatarData = Engine.chat.setAvatarData
    Engine.chat.setAvatarData = function(tpl, d, pos) {
        if(d.n === "") return
        return setAvatarData(tpl, d, pos)
    }
}
