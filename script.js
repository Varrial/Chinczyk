function player(numer) {            //przełączenie na profil gracza
    document.getElementById("profil" + numer).innerHTML = `
    <button id="b${numer}" class="button" onclick="bot(${numer})"> Gracz </button> 
    <input class="poletextowe" type="text" placeholder="Nazwa gracza" id="name${numer}" />
    <button id="b${numer}" class="button" onclick="zatwierdz(${numer}, 2)">Zatwierdz</button>`;
}

function bot(numer) {               //przełączenie na bota
    document.getElementById("profil" + numer).innerHTML = `
    <button id="b${numer}" class="button" onclick="empty(${numer})">bot</button>
    <button id="b${numer}" class="button" onclick="zatwierdz(${numer}, 1)">Zatwierdz</button>`;
}

function empty(numer) {             //przełączenie na brak gracza
    document.getElementById("profil" + numer).innerHTML = `
    <button id="b${numer}" class="button" onclick="player(${numer})"> Brak </button> 
    <button id="b${numer}" class="button" onclick="zatwierdz(${numer}, 0)">Zatwierdz</button>`;
}

function zatwierdz(numer, kto) {    //numer profilu, 0-brak gracza  1-bot   2-gracz 
    document.getElementById("profil" + numer).setAttribute("kto", kto);
    document.getElementById("profil" + numer).setAttribute("bledy", 0);
    if (kto == 0) document.getElementById("profil" + numer).innerHTML = ``; 
    else {
        if (kto == 1) var name = "Bot" + (numer + 1);   //nazwa bota
        else var name = document.getElementById("name" + numer).value;  //nazwa gracza

        document.getElementById("profil" + numer).innerHTML = `<div id="nazwa${numer}">${name}</div> <div id="miejscaStartowe${numer}"></div>`;
        for (var i=0; i<4; i++)
            document.getElementById("miejscaStartowe" + numer).innerHTML += `<div id="u${numer}${i}" class="pole"></div>`;
    } 
    
    var ready = parseInt(document.getElementById("plansza").getAttribute('ready'));
    ready += 1
    document.getElementById("plansza").setAttribute("ready", ready);
    
    if(ready == 4){         //jeśli wszyscy gotowi
        for (var user=0; user<4; user++) {          //Wywołanie pionków w polach graczy
            if (parseInt(document.getElementById("profil"+user).getAttribute("kto")) > 0){
                if (user == 0) var kolor = "cz";
                else if (user == 1) var kolor = "zi";
                else if (user == 2) var kolor = "ni";
                else var kolor = "zl";

                for (var pole=0; pole<4; pole++){   
                    document.getElementById("u"+user+pole).innerHTML = `<div class="pionek" id="${kolor}${pole}" onclick="move('${kolor}${pole}')" value=0 home="u${user}${pole}"></div>`;
                }
            }
        }

        var czy = 0;        //losowy gracz zaczyna
        var ruch = Math.floor(Math.random() * 4);

        while (czy <= 3) {
            if (parseInt(document.getElementById("profil"+ruch).getAttribute("kto")) == 2){
                document.getElementById("panel"+ruch).innerHTML = `<button id="u${ruch}" class="button" onclick="rzut(${ruch}, 0)">Losuj</button>`;
                document.getElementById("panel"+ruch).innerHTML += `<div id="czas">16</div>`;
                odliczanie();
                czy = 10;
            } else if (parseInt(document.getElementById("profil"+ruch).getAttribute("kto")) == 1){
                rzut(ruch, 0);
                odliczanie();
                czy = 10;
            }
            ruch++;
            if(ruch == 4) ruch -= 4;
            czy++;
        }

        if (czy == 4) alert("Koniec gry, żaden gracz nie gra");
    }
}

