/**
    Name: Nerthus dla Rady
    Drugi plik z dodatku Nerthusa. Zawiera podstawowe zmienne do modyfikacji.
**/

//Lista osób specjalnych - uprawnieni do używania specjalnych komend na chacie - taki bard bez etykietki
nerthus.NerthusSpec = [
    "Leira Elamshin",
    "Sihaya",
    "Lechi Chucherko",
    "Ath`Lar Draa`Ilythiiri",
    "Ihoold", //REMOVED
    "Aktibro",
    "Shiraya",
    "Minstrella",
    "Noys Hollyhook-Rumore",
    "Mateusz z Rocevaux",
    "Korano Ligatur",
    "Kris Aphalon",
    "Zireath",
    "Anward",
    "Ney Talleyrand"
]

//lista radnych - możliwość używania komend chatowych i ranga "radny"
nerthus.NerthusRad = [
    "Umbrael Regis",
    "Astratas"
]

//Lista narratorów - możliwość używania *nar i ranga "bard" + 'Umbrael Regis'

//PRZED KAŻDĄ KOLEJNĄ OSOBĄ MUSI ZNALEŹĆ SIĘ PRZECINEK!!!
nerthus.NerthusNarr = [
    'Karl Steinhoff',
    'Materios Dragonius',
    'Rothe',
    'Argetus',
    'Kamivis',
    'Yao Shasamo',
    'Rothen'
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
nerthus.vips =

//Info jakie się wyświetla po załadowaniu gry - to czerwone, jeżeli jest '' to nie wyświetla się nic
nerthus.chatInfoStr = ''

//Wiadomość która pojawia się na środku ekranu po starcie gry
//<img src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif"><font style="font-size:200%; color:#1E90FF">Nerthus Wita</font><img  src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif">
nerthus.EnterMsg = ''




nerthus.graf = {}
nerthus.graf['weather'] = nerthus.addon.fileUrl("img/weatherIcons.gif")
nerthus.graf['rain']    = nerthus.addon.fileUrl("img/weather/rain.gif")
nerthus.graf['snow']    = nerthus.addon.fileUrl("img/weather/snow.gif")
nerthus.graf['shield']  = nerthus.addon.fileUrl("img/nerthus_icon.gif")
nerthus.graf['panelTop']= nerthus.addon.fileUrl("img/nerthusPanel.png")
nerthus.graf['dazed']   = nerthus.addon.fileUrl("img/dazed.png")
nerthus.graf['loading'] = nerthus.addon.fileUrl("img/loadingnerthus.png")
nerthus.graf['chat']    = nerthus.addon.fileUrl("img/chatPanel2.png")
