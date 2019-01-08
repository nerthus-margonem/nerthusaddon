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
    "Kris Aphalon"
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
    'Piekielny Jeźdźca',
    'Ponury Żniwiarz',
    'Gwardzista Piekieł',
    'Tytan'
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

//mapy do ustawienia sezon,id mapy,link do grafiki
nerthus.mapsArr =
[
    //[4,11,'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/maps/dolina_yss_zima.png']

    [1, 12, nerthus.addon.fileUrl("maps/Stare Ruiny.png")],
    [2, 12, nerthus.addon.fileUrl("maps/Stare Ruiny.png")],
    [3, 12, nerthus.addon.fileUrl("maps/Stare Ruiny.png")],
    [4, 12, nerthus.addon.fileUrl("maps/Stare Ruiny.png")],

    [1, 169, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście wschodnie.png")],
    [2, 169, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście wschodnie.png")],
    [3, 169, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście wschodnie.png")],
    [4, 169, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście wschodnie.png")],

    [1, 174, nerthus.addon.fileUrl("maps/Przeklęty Zamek - sala zgromadzeń.png")],
    [2, 174, nerthus.addon.fileUrl("maps/Przeklęty Zamek - sala zgromadzeń.png")],
    [3, 174, nerthus.addon.fileUrl("maps/Przeklęty Zamek - sala zgromadzeń.png")],
    [4, 174, nerthus.addon.fileUrl("maps/Przeklęty Zamek - sala zgromadzeń.png")],

    [1, 175, nerthus.addon.fileUrl("maps/Przeklęty Zamek p1.png")],
    [2, 175, nerthus.addon.fileUrl("maps/Przeklęty Zamek p1.png")],
    [3, 175, nerthus.addon.fileUrl("maps/Przeklęty Zamek p1.png")],
    [4, 175, nerthus.addon.fileUrl("maps/Przeklęty Zamek p1.png")],

    [1, 3741, nerthus.addon.fileUrl("maps/Przeklęty Zamek p2.png")],
    [2, 3741, nerthus.addon.fileUrl("maps/Przeklęty Zamek p2.png")],
    [3, 3741, nerthus.addon.fileUrl("maps/Przeklęty Zamek p2.png")],
    [4, 3741, nerthus.addon.fileUrl("maps/Przeklęty Zamek p2.png")],

    [1, 3742, nerthus.addon.fileUrl("maps/Przeklęty Zamek - komnata.png")],
    [2, 3742, nerthus.addon.fileUrl("maps/Przeklęty Zamek - komnata.png")],
    [3, 3742, nerthus.addon.fileUrl("maps/Przeklęty Zamek - komnata.png")],
    [4, 3742, nerthus.addon.fileUrl("maps/Przeklęty Zamek - komnata.png")],

    [1, 172, nerthus.addon.fileUrl("maps/Przeklęty Zamek - zbrojownia.png")],
    [2, 172, nerthus.addon.fileUrl("maps/Przeklęty Zamek - zbrojownia.png")],
    [3, 172, nerthus.addon.fileUrl("maps/Przeklęty Zamek - zbrojownia.png")],
    [4, 172, nerthus.addon.fileUrl("maps/Przeklęty Zamek - zbrojownia.png")],

    [1, 170, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia północne.png")],
    [2, 170, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia północne.png")],
    [3, 170, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia północne.png")],
    [4, 170, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia północne.png")],

    [1, 168, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście północne.png")],
    [2, 168, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście północne.png")],
    [3, 168, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście północne.png")],
    [4, 168, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście północne.png")],

    [1, 171, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia południowe.png")],
    [2, 171, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia południowe.png")],
    [3, 171, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia południowe.png")],
    [4, 171, nerthus.addon.fileUrl("maps/Przeklęty Zamek - podziemia południowe.png")],

    [1, 167, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście południowe.png")],
    [2, 167, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście południowe.png")],
    [3, 167, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście południowe.png")],
    [4, 167, nerthus.addon.fileUrl("maps/Przeklęty Zamek - wejście południowe.png")]
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

