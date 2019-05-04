$(document).ready(function () {

    $("#map").draggable();

    var places = JSON.parse(localStorage.getItem("places"));
    $.ajax({
        type: 'GET',
        url: 'assets/map.json',
        success: function (data) {
            tickets = data;
            if (places == null || places.length < data.length) {
                console.log("criar de novo");
                places = [];
                places = data;
                localStorage.setItem("places", JSON.stringify(places));
            }
        }
    });
});

function zoom(zoomincrement) {
    img_ele = document.getElementById('map');
    var pre_width = img_ele.getBoundingClientRect().width,
        pre_height = img_ele.getBoundingClientRect().height;
    img_ele.style.width = (pre_width * zoomincrement) + 'px';
    img_ele.style.height = (pre_height * zoomincrement) + 'px';
    img_ele = null;
}

$(window).bind('mousewheel', function (e) {
    if (e.originalEvent.wheelDelta > 0) {
        zoom(1.1);
    } else {            
        zoom(0.9);
    }
});