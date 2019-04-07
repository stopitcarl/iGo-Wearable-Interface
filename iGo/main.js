function updateTime() {
    var now = new Date();
    document.getElementById("time").innerHTML = now.toLocaleTimeString().substring(0, 4);
    document.getElementById("date").innerHTML = now.toLocaleDateString();
}
setInterval(updateTime, 60000);

var Positions = {
    top: [-0.4, -0.4],
    center: [1.3, 1.45],
    bottom: [0.3, 5],
    out: [-1.7, 1.7],
}

// Model options in objects (because fuck me, that's why)
class Options {
    constructor(id, pos, width, isRound, urlLink) {
        this.id = id;
        this.position = pos;
        this.width = width;
        this.isRound = isRound;
        this.urlLink = urlLink;

        $("#" + id).click(function () {
            window.open(urlLink, "_self");
        });
    }

    rotate() {
        var x = 0
        var y = 0
        switch (this.position) {
            case Positions.top:
                x = Positions.center[0] - this.position[0];
                y = Positions.center[1] - this.position[1];
                this.position = Positions.center;
                $("#" + this.id).css("width", "2.8cm");
                break;
            case Positions.center:
                x = Positions.bottom[0] - this.position[0];
                y = Positions.bottom[1] - this.position[1];
                this.position = Positions.bottom;
                $("#" + this.id).css("width", "1.5cm");
                break;
            case Positions.bottom:
                x = Positions.out[0] - this.position[0];
                y = Positions.out[1] - this.position[1];
                this.position = Positions.out;
                break;
            case Positions.out:
                x = Positions.top[0] - this.position[0];
                y = Positions.top[1] - this.position[1];
                this.position = Positions.top;
                break;
            default:
                break;
        }
        console.log(this.id, "translating", x, "and", y);
        var attr = "translate(" + x + "cm," + y + "cm)";
        $("#" + this.id).css("transform", attr);
    }

}

var options = [];

function init() {
    options.push(new Options("option-1", Positions.top, 1.5, true, "translater.html"))
    options.push(new Options("option-2", Positions.center, 2.8, false, "translater.html"))
    options.push(new Options("option-3", Positions.bottom, 2.8, true, "translater.html"))
    options.push(new Options("option-4", Positions.out, 2.8, true, "translater.html"))
}

var scroll = 0;

function scrolla() {
    options.forEach(o => {
        o.rotate();
    });
}


function rotateDown() {
    $('.wrapper').toggleClass('tiny');
}

var isRecording = false;

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
        console.log("Recording");
        $('#microphone-button').addClass("Rec");
    } else {
        $('#microphone-button').removeClass("Rec");
        $('#speaking').delay(500).fadeIn("fast", function () {
            $('#speaking').delay(3000).fadeOut("fast", function () {});
        });
    }
    isRecording = isRecording ? false : true;
}

function selectLanguage() {
    $('#language-table').modal();

    //appending modal background inside the bigform-content
    $('.modal-backdrop').appendTo('.main-container');
    //removing body classes to enable click events    
    //$('body').removeClass();

    $("#language-table").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
    });
}