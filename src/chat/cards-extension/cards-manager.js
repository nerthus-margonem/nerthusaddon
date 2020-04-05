
const currentDecks = {}
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