function move(nr) {                 //poruszanie się po planszy
    var user = nr[0] + nr[1];
    if (user == "cz") user = 0;
    else if (user == "zi") user = 1;
    else if (user == "ni") user = 2;
    else  user = 3;

    var miejsce = parseInt(document.getElementById(nr).getAttribute('value'));
    var kostka = parseInt(document.getElementById("ko"+user).value);
    var home = document.getElementById(nr).getAttribute('home');

    if (kostka == 6 && miejsce == 0){       //wychodzenie z pola startowego
        if (user == 0) miejsce = 43;
        else if (user == 1) miejsce = 7;
        else if (user == 2) miejsce = 19;
        else  miejsce = 31;
        
        document.getElementById(home).innerHTML = "";

        if (document.getElementById("p"+miejsce).innerHTML != "") {     //jeżeli na miejscu stoi inny pionek
            var idPowrot = document.getElementById("p"+miejsce).lastChild.id;
            kolorPowrot = idPowrot[0] + idPowrot[1];
            if (kolorPowrot == "cz") kolorPowrot = 0;
            else if (kolorPowrot == "zi") kolorPowrot = 1;
            else if (kolorPowrot == "ni") kolorPowrot = 2;
            else  kolorPowrot = 3;
            
            if(user != kolorPowrot){           //jeżeli innego koloru
                var iloscPionkow = document.getElementById("p"+miejsce).childElementCount;
                for (var i=0; i < iloscPionkow; i++){
                    var homePowrot = document.getElementById("p"+miejsce).lastChild.getAttribute('home');
                    idPowrot = document.getElementById("p"+miejsce).lastChild.id;
                           
                    document.getElementById(homePowrot).innerHTML = `<div class="pionek" id="${idPowrot}" onclick="move('${idPowrot}')" value="0" home="${homePowrot}"></div>`;

                    document.getElementById("p" + miejsce).removeChild(document.getElementById("p" + miejsce).lastChild);
                }
            }
        }

        document.getElementById("p" + miejsce).innerHTML += `<div class="pionek" id="${nr}" onclick="move('${nr}')" value="${miejsce}" home="${home}"></div>`;

        nastepny(user);

    }
    else if (miejsce != 0){                //poruszanie sie po planszy
        if (user == 0) var miejsceStartowe = 43;
        else if (user == 1) var miejsceStartowe = 7;
        else if (user == 2) var miejsceStartowe = 19;
        else  var miejsceStartowe = 31;

        var miejsceNowe = miejsce + kostka;
        if (miejsceNowe > 48) miejsceNowe -= 48;

        if (miejsce >= 90 && miejsce <= 94){        //po polach zwycięzkich
            miejsce -= 90;
            if (miejsce + kostka <= 3 && document.getElementById("win" + user + (miejsce + kostka)).innerHTML == ""){       //jeżeli nie wychodzi poza zakres pól zwycięskich i nie stoi na tym polu nic
                document.getElementById("win" + user + miejsce).innerHTML = "";
                miejsce += kostka;
                document.getElementById("win" + user + miejsce).innerHTML += `<div class="pionek" id="${nr}" onclick="move('${nr}')" value="${90 + miejsce}" home="${home}"></div>`;
                wygrana(user);
                nastepny(user);
            }
        } else if(miejsceNowe >= miejsceStartowe && miejsce < miejsceStartowe) {           //jeżeli wchodzi na pola zwycięskie
            if (miejsceNowe - miejsceStartowe <= 4 && document.getElementById("win" + user + (miejsceNowe - miejsceStartowe)).innerHTML == ""){
                document.getElementById("p" + miejsce).removeChild(document.getElementById("p" + miejsce).lastChild);
                miejsce = miejsceNowe - miejsceStartowe;
                document.getElementById("win" + user + miejsce).innerHTML += `<div class="pionek" id="${nr}" onclick="move('${nr}')" value="${90 + miejsce}" home="${home}"></div>`;
                wygrana(user);
                nastepny(user);
            }   
        } else {        //tu jest prawdopodobnie błąd      
            document.getElementById("p" + miejsce).removeChild(document.getElementById("p" + miejsce).lastChild);
            miejsce = miejsceNowe;
            if (document.getElementById("p"+miejsce).innerHTML != "") {     //jeżeli na miejscu stoi inny pionek
                var idPowrot = document.getElementById("p"+miejsce).children[0].id;
                kolorPowrot = idPowrot[0] + idPowrot[1];
                if (kolorPowrot == "cz") kolorPowrot = 0;
                else if (kolorPowrot == "zi") kolorPowrot = 1;
                else if (kolorPowrot == "ni") kolorPowrot = 2;
                else  kolorPowrot = 3;
                
                if(user != kolorPowrot){           //jeżeli innego koloru
                    var iloscPionkow = document.getElementById("p"+miejsce).childElementCount;
                    for (var i=0; i < iloscPionkow; i++){
                        var homePowrot = document.getElementById("p"+miejsce).lastChild.getAttribute('home');
                        idPowrot = document.getElementById("p"+miejsce).lastChild.id;
                            
                        document.getElementById(homePowrot).innerHTML = `<div class="pionek" id="${idPowrot}" onclick="move('${idPowrot}')" value="0" home="${homePowrot}"></div>`;

                        document.getElementById("p" + miejsce).removeChild(document.getElementById("p" + miejsce).lastChild);
                    }
                }
            }
            document.getElementById("p" + miejsce).innerHTML += `<div class="pionek" id="${nr}" onclick="move('${nr}')" value="${miejsce}" home="${home}"></div>`;
            nastepny(user);
        }
    }
}

