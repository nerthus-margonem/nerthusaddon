/**
    Name: Nerthus dla Rady
    Drugi plik z dodatku Nerthusa. Zawiera podstawowe zmienne do modyfikacji.
**/
try{

//Lista osób specjalnych - uprawnieni do używania specjalnych komend na chacie - taki bard bez etykietki
nerthus.NerthusSpec = [
    "Leira Elamshin",
    "Sihaya",
    "Lechi Chucherko",
    "Ath`Lar Draa`Ilythiiri",
    "Ihoold",
    "Aktibro",
    "Shiraya",
    "Minstrella",
    "Noys Hollyhook-Rumore",
    "Mateusz z Rocevaux",
    "Korano Ligatur",
    "Kris Aphalon",
    "Zireath"
]

//lista radnych - możliwość używania komend chatowych i ranga "radny"
nerthus.NerthusRad = ['Umbrael Regis']

//Lista narratorów - możliwość używania *nar i ranga "bard" + 'Umbrael Regis',
nerthus.NerthusNarr = [
    'Friedrich von Rommel',
    'Laliemm',
    'Kostryn',
    'Materios Dragonius',
    'Rothe',
    'Argetus',
    'Kamivis'
]

//Nazwy rang tych zamiast lvla
nerthus.lvlNames = [
    'Ciułacz',
    'Łowca Wilków',
    'Tropiciel Zulusów',
    'Poganiacz Goblinów',
    'Piętno Orków',
    'Miłośnik Harpii',
    'Rezun Olbrzymów',
    'Hycel Gnolli',
    'Koszmar Tolloków',
    'Magazynier Pełną Gębą',
    'Zguba Minotaurów',
    'Niszczyciel Szkieletów',
    'Treser Centaurów',
    'Nieustraszony Pogromca Korsarzy',
    'Tańczący z Mumiami',
    'Szabrownik Wraków',
    'Gobliński Kat',
    'Postrach Berserkerów',
    'Władca Kazamatów',
    'Młot na Czarownice',
    'Dręczyciel Praorków',
    'Zguba Czarnej Gwardii',
    'Poskramiacz Furboli',
    'Egzekutor Myświórów',
    'Wielki Inkwizytor',
    'Zaklinacz Arachnidów',
    'Kat Demonisa',
    'Oprawca Maddoków',
    'Potomek Najwyższych',
    'Władca Puszczy',
    'Konkwistador',
    'Ewokator Duchów',
    'Odkrywca Reliktów',
    'Smocza Krew',
    'Piekielny Jeźdźca',
    'Ponury Żniwiarz',
    'Gwardzista Piekieł'
]

//vips {player_id : title}
nerthus.vips = {
    16    : 'Teźa',
    50    : 'Mulher Má',
    319   : 'Niecny drow',
    6749  : 'Przezacna',
    7422  : 'Mistrz pióra',
    9565  : 'Donna Amadonna',
    6901  : 'Zło wcielone',
    2720  : 'Fochnisia',
    3077  : 'Siewca Wiatru',
    10430 : 'Wschodzące Słońce',
    10473 : 'Wędrowny Rysownik',
    2230  : 'Mhroczniś',
    513   : 'Zbieracz gumijagód',
    4146  : 'Gumitruskawka',
    10406 : 'Latorośle drowa',
    12002 : 'Głodny hobbit',
    12932 : 'Latorośle drowa',
    10372 : 'Boski Wiatr',
    10880 : 'Boski Wiatr',
    13931 : 'Wilcza Zamieć',
    9226  : 'Zadumany',
    1558  : 'Zielarka',
    15098 : 'Siostra Płomieni',
    13438 : 'Zakuty łeb',
    16089 : 'Chochlica-ponczlica',
    16372 : 'Chluba Lolth',
    10523 : 'Lux Aeterna',
    14615 : 'Iluzjonista',
    10222 : 'Władca Ciemności',
    15746 : 'Miłośniczka kocimiętki'
}

//Info jakie się wyświetla po załadowaniu gry - to czerwone, jeżeli jest '' to nie wyświetla się nic
nerthus.chatInfoStr = ''

//Wiadomość która pojawia się na środku ekranu po starcie gry
//<img src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif"><font style="font-size:200%; color:#1E90FF">Nerthus Wita</font><img  src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif">
nerthus.EnterMsg = ''

/* Mapy do ustawienia. Format:
 *  [sezon, id mapy, link do grafiki]
 *  Sezon: 0 - przez cały rok; 1 - wiosna; 2 - lato; 3 - jesień; 4 - zima
 *  Jeżeli chcemy by jakaś mapa była zmieniona w jednej porze roku,
 *  a w reszcie miała inną grafikę to należy to zrobić w tej kolejności:
 *  [4, map_id, "url_zima"],
 *  [0, map_id, "url_reszta_roku"]
 */
nerthus.mapsArr =
[
    //[4,11,'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/maps/dolina_yss_zima.png']
    [4, 9, nerthus.addon.fileUrl("maps/Werbin - zima.png")],
    [4, 257, nerthus.addon.fileUrl("maps/Mythar - zima.png")],

    //Zniszczone Opactwo
    [0, 8, nerthus.addon.fileUrl("maps/Zniszczone Opactwo.png")],
    [0, 290, nerthus.addon.fileUrl("maps/Opactwo.png")],
    [0, 291, nerthus.addon.fileUrl("maps/Opactwo p.1.png")],
    [0, 292, nerthus.addon.fileUrl("maps/Opactwo - piwnica.png")],

    //Dolina Yss
    [0, 11, nerthus.addon.fileUrl("maps/Dolina Yss.png")],

    //Stare Ruiny
    [0, 12, nerthus.addon.fileUrl("maps/Stare Ruiny.png")],
    [0, 169, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście wschodnie.png")],
    [0, 174, nerthus.addon.fileUrl("maps/Przeklęty Zamek - sala zgromadzeń.png")],
    [0, 175, nerthus.addon.fileUrl("maps/Przeklęty Zamek p.1.png")],
    [0, 3741, nerthus.addon.fileUrl("maps/Przeklęty Zamek p.2.png")],
    [0, 3742, nerthus.addon.fileUrl("maps/Przeklęty Zamek - komnata.png")],
    [0, 172, nerthus.addon.fileUrl("maps/Przeklęty Zamek - zbrojownia.png")],
    [0, 170, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia północne.png")],
    [0, 168, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście północne.png")],
    [0, 171, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia południowe.png")],
    [0, 167, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście południowe.png")],

    //Cytadela - Nithal
    [0, 866, nerthus.addon.fileUrl("maps/Cytadela p.1.png")],

    //Siedziba Leśnego Bractwa
    [0,3246, nerthus.addon.fileUrl("maps/Zapomniana kopalnia p.1.png")],
    [0,3247, nerthus.addon.fileUrl("maps/Zapomniana kopalnia p.2.png")],
    [0,3248, nerthus.addon.fileUrl("maps/Zapomniana kopalnia p.3.png")],

    [0, 37, nerthus.addon.fileUrl("maps/Brama Północy.png")]

]

//lista dodatkowych skryptów odpalanych w dodatku, tak na przyszłość - dodawać adres skryptu w apostrofach np: 'http://addons.margonem.pl/get/82.js'
nerthus.scripts =
[
    'NN_chatCmd.js',
    'NN_alko.js',
    'NN_panel.js',
    'NN_maps.js',
    'NN_night.js',
    'NN_pogoda.js',
    'NN_npc.js',
    'NN_zodiak.js'
]

nerthus.graf = {}
nerthus.graf['weather'] = nerthus.addon.fileUrl("img/weatherIcons.gif")
nerthus.graf['rain']    = nerthus.addon.fileUrl("img/weather_rain.gif")
nerthus.graf['snow']    = nerthus.addon.fileUrl("img/weather_snow.jpg")
nerthus.graf['shield']  = nerthus.addon.fileUrl("img/nerthus_icon.gif")
nerthus.graf['panelTop']= nerthus.addon.fileUrl("img/nerthusPanel.png")
nerthus.graf['dazed']   = nerthus.addon.fileUrl("img/dazed.png")
nerthus.graf['loading'] = nerthus.addon.fileUrl("img/loadingnerthus.png")
nerthus.graf['chat']    = nerthus.addon.fileUrl("img/chatPanel2.png")


nerthus.ranks = {}
nerthus.ranks.start = function()
{
    g.names.ranks[0] = "Kreator"
    g.names.ranks[1] = "Uber Miszcz Gry"
    g.names.ranks[2] = "Miszcz Gry"
    g.names.ranks[3] = "Strażnik Słowa" //"Modelator Czasu";            //"Moderator czatu";
    g.names.ranks[4] = "Tkacz Słów"     //"Modelator czasoprzestrzeni"; //"Super moderator";
    g.names.ranks[5] = "Trubadur"       //"Męczystruna";                //"Bard";
    g.names.ranks[6] = "Piewca Słowa"   //"Modelator struny";           //"Bard + MC";
    g.names.ranks[7] = "Radny"                                          //"Radny";
}

}catch(e){log('NerthusRada Error: '+e.message,1)}

