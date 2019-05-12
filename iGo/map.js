var places;
var active_place;
var activeFilters = []

$(document).ready(function () {
    console.log("reloaded");
    $('map').imageMapResize();
    /*places = JSON.parse(localStorage.getItem("places"));*/
    $.ajax({
        type: 'GET',
        url: 'assets/map.json',
        success: function (data) {
            places = data;
            createIcons();
            /*localStorage.setItem("places", JSON.stringify(places));*/
        }
    });
});

var map_width = 895;
var map_height = 861;

function createIcons() {
    var container = $("#zoom-container");
    let areas = document.getElementsByTagName("area");
    for (var i = 0; i < places.length; i++) {
        console.log("making area");
        places[i].coords = areas[i].getAttribute("coords");
        let coord = center(transformCoords(places[i].coords));
        console.log(coord);
        container.append('<img src = "images/map/' + places[i].img + '"\
                     class = "map-icon ' + places[i].tag.split(" ")[0] +
            (places[i].isFav ? "map-icon-fav" : "") + '"\
                style = "position: absolute;\
                     top: ' + (coord[1] - 5) + 'px;\
                     left: ' + (coord[0]) + 'px;"\
                onclick = "showInfo(' + i + ')" > ');
    }

    $('area').remove();
    $('map').remove();

}

function showInfo(index) {

    $('#place-info-modal').modal({
        backdrop: false
    })
    $('#place-info-modal').modal('show');
    $("#my-backdrop").fadeIn("fast");

    // Fill modal with correct info   
    active_place = places[index];
    $('#place-title').html(active_place.name);
    $('#place-description').html(active_place.info ? "No available info" : active_place.info);
    $('#place-isFav').attr("src", active_place.isFav ? "images/filters/star.png" : "images/filters/star-empty.png");


    var previousCss = $("#place-info-modal").attr("style");

    $("#place-info-modal").css({
        position: 'absolute', // Optional if #myDiv is already absolute
        visibility: 'hidden',
        display: 'block'
    });

    $("#place-info-modal").attr("style", previousCss ? previousCss : "");

    $('#place-info-modal').modal("toggle", function () {});
    $('.modal-backdrop').appendTo('.ticket-container');
    $("#place-info-modal").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
    });

}

function favorite(place) {
    if (!active_place.isFav) {
        place.src = "images/filters/star.png"
        active_place.isFav = true;
    } else {
        place.src = "images/filters/star-empty.png";
        active_place.isFav = false;
    }

    localStorage.setItem("places", JSON.stringify(places));
}


function toggleFilter(filter) {
    var index = activeFilters.indexOf(filter);
    // Remove filter if it exists
    if (index > -1)
        activeFilters.splice(index, 1);
    // Add filter if it doesnt exist
    else
        activeFilters.push(filter);

    // ####### Apply filter #######
    let areas = document.getElementsByClassName("map-icon");
    // display all
    if (filter == "all")
        for (var i = 0; i < areas.length; i++)
            areas[i].style.display = "block";
    // apply filter 
    else
        for (var i = 0; i < areas.length; i++) {
            if (!areas[i].classList.contains(filter))
                areas[i].style.display = "none";
            else
                areas[i].style.display = "block";

        }

    // ######### Close modal window ##########
    $('#filter-modal').modal('hide');
    $('#my-backdrop').fadeOut(400);
}

function transformCoords(coords) {
    let s = coords.split(',');
    let array = [];
    if (s.length == 3)
        s.pop();

    for (let i = 0; i < s.length; i++) {
        array.push([Number(s[i]), Number(s[++i])]);
    }

    return array;
}

var center = function (arr) {
    var x = arr.map(x => x[0]);
    var y = arr.map(x => x[1]);
    var cx = (Math.min(...x) + Math.max(...x)) / 2;
    var cy = (Math.min(...y) + Math.max(...y)) / 2;
    return [cx, cy];
}

function showFilters() {
    $('#filter-modal').modal({
        backdrop: false
    })
    $('#filter-modal').modal('show');
    $("#my-backdrop").fadeIn("fast");
}