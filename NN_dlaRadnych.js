/**
	Name: Nerthus dla Rady
	Drugi plik z dodatku Nerthusa. Zawiera podstawowe zmienne do modyfikacji. 
**/
try{

//wersja dodatku
nerthus.version='5.8';

//data i godzina zmian - jeśli były jakieś ważne zmiany na forum to tu ustawia się ich czas - odpowiada za skakanie tarczy
nerthus.dataZmian = '2.11.2010'; //dd.mm.rrrr
nerthus.godzinaZmian= '8:45';	 //hh:mm

//Lista osób specjalnych - uprawnieni do używania specjalnych komend na chacie - taki bard bez etykietki
nerthus.NerthusSpec = ["Leira Elamshin","Sihaya","Lechi Chucherko","Ath`Lar Draa`Ilythiiri","Ihoold","Aktibro","Shiraya","Minstrella","Noys Hollyhook-Rumore"];

//lista radnych - możliwość używania komend chatowych i ranga "radny"
nerthus.NerthusRad = ["Rothe","Materios Dragonius","Sanjuro Sadatake"]
 
//Lista narratorów - możliwość używania *nar i ranga "bard"
nerthus.NerthusNarr = ["Aevenien","Sihaya","Llorando","Vanielle","Snorri",'Materios Dragonius','Demetris','Rothe','Learodus','Saithan','Korano Ligatur','Navu Vruzael'];
 
//Nazwy rang tych zamiast lvla
nerthus.lvlNames = ['Ciułacz','Łowca Wilków','Tropiciel Zulusów','Poganiacz Goblinów','Piętno Orków','Miłośnik Harpii','Rezun Olbrzymów','Hycel Gnolli','Koszmar Tolloków','Magazynier Pełną Gębą','Zguba Minotaurów','Niszczyciel Szkieletów','Treser Centaurów','Nieustraszony Pogromca Korsarzy','Tańczący z Mumiami','Szabrownik Wraków','Gobliński Kat','Postrach Berserkerów','Władca Kazamatów','Młot na Czarownice','Dręczyciel Praorków','Zguba Czarnej Gwardii','Poskramiacz Furboli','Egzekutor Myświórów','Wielki Inkwizytor','Zaklinacz Arachnidów','Kat Demonisa','Oprawca Maddoków','Potomek Najwyższych','Piekielny Jeźdźca', 'Ponury Żniwiarz','Gwardzista Piekieł','Tytan'];
 
//Lista vipów - ci z innymi opisami zamiast lvlów lista to ich id!
nerthus.vipList = [16,50,319,6749,7422,9565,6901,2720,3077,10430,10473,2230,513,4146,10406,12002,12932,10372,10880,1558];
 
//Lista specialnych opisów dla wipów
nerthus.vipNames = ['Teźa','Mulher Má','Niecny drow','Przezacna','Mistrz pióra','Donna Amadonna','Zło wcielone','Fochnisia','Siewca Wiatru','Wschodzące Słońce','Wędrowny Rysownik','Mhroczniś','Zbieracz gumijagód','Gumitruskawka','Latorośle drowa','Głodny hobbit','Latorośle drowa','Boski Wiatr','Boski Wiatr','Zielarka'];
 
//Info jakie się wyświetla po załadowaniu gry - to czerwone, jeżeli jest '' to nie wyświetla się nic
nerthus.chatInfoStr ='';
 
//Czerwone info w panelu - ustawiać tu tekst nowości na forum
nerthus.panelMessage='Witaj na Nerthusie, zapraszamy na <a href="http://www.margonem.pl/?task=forum&show=topics&id=33" target="_blank">forum</a>';
 
//Reszta tekstu w panelu, ta pod czerwonym info - powinny tu być linki do forum itp
nerthus.panelStr='<b>Ważne tematy i informacje:</b>\
<br><a href="http://www.margonem.pl/?task=forum&show=posts&id=424036" target="_blank">Zbiór zasad</a>\
<br><a href="http://www.margonem.pl/?task=forum&show=posts&id=456867" target="_blank">Informacje dla nowych graczy</a>\
<br><a href="http://www.margonem.pl/?task=forum&show=posts&id=205200#bottom" target="_blank">Pytania i Odpowiedzi</a>\
<br><a href="http://www.margonem.pl/?task=forum&show=posts&id=422927#bottom" target="_blank">Pogawędki</a>\
<br><a href="http://www.margonem.pl/?task=forum&show=posts&id=280825#bottom" target="_blank">Biuletyn </a>\
<br><a href="http://www.margonem.pl/?task=forum&show=posts&id=424674#bottom" target="_blank">Zgłoszenia forumowe</a>\
'
 
//mapy do ustawienia sezon,id mapy,link do grafiki,czy jest z serwera margonem,0-nie 1-tak
nerthus.mapsArr=[
  					[1,1,'/obrazki/miasta/ithan-new-2.png',1],
  					[2,1,'/obrazki/miasta/ithan-new-2.png',1],
  					[3,1,'/obrazki/miasta/ithan-new-2.png',1],
  					[4,1,'http://cloud.directupload.net/plugins/imageviewer/site/direct.php?s=4tk&/zima.png',0],
  					[4,8,'http://cloud.directupload.net/plugins/imageviewer/site/direct.php?s=4x6&/Opactwo_Zimowe.png',0],
  					[4,11,'http://cloud.directupload.net/plugins/imageviewer/site/direct.php?s=7wb&/Yss_zimowe_%E2%80%94_kopia.png',0]
				]; 

//lista dodatkowych skryptów odpalanych w dodatku, tak na przyszłość - dodawać adres skryptu w apostrofach np: 'http://addons.margonem.pl/get/82.js'
nerthus.additionaScripts=[
  						  'NN_Config_hax.js',
                          'NN_Wiosna.js',
                          'NN_chatCmd.js',
                          'NN_alko.js',
                          'NN_NightLights.js'
                         ];				
 
//lista grafik nie ruszać!
nerthus.grafPath=[];
 
//Wiadomość która pojawia się na środku ekranu po starcie gry
//<img src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif"><font style="font-size:200%; color:#1E90FF">Nerthus Wita</font><img  src="http://game3.margonem.pl/obrazki/npc/mas/ner_her_1.gif">
nerthus.EnterMsg = '';
 
//ustawienia opcji - nie ruszać!
nerthus.Settings='111111';
 
//czas ostatniej wizyty - nie ruszać!
nerthus.LastVisitTime='';
 
//alternatywna Playlista
nerthus.altPlaylistSrc = '';

g.names.ranks[3] = "Strażnik Słowa"; //"Modelator Czasu"; //"Moderator czatu";
g.names.ranks[4] = "Tkacz Słów"; //"Modelator czasoprzestrzeni"; //"Super moderator"; 
g.names.ranks[5] = "Trubadur"; //"Męczystruna"; //"Bard";
g.names.ranks[6] = "Piewca Słowa"; //"Modelator struny"; //"Bard + MC";
g.names.ranks[7] = "Radny"; //Radny;

}catch(e){log('NerthusRada Error: '+e.message,1);}

