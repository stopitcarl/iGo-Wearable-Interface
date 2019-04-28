var options = [];
var Positions = [
    "option-top",
    "option-center",
    "option-bottom",
    "option-out"
]
var isRecording = false;
var type = 0;
var rotating = false;

function prettyDate2(time) {
    var date = new Date(parseInt(time));
    return date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateTime() {
    var now = new Date();
    var timeStr = now.toLocaleTimeString('pt-PT');

    document.getElementById("time").innerHTML = timeStr.substring(0, 5);
    document.getElementById("date").innerHTML = now.toLocaleDateString('pt-PT');
}


setInterval(updateTime, 60000);



// Model options in objects (because fuck me, that's why)
class Options {
    constructor(id, pos, description, urlLink, img) {
        this.id = id;
        this.position = pos;
        this.urlLink = urlLink;
        this.description = description;
        this.img = img;
    }

    setListeners() {
        var option = this;
        $("#" + this.id).click(function () {
            if (option.position === 0) {
                rotateScreen("up");
                return;
            } else if (option.position === 2) {
                rotateScreen("down");
                return;
            }

            if (!option.urlLink) {
                $(this).addClass('shake').on("animationend", function () {
                    $(this).removeClass('shake');
                });
            } else {
                localStorage.setItem("activeOptions",JSON.stringify(options));
                $(this).addClass('grow'); // TODO: setTimeout to open window
                window.open(option.urlLink, "_self");
            }
        });
    }

    rotate(dir) {
        var pos = this.position;
        var next_pos = 0;

        if (dir == "up")
            next_pos = (pos + 1) % 4;
        else if (dir == "down")
            next_pos = pos != 0 ? pos - 1 : 3;

        $("#" + this.id).removeClass(Positions[pos]);
        $("#" + this.id).addClass(Positions[next_pos]);

        this.position = next_pos;
        var desc = this.description;
        if (this.position == 1) {
            $('#description-content').fadeOut(100, function () {
                $('#description-content').html(desc);
                $('#description-content').fadeIn("fast");
            });

        }
    }

}

function rotateScreen(dir) {
    if (rotating)
        return;
    rotating = true;
    options.forEach(o => {
        o.rotate(dir);
    });
    setTimeout(() => rotating = false, 600);
}



function init() {
    options_cache = JSON.parse(localStorage.getItem("activeOptions"));
    if (!options_cache) {  
        options=[];      
        options.push(new Options("option-1", 0, "Bilhetes", "tickets.html", "images/ticketIcon.png"));
        options.push(new Options("option-2", 1, "Tradutor", "translater.html", "images/icon-translation.svg"));
        options.push(new Options("option-3", 2, "Mapa", null, "images/mapsicon.png"));
        options.push(new Options("option-4", 3, "Definições", null, "images/settings.png"));
    } else {        
        options_cache.forEach(o => {
            options.push(new Options(o.id, o.position, o.description, o.urlLink, o.img));    
        });
    }

    options.forEach(o => {                
        $('#rotating-screen').append('<img src="'+ o.img + '"id="'+ o.id + '" class="option ' +
         Positions[o.position] + '"/>');
        o.setListeners();
    });

    $(window).bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta > 0) {
            rotateScreen("up");
        } else {
            rotateScreen("down");
        }
    });

}

function changeTranslateScreen(curScreen, targetScreen) {

    if (isRecording)
        toggleRecording();

    $('#' + targetScreen).hide().fadeIn("slow", function () {
        // Animation complete.
        //console.log("got in");
    });
    $('#' + curScreen).fadeOut("slow", function () {
        // Animation complete.

        //console.log("got out");
    });
}

function addText(text) {
    var words = text.split(" ");
    var curText = "";
    var time = 400;

    words.forEach(word => {
        setTimeout(function () {
            curText += word;
            $("#translated-text").text(curText);
            curText += " ";
        }, time);
        let rand = Math.random() * 600;
        time += rand > 100 ? rand : 300;
    });



}

function getText(lang) {

    let language = "";

    if (lang == 1)
        language = document.getElementById("language1").innerHTML;
    else
        language = document.getElementById("language2").innerHTML;

    switch (language) {
        case "Português":
            return "Eu gostaria de um copo de água";
        case "English":
            return "I would like a glass of water";
        case "Čeština":
            return "Chtěl bych sklenici vody";
        case "Deutsche":
            return "Ich hätte gerne ein Glas Wasser";
        case "Français":
            return "Je voudrais un verre d'eau";
        case "Svenska":
            return "Jag skulle vilja ha ett glas vatten";
        case "Swahili":
            return "Ningependa glasi ya maji";
        case "普通话":
            return "我想要一杯水";
    }

}

function toggleRecording() {
    if (!isRecording) {
        $('#microphone-button').addClass("Rec");
        addText(getText(1));

    } else {
        $('#microphone-button').removeClass("Rec");
        addText(getText(2));
        $('#speaking').delay(500).fadeIn("fast", function () {
            $('#speaking').delay(3000).fadeOut("fast", function () { });
        });
    }
    isRecording = isRecording ? false : true;
}



function selectLanguage(t) {
    $('#language-table').modal();
    $('.modal-backdrop').appendTo('.main-container');
    $("#language-table").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () { });
    });
    type = t;
}

function swapImage(number) {
    if (number == 0) {
        setTimeout(() => {
            document.getElementById("my-camera-simulation").src = "images/warning-english.png";
        }, 3000);
    } else {
        setTimeout(() => {
            var id = window.setTimeout(function () { }, 0);
            while (id--) {
                window.clearTimeout(id); // will do nothing if no timeout with id is present
            }
            document.getElementById("my-camera-simulation").src = "images/warning-chinese.png";
        }, 1000);
    }
}

function prepareWindow() {

    var language1 = getCookie("lang1");
    var language2 = getCookie("lang2");

    if (language1 != "") {
        type = 1;
        updateLanguage2(language1);
    }
    if (language2 != "") {
        type = 2;
        updateLanguage2(language2);
    }
}

function updateLanguage2(language) {
    let language1 = document.getElementById("language1").innerHTML;
    let language2 = document.getElementById("language2").innerHTML;
    if (type == 1) {
        if (language2 === language) {
            document.getElementById("language2").innerHTML = language1;
            setCookie("lang2", language1, null);
        }
        setCookie("lang1", language, null);
        document.getElementById("language1").innerHTML = language;
    } else {
        if (language1 === language) {
            document.getElementById("language1").innerHTML = language2;
            setCookie("lang1", language2, null);
        }
        setCookie("lang2", language, null);
        document.getElementById("language2").innerHTML = language;
    }

    language1 = document.getElementById("language1").innerHTML;
    language2 = document.getElementById("language2").innerHTML;
    document.getElementById("languages").innerHTML = language1 + "<br><hr>" + language2;
}

function updateLanguage(language) {
    updateLanguage2(language);
    $('#language-table').modal("toggle");
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}