function rzut(profil, rzut) {             //rzut kostką
    if(rzut == 0) rzut = Math.floor(Math.random() * 6) + 1;
    var licznik = document.getElementById("panel" + profil).lastChild;
    document.getElementById("panel" + profil).innerHTML = `<button id="ko${profil}" class="button" value="${rzut}">${rzut}</button>`;
    document.getElementById("panel" + profil).innerHTML += `<div id="czas">30</div>`;

    //if (parseInt(document.getElementById("profil"+profil).getAttribute("kto")) == 1){   //ruchy bota
        var doPoruszenia = "";          //pionek którym bot się poruszy
        var waga = 0;     //waga ruchów bota, wykona się ruch z większą wagą

        if (profil == 0) {
            var miejsceStartowe = 43;
            var kolor = "cz";
        }
        else if (profil == 1) {
            var miejsceStartowe = 7;
            var kolor = "zi";
        } 
        else if (profil == 2) {
            var miejsceStartowe = 19;
            var kolor = "ni";
        }
        else {
            var miejsceStartowe = 31;
            var kolor = "zl";
        } 

        for(var i=0; i<4; i++){
            var miejsce = parseInt(document.getElementById(kolor+i).getAttribute("value"))  //miejsce na którym stoi pionek
            var miejsceNowe = miejsce + rzut;
            if (miejsceNowe > 48) miejsceNowe -= 48;

            if(miejsce == 0 && waga < 4 && rzut ==6){       //wychodzenie ze startu     waga 4
                doPoruszenia = kolor + i;
                waga = 4;
            }
            else if(miejsce != 0 && miejsce < 90){          //są na plaszy
                if (miejsce < miejsceStartowe && miejsceNowe >= miejsceStartowe){ //jeśli może wejść na pole zwycięzkie     waga 5
                    if(miejsceNowe - miejsceStartowe <= 3 && document.getElementById("win"+profil+(miejsceNowe - miejsceStartowe)).innerHTML == "" && waga < 5){
                        doPoruszenia = kolor + i;
                        waga = 5;
                    }
                }
                else if(document.getElementById("p" + miejsceNowe).innerHTML != ""){
                    var KolorNaNastepnym = parseInt(document.getElementById("p" + miejsceNowe).lastChild.getAttribute("home")[1]);
                    if (profil == KolorNaNastepnym){    //jesli ten sam kolor stoi na nastepnym polu    waga 2 
                        if (waga < 2){
                            doPoruszenia = kolor + i;
                            waga = 2;
                        }
                    }
                    else if (waga < 6){     //jeśli inny kolor stoi na nastepnym polu   waga 6
                        doPoruszenia = kolor + i;
                        waga = 6;
                    }
                }
                else if(document.getElementById("p" + miejsceNowe).innerHTML == ""){    //jeśli na następnym polu nic nie stoi      waga 3
                    if (waga < 3){
                        doPoruszenia = kolor + i;
                        waga = 3;
                    }
                }
            }
            else if(miejsce >=90 && miejsce <= 94){         //jeśli moze poruszyć się po zwycięzkim polu    waga 1
                miejsceNowe -= 90;
                if (miejsceNowe >= 0 && miejsceNowe <= 4 && document.getElementById("win"+profil+miejsceNowe) != "" && waga < 1){
                    doPoruszenia = kolor + i;
                    waga = 1;
                }
            }
            
        }
        
        if (parseInt(document.getElementById("profil"+profil).getAttribute("kto")) == 2){
            if (doPoruszenia == ""){
                document.getElementById("ko"+profil).setAttribute("onclick", "nastepny("+profil+")")
            }
        }
        else if (parseInt(document.getElementById("profil"+profil).getAttribute("kto")) == 1){
            document.getElementById("czas").setAttribute("class", "blank")
            if (doPoruszenia != ""){
            doPoruszenia = document.getElementById(doPoruszenia).parentElement.lastChild.id;
            setTimeout(function() { move(doPoruszenia) }, 500);
            }
            else
            setTimeout(function() { nastepny(profil) }, 500);
        }
        
        
    //} 
}

