function updateTime() {
    var now = new Date();
    document.getElementById("time").innerHTML = now.toLocaleTimeString().substring(0, 5);
    document.getElementById("date").innerHTML = now.toLocaleDateString();

}

var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
    console.log("Scrolling in fucntion");
}

var toggle = false;

function scrolla() {
    if (!toggle)
        $('#option-1').addClass("anim1");
    else {
        $('#option-1').addClass("anim2");
        //        $('#option-1').removeClass("anim1");
    }

    toggle = toggle ? false : true;
}

window.addEventListener('scroll', function (e) {
    console.log("listener activated");
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(function () {
            doSomething(last_known_scroll_position);
            ticking = false;
        });
    }
    ticking = true;
});

function rotateDown() {
    $('.wrapper').toggleClass('tiny');
}

setInterval(updateTime, 60000);