//pogoda dla nerthusa
try
{

if(typeof nerthus.weather === 'undefined')
    nerthus.weather = {id:null, change_timer:null}

nerthus.weather.set_weather = function(id)
{
    id = parseInt(id)
    if( 0 > id || id > 20)
        id = this.calculate()
    this.id = id
    this.display()
    var spot = this.spot.fromId(id)
    $('#nWeather').css('background','url('+nerthus.graf.weather+') -'+ spot.x * 55 +'px -'+ spot.y * 55 +'px')
}

nerthus.weather.set_global_weather = function()
{
    var weatherId = this.calculate()
    this.set_weather(weatherId)
    this.start_change_timer()
}

nerthus.weather.run = function()
{
    //ikonka #1E90FF
    $('<div id="nWeather" style="z-Index:300; height:55px; width: 55px; opacity: 0.8; position: absolute; top: 0px; left: 0px;"></div>').appendTo('#centerbox2')
    .mouseenter(function(){ $("#nWeatherDesc").fadeIn(500).html(this.descriptions[this.id][Math.floor(Math.random()*this.descriptions[this.id].length)])}.bind(this))
    .mouseleave(function(){$("#nWeatherDesc").fadeOut(500); });
    //pole opisowe
    $('<div id="nWeatherDesc" style="z-Index:300; width: 410px; opacity: 0.8; position: absolute; top: 5px; left: 60px; font: bold 14px Georgia; color:#F0F8FF"></div>').appendTo('#centerbox2')

    //workaround na pogode ustawianą przez bardów i zapisywanie nerthusa w pamięci
    if(typeof nerthus_weather_bard_id !== 'undefined')
        this.set_weather(nerthus_weather_bard_id)
    else
        this.set_global_weather()
}

nerthus.weather.start_change_timer = function()
{
    var hour = (Math.floor((new Date().getUTCHours())/4) + 1) * 4
    var date = new Date()
    date.setUTCHours(hour, 0, 0)
    var interval = date - new Date()
    this.change_timer = setTimeout(this.set_global_weather.bind(this),  interval)
}

nerthus.weather.spot = {}
nerthus.weather.spot.x = {SUN : 0, CLOUD : 1, MOON : 2}
nerthus.weather.spot.y = {CLEAR : 0, CLOUD : 1, HEAVY_CLOUD : 2, RAIN : 3, HEAVY_RAIN : 4, SNOW : 5, HEAVY_SNOW : 6}
nerthus.weather.spot.rain2snow = function(spot)
{
    if(spot.y == this.y.RAIN)
        spot.y = this.y.SNOW
    if(spot.y == this.y.HEAVY_RAIN)
        spot.y = this.y.HEAVY_SNOW
    return spot
}
nerthus.weather.spot.sun2moonBetweenHours = function(spot, nightBegin, nightEnd)
{
    const hour = new Date().getHours()
    if(spot.x == this.x.SUN && (hour < nightEnd || hour >= nightBegin))
        spot.x = this.x.MOON
    return spot
}
nerthus.weather.spot.toId = function(spot)
{
    return (spot.x * 7 + spot.y) % 21
}
nerthus.weather.spot.fromId = function(id)
{
    return {x : Math.floor(id / 7), y : id % 7}
}

nerthus.weather.some_blask_magic = function() //WTF is that??
{
    //zmienne do maszynki obliczającej
    const date = new Date()
    const hour = Math.floor((date.getUTCHours()) / 4) + 1
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1

    //liczenie pogody i typu, aPogVal to offset aPogType to zachmurzenie;
    var aValStr = ( ( day * hour ) * /*349.99*/ 7.85 / (hour + day )*('1.'+ month )).toString()
    var aPogVal = aValStr[aValStr.indexOf('.')+1] % this.spot.y.SNOW
    var aPogType = this.spot.x.SUN

    if(aValStr[aValStr.indexOf('.')+2] > 2)
        aPogType = this.spot.x.SUN
    else
        aPogType = this.spot.x.CLOUD

    return {x : aPogType , y : aPogVal}
}

nerthus.weather.calculate = function()
{
    var spot = this.some_blask_magic()
    const season = nerthus.season()

    if(season == nerthus.seasons.SPRING)
    {
        return this.spot.toId(this.spot.sun2moonBetweenHours(spot,22,4))
    }
    if(season == nerthus.seasons.SUMMER)
    {
        if(spot.y >= 1) //nicer weather at summer
            spot.y--
        return this.spot.toId(this.spot.sun2moonBetweenHours(spot,22,4))
    }
    if(season == nerthus.seasons.AUTUMN)
    {
        return this.spot.toId(this.spot.sun2moonBetweenHours(spot,21,4))
    }
    if(season == nerthus.seasons.WINTER)
    {
        return this.spot.toId(this.spot.rain2snow(this.spot.sun2moonBetweenHours(spot,20,4)))
    }
    return this.spot.toId(spot)
}

nerthus.weather.descriptions =
    [
        [ //1. [słońce]
        "Promienie słońca intensywnie rozświetlają horyzont. Czyste, błękitne niebo koi oczy, odrywa od szarej rzeczywistości.",
        "Słońce zawieszone na bezchmurnym niebie świeci niezwykle jasno.",
        "Po bezchmurnym niebie wędruje słońce, otulając wszystkich swoimi ciepłymi promieniami.",
        ],

        [ //2. [słońce z małą białą chmurką po lewej stronie]
        "Słońce pięknie świeci, po niebie wędrują małe obłoczki, rzucające na ziemię swe cienie. Słaby wiatr orzeźwia wędrowców.",
        "Na niebie niewielka ilość chmurek. Promienie słoneczne bez trudu przebijają się przez nie, a cienie majestatycznie przesuwają się po ziemi.",
        "Słońce, otuliwszy się pojedynczymi chmurkami, wypuszcza na świat swoje promienie, obdarzając go przyjemnym ciepłem.",
        ],

        [ //3. [słońce z białą chmurą po prawej stronie]
        "Słońce skryło się pod pierzyną białych chmur, przez którą tu i ówdzie przebijają się jasne promyki. Delikatny wiatr szeleści liśćmi.",
        "Duże, przejrzyste chmury przesuwają się leniwie po sklepieniu. Promienie słoneczne przebijają się przez obłoki. ",
        "Złociste promienie słońca przebijają się przez śnieżnobiałe chmury. Przyjemny wiatr roznosi cudowny zapach kwiatów.",
        ],

        [ //4. [słońce zasłonięte chmurą, słaby deszcz]
        "Słońce częściowo skryło się za chmurami, które swoją szarością pokryły błękit nieba. Krople deszczu ociężale spadają na ziemię.",
        "Słońce jest ledwie widoczne zza ciężkich, deszczowych chmur. Z nieba cieknie słaby deszcz.",
        "Szare, deszczowe chmury starają się zasłonić słońce. Drobne krople deszczu rozpryskują się, opadając na zielone liście drzew.",
        ],

        [ //5. [słońce zasłonięte chmurą, błyskawica i mocny deszcz]
        "Z nieba, jak szalone, spadają kolejne krople deszczu. Niebo przeszyła jasna smuga światła, której towarzyszył potężny grzmot.",
        "Ciężkie burzowe chmury spowijają niebo. Dojrzenie słońca przez gęsto padający deszcz i chmury graniczy niemal z cudem.",
        "Słońce usilnie stara się przebić przez gęste, burzowe chmury. Woda deszczowa w rynnach i beczkach się już przelewa, z oddali słychać serię grzmotów.",
        ],

        [ //6. [słońce zasłonięte chmurą, deszcz ze śniegiem]
        "Przez szare chmury dostrzec można jeszcze promyki słońca. Kolejnym kroplom deszczu towarzyszy śnieg. Wiatr wesoło kołysze gałęźmi drzew.",
        "Spore zachmurzenie, rzęsiście padający deszcz, mieszający się z płatkami śniegu. Miasto oświetlane przez promienie słońca wygląda przepięknie...",
        "Z szarych chmur zakrywających niebo wydobywa się deszcz ze śniegiem. Powietrze jest bardzo zimne, a wiatr porywisty.",
        ],

        [ //.7. [słońce zasłonięte chmurą, śnieg]
        "Mimo kilku promyków słońca, nie jest łatwo odczuć ciepło. Śnieg sypiący z nieba przykrywa doliny i miasta warstwą puchu.",
        "Zamieć śnieżna pokrywa świat białym puchem. Mimo świecącego słońca, panuje mróz, wieją bardzo silne wiatry. Dzikie szlaki i ulice miast opustoszały.",
        "Lekkie chmurki gęsto ścielą niebo. Promienie słoneczne przebijają się przez nie, oświetlając padający w dużej ilości śnieg.",
        ],

        [ //8. [biała chmura]
        "Białe chmury pokrywają niebo. Wieje spokojny wiatr porywający opadłe listki drzew. Mimo braku słońca jest dość ciepło.",
        "Błękitne niebo przyozdobiła chmara białych kłębków. Wiatr wesoło hula wśród liści i gałęzi drzew.",
        "Na niebie brak słońca. Jedynie niewielkie chmurki szybko przemierzają sklepienie.",
        ],

        [ //9. [chmura, słaby deszcz]
        "Niebo nad krainą zrobiło się szare. Z ciemnych chmur zaczął padać deszcz, a wszelaka zwierzyna schroniła się w jaskiniach, zaś ludzie ukryli się swych domostwach.",
        "Z pozornie małych chmurek wesoło spadają ku ziemi kropelki wody. Wiatr porywa do tańca zarówno liście drzew jak i włosy, kapelusze, płaszcze oraz kaptury podróżników.",
        "Lekkie zachmurzenie. Słońce chowa się już za horyzontem. Deszcz siąpi z nieba.",
        ],

        [ //10. [chmura, mocny deszcz]
        "Istne oberwanie chmury. Szary, gęsty puch staje się przyczyną ulewnego deszczu. Porywisty wiatr kołysze drzewami.",
        "Niebem zawładnęła szarość. Z większych i mniejszych chmur pędzą ku ziemi kolejne deszczowe krople.",
        "Ciężkie chmury deszczowe. Z nieba gęsto spadają duże krople wody.",
        ],

        [ //11. [chmura burzowa]
        "Rozpętała się prawdziwa burza. Z nieba seriami spadają strugi deszczu, horyzont rozświetlają błyskawice, a opadające krople zagłuszają grzmoty.",
        "Coraz większa ilość chmur przypływa ze wschodu krainy. Ociężałe krople spadają na ziemię. Niebo przeszyła błyskawica, a grzmot jej towarzyszący, rozległ się po całej okolicy.",
        "Burzowe chmury, w oddali słychać grzmoty, niebo rozświetlają błyskawice. Życie mieszkańcom utrudnia ponadto ciężki deszcz i silny wiatr.",
        ],

        [ //12. [chmura, deszcz ze śniegiem]
        "Z ciemnych chmur pada ulewny deszcz, któremu towarzyszą nieliczne płatki śniegu. Biały puch topnieje jeszcze przed opadnięciem na ziemię.",
        "Z ciemnych chmur powoli opadają ku ziemi kolejne krople deszczu i płatki śniegu. Wiatr ugina drzewa, a te jakby składają pokłony, chyląc się aż do ziemi.",
        "Wielkie, ciemne chmury zaścielają gęsto sklepienie. Z nieba leje się potężny deszcz, a gdzieniegdzie można dostrzec opadające płatki śniegu.",
        ],

        [ //13. [chmura śnieżna]
        "Powietrze staje się bardzo zimne, woda w kałużach zamarza. Obfite opady śniegu znacznie zmniejszają pole widzenia.",
        "Białe, pierzaste chmurki suną po niebie. Płatki śniegu wesoło wirują na wietrze, opadając powoli na ziemię.",
        "Lekko zachmurzone niebo. Słońce już niedługo schowa się za horyzontem. Z nieba gęsto spadają białe płatki śniegu.",
        ],

        [ //14. [chmura śnieżna z piorunem]
        "Burza śnieżna znęca się nad miejscową fauną i florą. Mróz, śnieg i pioruny zniechęcają ludzi do opuszczania swych ciepłych, bezpiecznych domów.",
        "Z ciemnych chmur wariacko suną ku ziemi płatki śniegu. Jasna błyskawica od czasu do czasu przeszywa niebo. Wiatr pędzi jak szalony, choć sam nie wie dokąd. Grzmoty słychać w najgłębszych zakątkach krainy.",
        "Ciężkie i ciemne chmury. W oddali słychać potężne grzmoty, którym towarzyszą oślepiające błyski. Brak jednak deszczu, jedynie gęsto sypiący śnieg daje się we znaki.",
        ],

        [ //15. [księżyc]
        "Nastała ciepła, bezwietrzna noc. Księżyc świeci jasno, a na czystym niebie ukazują się tysiące gwiazd.",
        "Księżyc tej nocy postanowił pokazać swe lico. Towarzyszące mu gwiazdy iskrzą wesoło na bezchmurnym niebie.",
        "Bezchmurne, gwieździste niebo. Wysoko zawieszony księżyc jasno oświetla całą krainę.",
        ],

        [ //16. [księżyc z małą, białą chmurką]
        "Księżyc co jakiś czas ukrywa się za małymi, białymi chmurami, rozświetlając je. Wieje łagodny wiatr, który nikomu nie jest w stanie przerwać snu.",
        "Księżyc nieśmiało wygląda zza chmurki. Ciemne niebo tu i ówdzie przyozdabiają jasne gwiazdy.",
        "Niewielkie zachmurzenie. Księżyc jasno świeci z góry. W tle doskonale są widoczne, przy słabym zachmurzeniu, gwiazdy.",
        ],

        [ //17. [księżyc z białą chmurą]
        "Niebo nawiedziły jasne chmury, za którymi sprytnie schował się księżyc i większość gwiazd. Wiatr cicho zawodzi w najskrytszych zakątkach krainy.",
        "Duże, jasne chmury, przez które światło księżyca przebija się bez problemu, nie pozwalają dojrzeć gwiazd.",
        "Mimo przelotnych wiatrów, noc jest pogodna. Chmury skutecznie zakrywają księżyc i wszystkie gwiazdy.",
        ],

        [ //18. [księżyc, słaby deszcz]
        "Chmury zakrywają księżyc. Mocny wiatr kołysze drzewami i rzuca liśćmi. Krople deszczu bezwładnie opadają na ziemię.",
        "Księżyc, podobnie jak gwiazdy, schował się pod pierzyną ciemnych chmur, z których spadają ku ziemi krople deszczu.",
        "Spore zachmurzenie. Księżyc prawie niewidoczny, acz jego światło przebija się przez chmury. Siąpi deszcz.",
        ],

        [ //19. [księżyc, mocny deszcz i piorun]
        "Nastała burzliwa noc. Pioruny, szum wiatru i rozbijające się o okna oraz dachy krople, mało komu pozwalają zasnąć.",
        "Ciemne chmury skryły granat nieba. Również księżyc i gwiazdy zawieruszyły się gdzieś wśród szarości. Błyskawice przyszywające niebo niosą ze sobą kolejne grzmoty i coraz większe krople deszczu.",
        "Ciężkie burzowe chmury wyglądają przerażająco. Ani śladu księżyca, pada za to gęsty deszcz.",
        ],

        [ //20. [księżyc, deszcz ze śniegiem]
        "Z pozornie małych chmurek spadają ku ziemi krople deszczu i śniegu. Księżyc wygląda zza przepływających białych chmur. Wiatr wesoło tańczy wśród gałęzi drzew.",
        "Słabe zachmurzenie. Księżyc jest doskonale widoczny, gwiazdy zaś tylko w niektórych momentach. Niewielkie opady śniegu i deszczu.",
        "Noc jest bardzo chłodna, pada ulewny deszcz ze śniegiem, tworząc wielkie kałuże.",
        ],

        [ //21. [księżyc, śnieg]
        "Zamieć śnieżna i mróz towarzyszą tej nocy. Wieje bardzo silny wiatr, a biały puch pokrywa całą krainę.",
        "Księżyc, otuliwszy się pierzynką chmur, skrył się wraz z gwiazdami. Płatki śniegu wesoło tańczą na wietrze, kolejno opadając na ziemię.",
        "Duże ilości niewielkich, jasnych chmurek. Gwiazdy na przemian pojawiają się i znikają, a z nieba gęsto sypie śnieg.",
        ],

    ];

nerthus.weather.display = function()
{
    this.effects.clear()
    if (map.mainid==0 && map.id!=3459 && map.id!=3969) //are we outside? + Mirvenis + Szkoła w Ithan
        this.effects.display(this.id)
}

nerthus.weather.effects = {}

nerthus.weather.effects.display = function(id)
{
    if(this.is_raining(id))
        this.display_rain()
    if(this.is_heavy_raining(id))
        this.display_heavy_rain()
    if(this.is_snowing(id))
        this.display_snow()
}

nerthus.weather.effects.is_raining = function(id)
{
    return [3,8,17].indexOf(id) > -1
}

nerthus.weather.effects.is_heavy_raining = function(id)
{
    return [4,5,9,10,11,18,19].indexOf(id) > -1
}

nerthus.weather.effects.is_snowing = function(id)
{
    return [5,6,11,12,13,19,20].indexOf(id) > -1
}

nerthus.weather.effects.clear = function()
{
    $(".nWeather").remove()
}

nerthus.weather.effects.display_rain = function()
{
   this.display_url(nerthus.graf.rain, 0.7)
}

nerthus.weather.effects.display_heavy_rain = function()
{
   this.display_url(nerthus.graf.rain, 1)
}

nerthus.weather.effects.display_snow = function()
{
    this.display_url(nerthus.graf.snow)
}

nerthus.weather.effects.display_url = function(url, opacity)
{
    $("<div class='nWeather'/>")
    .css({width : $('#ground').width(),
          height : $('#ground').height(),
          backgroundImage : 'url(' + url + ')',
          zIndex : map.y * 2 + 9,
          position : "absolute",
          top : "0px",
          left : "0px",
          pointerEvents: 'none',
          opacity : opacity ? opacity : 1})
    .appendTo("#ground")
}

nerthus.weather.start = function()
{
    if(nerthus.options['weather'])
        nerthus.defer(this.run.bind(this))
}

nerthus.weather.start()

}catch(e){log('NerthusWeather Error: '+e.message,1)}