function nastepny(profil) {         //zmiana profilu który wykonuje ruch
    document.getElementById("panel" + profil).innerHTML = ``;
    
    profil++;
    if (profil > 3) profil -= 4;

    var czy = 0;
    while (czy <= 3) {
        if (parseInt(document.getElementById("profil"+profil).getAttribute("kto")) == 2){
            document.getElementById("panel" + profil).innerHTML = `<button id="u${profil}" class="button" onclick="rzut(${profil}, 0)">Losuj</button>`;
            document.getElementById("panel" + profil).innerHTML += `<div id="czas">15</div>`;
            czy = 10;
        } else if (parseInt(document.getElementById("profil"+profil).getAttribute("kto")) == 1){
            rzut(profil, 0);
            czy = 10;
        } else {
            profil += 1;
            if (profil > 3) profil -= 4;
            czy++;
        }
    }
}

function wygrana(user) {            //czy ktoś wygrał
    var punktyWygranej = 0;
    for (var i=0; i<4; i++)
        if (document.getElementById("win" + user + i).innerHTML != "")
            punktyWygranej++;
    if (punktyWygranej == 4){
        document.getElementById("miejscaStartowe"+user).innerHTML = "";

        nazwa = document.getElementById("nazwa" + user).innerHTML;

        miejsce = parseInt(document.getElementById("plansza").getAttribute("zwyciezcy"));
        miejsce ++;
        document.getElementById("plansza").setAttribute("zwyciezcy", miejsce);

        document.getElementById("profil" + user).innerHTML += `<br>${miejsce}<br>Miejsce`;
        document.getElementById("profil" + user).setAttribute("kto", 0);

        if(miejsce == 1) alert(`Wygrywa ${nazwa}!`);
    }
}

function odliczanie(){
    var czas = parseInt(document.getElementById("czas").innerHTML);
    czas -= 1;
    document.getElementById("czas").innerHTML = czas;
    if (czas >= 0) setTimeout(function() { odliczanie() },1000);
    else {
        document.getElementById("czas").innerHTML = "";
        var profil = document.getElementById("czas").parentElement.getAttribute("id")[5];
        var kostka = 0;
        if (document.getElementById("czas").parentElement.firstChild.id[0] == "k")
            var kostka = document.getElementById("czas").parentElement.firstChild.getAttribute("value");
        var bledy = parseInt(document.getElementById("profil"+profil).getAttribute("bledy"));
        bledy ++;
        document.getElementById("profil"+profil).setAttribute("bledy", bledy);
        document.getElementById("profil"+profil).setAttribute("kto", 1);
        rzut(profil, kostka);
        if(bledy < 2) document.getElementById("profil"+profil).setAttribute("kto", 2);
        else document.getElementById("nazwa"+profil).innerHTML= `Bot${parseInt(profil)+1}`;
        odliczanie();
    }
}

