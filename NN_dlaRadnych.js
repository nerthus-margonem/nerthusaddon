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
    "Korano Ligatur"
]

//lista radnych - możliwość używania komend chatowych i ranga "radny"
nerthus.NerthusRad = ['Umbrael Regis','Rothe']

//Lista narratorów - możliwość używania *nar i ranga "bard" + 'Umbrael Regis',
nerthus.NerthusNarr = ['Friedrich von Rommel','Laliemm','Kostryn','Materios Dragonius']

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
10523 : 'Lux Aeterna'
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
    'NN_npc.js'
]

nerthus.graf = {}
nerthus.graf['weather'] = 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/weatherIcons.gif'
nerthus.graf['rain']    = 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/weather_rain.gif'
nerthus.graf['snow']    = 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/weather_snow.jpg'
nerthus.graf['shield']  = 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/nerthus_icon.gif'
nerthus.graf['panelTop']= 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/nerthusPanel.png'
nerthus.graf['dazed']   = 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/dazed.png'
nerthus.graf['loading'] = 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/loadingnerthus.png'
nerthus.graf['chat']    = 'http://cdn.rawgit.com/akrzyz/nerthusaddon/master/img/chatPanel2.png'

nerthus.ranks = {}
nerthus.ranks.start = function()
{
    g.names.ranks[0] = "Kreator"
    g.names.ranks[1] = "Uber Miszcz Gry"
    g.names.ranks[2] = "Miszcz Gry"
    g.names.ranks[3] = "Strażnik Słowa" //"Modelator Czasu"; //"Moderator czatu";
    g.names.ranks[4] = "Tkacz Słów" //"Modelator czasoprzestrzeni"; //"Super moderator";
    g.names.ranks[5] = "Trubadur" //"Męczystruna"; //"Bard";
    g.names.ranks[6] = "Piewca Słowa" //"Modelator struny"; //"Bard + MC";
    g.names.ranks[7] = "Radny" //Radny;
}
nerthus.ranks.start()

}catch(e){log('NerthusRada Error: '+e.message,1)}

