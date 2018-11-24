try
{

nerthus.zodiac = {}
nerthus.zodiac.icon = nerthus.addon.fileUrl("img/zodiacIcons.gif")
nerthus.zodiac.SIGNS = {
    AQUARIUS    : 0,
    PISCES      : 1,
    ARIES       : 2,
    TAURUS      : 3,
    GEMINI      : 4,
    CANCER      : 5,
    LEO         : 6,
    VIRGO       : 7,
    LIBRA       : 8,
    SCORPIO     : 9,
    SAGITTARIUS : 10,
    CAPRICORN   : 11
}
nerthus.zodiac.sign = nerthus.zodiac.SIGNS.CAPRICORN
nerthus.zodiac.calculate = function(date)
{
    if (date === undefined)
        date = new Date();
    let makeStartDate = function(day,month)
    {
        let date = new Date()
        date.setUTCMonth(month - 1, day)
        date.setUTCHours(0, 0, 0)
        return date
    }
    const SIGNS =
    [
        {date : makeStartDate(22, 12), sign: this.SIGNS.CAPRICORN},  // Koziorożec (22 grudnia – 19 stycznia)
        {date : makeStartDate(22, 11), sign: this.SIGNS.SAGITTARIUS},// Strzelec (22 listopada – 21 grudnia)
        {date : makeStartDate(23, 10), sign: this.SIGNS.SCORPIO},    // Skorpion (23 października – 21 listopada)
        {date : makeStartDate(23, 9),  sign: this.SIGNS.LIBRA},      // Waga (23 września – 22 października)
        {date : makeStartDate(24, 8),  sign: this.SIGNS.VIRGO},      // Panna (24 sierpnia – 22 września)
        {date : makeStartDate(23, 7),  sign: this.SIGNS.LEO},        // Lew (23 lipca – 23 sierpnia)
        {date : makeStartDate(22, 6),  sign: this.SIGNS.CANCER},     // Rak (22 czerwca – 22 lipca)
        {date : makeStartDate(23, 5),  sign: this.SIGNS.GEMINI},     // Bliźnięta (23 maja – 21 czerwca)
        {date : makeStartDate(20, 4),  sign: this.SIGNS.TAURUS},     // Byk (20 kwietnia – 22 maja)
        {date : makeStartDate(21, 3),  sign: this.SIGNS.ARIES},      // Baran (21 marca – 19 kwietnia)
        {date : makeStartDate(19, 2),  sign: this.SIGNS.PISCES},     // Ryby (19 lutego – 20 marca)
        {date : makeStartDate(20, 1),  sign: this.SIGNS.AQUARIUS},   // Wodnik (20 stycznia – 18 lutego)
        {date : makeStartDate(1,  1),  sign: this.SIGNS.CAPRICORN}   // Koziorożec
    ]
    return SIGNS.find(function(SIGN){ return SIGN.date <= date }).sign
}

nerthus.zodiac.set_zodiac = function(sign)
{
    this.sign = parseInt(sign)
    $('#nZodiac').css('background', 'url(' + this.icon + ') -' + this.sign * 55 + 'px -' + this.sign * 55 + 'px')
}

nerthus.zodiac.run = function ()
{
    //ikonka zodiaku
    $('<div id="nZodiac" style="z-Index:300; height:55px; width: 55px; opacity: 0.8; position: absolute; top: 55px; left: 0px; cursor: pointer"></div>').appendTo('#centerbox2')
        .mouseenter(function(){ $("#nZodiacDesc").fadeIn(500).html(this.descriptions[this.sign][0]) }.bind(this))
        .mouseleave(function(){ $("#nZodiacDesc").fadeOut(500) })
        .click(function(){
            if ($("#nZodiacDesc").html() === nerthus.zodiac.descriptions[nerthus.zodiac.sign][0])
                $("#nZodiacDesc").fadeIn(500).html(nerthus.zodiac.descriptions[nerthus.zodiac.sign][1])
            else
                $("#nZodiacDesc").fadeIn(500).html(nerthus.zodiac.descriptions[nerthus.zodiac.sign][0])
        });
    //pole opisowe zodiaku
    $('<div id="nZodiacDesc" style="z-Index:300; width: 410px; opacity: 0.8; position: absolute; top: 60px; left: 60px; font: bold 14px Georgia; color:#F0F8FF"></div>').appendTo('#centerbox2');

    this.set_zodiac(this.calculate())
}

nerthus.zodiac.descriptions = [
    [  //0.  [Wodnik]
        "Wodnik - Wynalazczość, niezależność oraz przekraczanie granic pozwalają zasmakować umiejętności, które dotychczas były niedostępne, aż do zatracenia.",
        "Szkoła z najwyższym poziomem zostaje zablokowana. Najsłabsza szkoła uzyskuje jej poziom. Brak efektu w przypadku szkół o równym poziomie bądź braku jednej, najsilniejszej szkoły."
    ],

    [  //1.  [Ryby]
        "Ryby - Ucieczka od rzeczywistości w iluzje, które stają się sztuką, znacząco wzmacniają możliwości maga. Jednakże złożoność wyobrażeń uniemożliwia kooperację z innymi.",
        "Podstawowe iluzje nie zużywają energii. Zablokowane korzystanie z atrybutu teoria magiczna."
    ],

    [  //2.  [Baran]
        "Baran - Czerpanie mocy z czystej agresji wprawdzie wzmacnia magię ofensywną lecz destabilizuje pozostałe szkoły. Tworzenie portali staje się zbyt niebezpieczne.",
        "Podstawowe zaklęcia zniszczenia nie wymagają energii maga, jednak przemiana jest zupełnie zablokowana."
    ],

    [  //3.  [Byk]
        "Byk - Stałość, rzeczowość i skupienie ułatwiają snucie wysoce skomplikowanych czarów.",
        "Do tworzenia magazynów energii potrzebny jest dowolny poziom zaklinania. Ich siła jest zależna od posiadanego poziomu."
    ],

    [  //4.  [Bliźnięta]
        "Bliźnięta - Wszechstronna wiedza, obiektywizm i niezakłócona emocjami racjonalność, pozwalają skuteczniej przeciwstawiać się sile innych magów.",
        "Odrzucenie wzrasta o jeden poziom (arcymistrz zyskuje możliwość spętania mocy innego arcymistrza)."
    ],

    [  //5.  [Rak]
        "Rak - Instynkt i ciekawość sprzyjają zgłębianiu myśli innych oraz mechanik świata. Skupienie się na sprawach odległych naraża maga na niebezpieczeństwa.",
        "Myśli innych można czytać na poziomie mistrzowskim poznania. W zamian zablokowane jest odrzucenie."
    ],

    [  //6.  [Lew]
        "Lew - Stanowczość i autorytet pozwalają działać na wielką skalę, jednakże towarzysząca temu duma sprawia, iż przedsięwzięcia te są nieco przyziemne.",
        "Najsłabsza szkoła zostaje wzmocniona o jeden poziom, jednak możliwe jest korzystanie wyłącznie z elementów niższych. Brak efektu, jeżeli mag takowych nie posiada."
    ],

    [  //7.  [Panna]
        "Panna - Czysta wręcz troska oraz pedantyczność stanowią idealną podstawę do pomocy zagrożonym życiom.",
        "Darmowe przywrócenie 3/5 jednego organizmu żywego dziennie. W zamian zablokowane jest zniszczenie."
    ],

    [  //8.  [Waga]
        "Waga - Ułatwione jest wyważenie zaklęć z użyciem ich pierwotnej mocy, która zostaje ustabilizowana.",
        "Zaklęcia na poziomie adepta przemiany nie wymagają energii, jednak zablokowane jest użycie elementów niższych."
    ],

    [  //9. [Skorpion]
        "Skorpion - Ewokacja pozwala z łatwością sięgnąć po istoty, które dotychczas znajdowały się na granicy możliwości maga. Zgłębienie ich tajemnic ma jednak swój koszt.",
        "Przywołanie zwiększone jest o jeden poziom, ale mag może przyzwać o połowę stworzeń mniej. Zablokowane zostają elementy natury i równowagi."
    ],

    [  //10. [Strzelec]
        "Strzelec -  Entuzjazm, otwartość oraz szczerość znacząco ułatwiają współpracę z innymi.",
        "Umożliwia współpracę z magami posługującymi się innymi szkołami. Jeżeli posiadany jest już atrybut teoria magiczna, to podczas kooperacji zaklęcie maga z kosmosem wzrasta o jeden stopień."
    ],

    [  //11. [Koziorożec]
        "Koziorożec - Wytrwałe, zdyscyplinowane oraz ambitne dążenie do celu wprost prowadzą do czystego profesjonalizmu.",
        "Najlepiej rozwinięta szkoła, (inna niż w stopniu arcymistrzowskim) podniesiona zostaje o jeden poziom. W zamian reszta szkół spada o jeden poziom (lub w przypadku poziomu 1/5 zostaje zablokowana) Powyższe nie ma zastosowania, gdy nie ma jednej szkoły na poziomie wyższym niż inne. Podniesienie poziomu nie przekracza stopnia 5/5."
    ]
];

nerthus.zodiac.start = function ()
{
    if (nerthus.options['zodiac'])
        nerthus.defer(this.run.bind(this))
}

nerthus.zodiac.start()

} catch (e) {log('NerthusZodiac Error: ' + e.message, 1)}