function start() {
    for (var i=0; i<4; i++){
        document.getElementById("pojemnik").innerHTML += `
        <div id="profil${i}" class="profil"></div>
        <div id="panel${i}" class="profil"></div>`;
        player(i);
    }
    document.getElementById("pojemnik").innerHTML += `<table id="plansza" ready="0" zwyciezcy="0"></table>`;

    {document.getElementById("plansza").innerHTML = `
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p5" class="pole"></div> </th>
        <th> <div id="p6" class="pole"></div> </th>
        <th> <div id="p7" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p4" class="pole"></div> </th>
        <th> <div id="win10" class="pole"></div> </th>
        <th> <div id="p8" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
        <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p3" class="pole"></div> </th>
        <th> <div id="win11" class="pole"></div> </th>
        <th> <div id="p9" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p2" class="pole"></div> </th>
        <th> <div id="win12" class="pole"></div> </th>
        <th> <div id="p10" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p1" class="pole"></div> </th>
        <th> <div id="win13" class="pole"></div> </th>
        <th> <div id="p11" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th> <div id="p43" class="pole"></div> </th>
        <th> <div id="p44" class="pole"></div> </th>
        <th> <div id="p45" class="pole"></div> </th>
        <th> <div id="p46" class="pole"></div> </th>
        <th> <div id="p47" class="pole"></div> </th>
        <th> <div id="p48" class="pole"></div> </th>
        <th></th>
        <th> <div id="p12" class="pole"></div> </th>
        <th> <div id="p13" class="pole"></div> </th>
        <th> <div id="p14" class="pole"></div> </th>
        <th> <div id="p15" class="pole"></div> </th>
        <th> <div id="p16" class="pole"></div> </th>
        <th> <div id="p17" class="pole"></div> </th>
    </tr>
    <tr>
        <th> <div id="p42" class="pole"></div> </th>
        <th> <div id="win00" class="pole"></div> </th>
        <th> <div id="win01" class="pole"></div> </th>
        <th> <div id="win02" class="pole"></div> </th>
        <th> <div id="win03" class="pole"></div> </th>
        <th></th>
        <th></th>
        <th></th>
        <th> <div id="win23" class="pole"></div> </th>
        <th> <div id="win22" class="pole"></div> </th>
        <th> <div id="win21" class="pole"></div> </th>
        <th> <div id="win20" class="pole"></div> </th>
        <th> <div id="p18" class="pole"></div> </th>
    </tr>
    <tr>
        <th> <div id="p41" class="pole"></div> </th>
        <th> <div id="p40" class="pole"></div> </th>
        <th> <div id="p39" class="pole"></div> </th>
        <th> <div id="p38" class="pole"></div> </th>
        <th> <div id="p37" class="pole"></div> </th>
        <th> <div id="p36" class="pole"></div> </th>
        <th></th>
        <th> <div id="p24" class="pole"></div> </th>
        <th> <div id="p23" class="pole"></div> </th>
        <th> <div id="p22" class="pole"></div> </th>
        <th> <div id="p21" class="pole"></div> </th>
        <th> <div id="p20" class="pole"></div> </th>
        <th> <div id="p19" class="pole"></div> </th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p35" class="pole"></div> </th>
        <th> <div id="win33" class="pole"></div> </th>
        <th> <div id="p25" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p34" class="pole"></div> </th>
        <th> <div id="win32" class="pole"></div> </th>
        <th> <div id="p26" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p33" class="pole"></div> </th>
        <th> <div id="win31" class="pole"></div> </th>
        <th> <div id="p27" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p32" class="pole"></div> </th>
        <th> <div id="win30" class="pole"></div> </th>
        <th> <div id="p28" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>
    <tr>
        <th></th><th></th><th></th><th></th><th></th>
        <th> <div id="p31" class="pole"></div> </th>
        <th> <div id="p30" class="pole"></div> </th>
        <th> <div id="p29" class="pole"></div> </th>
        <th></th><th></th><th></th><th></th><th></th>
    </tr>`;}
}