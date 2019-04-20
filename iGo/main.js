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
    constructor(id, pos, description, urlLink) {
        this.id = id;
        this.position = pos;
        this.urlLink = urlLink;
        this.description = description;
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
                $(this).addClass('grow');
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
    options.push(new Options("option-1", 0, "Bilhetes", "tickets.html"));
    options.push(new Options("option-2", 1, "Tradutor", "translater.html"));
    options.push(new Options("option-3", 2, "Mapa", null));
    options.push(new Options("option-4", 3, "Definições", null));

    options.forEach(o => {
        o.setListeners();;
    });

    $(window).bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta > 0) {
            rotateScreen("down");
        } else {
            rotateScreen("up");
        }
    });

}

function changeTranslateScreen(curScreen, targetScreen) {

    if (isRecording)
        toggleRecording();

    $('#' + targetScreen).hide().fadeIn("slow", function () {
        // Animation complete.
        console.log("got in");
    });
    $('#' + curScreen).fadeOut("slow", function () {
        // Animation complete.

        console.log("got out");
    });
}


function toggleRecording() {
    if (!isRecording) {
        $('#microphone-button').addClass("Rec");
    } else {
        $('#microphone-button').removeClass("Rec");
        $('#speaking').delay(500).fadeIn("fast", function () {
            $('#speaking').delay(3000).fadeOut("fast", function () {});
        });
    }
    isRecording = isRecording ? false : true;
}



function selectLanguage(t) {
    $('#language-table').modal();
    $('.modal-backdrop').appendTo('.main-container');
    $("#language-table").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
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
            var id = window.setTimeout(function () {}, 0);
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
    document.getElementById("languages").innerHTML = language1 + " - " + language2;
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

function getCookie2(cname) {
    let str = decodeURIComponent(document.cookie).match(cname + "=.*;")[0];
    return str.substring(0, str.length - 2);
}

/* TICKETS */

isOpen = 0;

function toggleMenu() {
    if (isOpen) {
        document.getElementById("my-option-menu").style.width = "0cm";
        document.getElementById("my-add-button").style.width = "0cm";
        document.getElementById("my-filter-button").style.width = "0cm";
        isOpen = 0;
    }
    else {
        document.getElementById("my-option-menu").style.width = "3cm";
        setTimeout(function(){
            document.getElementById("my-add-button").style.width = "0.9cm";
            document.getElementById("my-filter-button").style.width = "0.9cm";
        }, 100);
        isOpen = 1;
    }
}

function selectFilter() {
    $('#filter-modal').modal();
    $('.modal-backdrop').appendTo('.ticket-container');
    $("#filter-modal").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
    });
}
