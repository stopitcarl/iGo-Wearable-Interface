var places;
var posts;
var active_place;
var activeFilters = []
var myPosition;
var currentLocationCss = {
    "data-scale": "4",
    "data-translate-x": "-5.524780273437557",
    "data-translate-y": "-90.59162394205725",
    "style": "transition: 0.5s; transform: translate3d(-5.52478px, -90.5916px, 0px) scale3d(4, 4, 1);"
}

$(document).ready(function () {
    console.log("reloaded");
    $('map').imageMapResize();
    places = JSON.parse(localStorage.getItem("places"));
    $.ajax({
        type: 'GET',
        url: 'assets/map.json',
        success: function (data) {
            if (places == null)
                places = data;
            setTimeout(createIcons, 500);
            localStorage.setItem("places", JSON.stringify(places));
        }
    });
});
/*
$(document).ready(function() {
    $('map').imageMapResize();
});*/

$(document).ready(function () {
    /*places = JSON.parse(localStorage.getItem("places"));*/
    $.ajax({
        type: 'GET',
        url: 'assets/posts.json',
        success: function (data) {
            posts = data;
        }
    });
});

var map_width = 895;
var map_height = 861;

function createIcons() {
    var container = $("#zoom-container");
    let areas = document.getElementsByTagName("area");

    console.log(myPosition);
    for (var i = 0; i < places.length; i++) {
        places[i].coords = areas[i].getAttribute("coords");
        let coord = center(transformCoords(places[i].coords));
        places[i].activeCoords = coord;

        container.append('<img src="images/map/' + places[i].img + '"\
                     class = "map-icon ' + places[i].tag.split(" ")[0] + " " +
            (places[i].isFav ? "map-icon-fav" : "") + '"\
                style = "position: absolute;\
                     top: ' + (coord[1] - 5) + 'px;\
                     left: ' + (coord[0] - 3) + 'px;"\
                    ' + (places[i].tag != "self-location" ? 'onclick = "showInfo(' + i + ')"' : '""') +
            'id = "place-' + i + '" > ');
    }

    // Get current position
    myPosition = places[0].coords.split(",").splice(0, 2);
    myPosition[0] = parseInt(myPosition[0]);
    myPosition[1] = parseInt(myPosition[1]);

    $('area').remove();
    $('map').remove();
    console.log("setting filter to all");
    toggleFilter("all", document.getElementById("all-filter"));
}

function showInfo(index) {

    $('#place-info-modal').modal({
        backdrop: false
    })
    $('#place-info-modal').modal('show');
    $("#my-backdrop").fadeIn("fast");

    // Fill modal with correct info   
    active_place = places[index];
    $('#place-title').text(active_place.name);
    $('#place-description').html(getPosts(active_place.name));
    $('#place-isFav').attr("src", active_place.isFav ? "images/filters/star.png" : "images/filters/star-empty.png");
    if (isGPSRunning) {
        $("#set-gps-container").hide();
    } else {
        $("#set-gps-container").show();
    }


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
        $("#place-" + places.indexOf(active_place)).addClass("map-icon-fav");
    } else {
        place.src = "images/filters/star-empty.png";
        active_place.isFav = false;
        $("#place-" + places.indexOf(active_place)).removeClass("map-icon-fav");
    }

    localStorage.setItem("places", JSON.stringify(places));
}

function toggleFilter(filter, filter_elem) {
    let areas = document.getElementsByClassName("map-icon");

    // Special case for filter "all"
    if (filter == "all") {
        activeFilters = ["all"];
        let filters = document.getElementsByClassName("selected-filter");
        for (var i = filters.length - 1; i >= 0; i--)
            filters[i].classList.remove("selected-filter");
        filter_elem.classList.add('selected-filter');
        for (var i = 1; i < areas.length; i++)
            areas[i].style.display = "block";
        return;
    } else if (activeFilters == "all") {
        activeFilters = [];
        let filters = document.getElementsByClassName("selected-filter");
        filters[0].classList.remove("selected-filter");
        var index = activeFilters.indexOf(filter);
        // Remove filter if it exists
        if (index > -1) {
            activeFilters.splice(index, 1);
            filter_elem.classList.remove('selected-filter');
        }
        // Add filter if it doesnt exist
        else {
            activeFilters.push(filter);
            filter_elem.classList.add('selected-filter');
        }
    } else {
        var index = activeFilters.indexOf(filter);
        // Remove filter if it exists
        if (index > -1) {
            activeFilters.splice(index, 1);
            filter_elem.classList.remove('selected-filter');
            if (activeFilters.length == 0) {
                toggleFilter("all", document.getElementById("all-filter"));
                return;
            }
        }
        // Add filter if it doesnt exist
        else {
            activeFilters.push(filter);
            filter_elem.classList.add('selected-filter');
        }
    }



    // ####### Apply filter #######    
    for (var i = 1; i < areas.length; i++)
        areas[i].style.display = "none";
    for (var j = 0; j < activeFilters.length; j++)
        // apply filter         
        for (var i = 1; i < areas.length; i++) {
            if (areas[i].classList.contains(activeFilters[j]))
                areas[i].style.display = "block";

        }

    // ######### Close modal window ##########
    // $('#filter-modal').modal('hide');
    // $('#my-backdrop').fadeOut(400);
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

function drawLine(mine, coords) {
    let canvas = document.getElementById("gps-canvas");
    let ctx = canvas.getContext("2d");
    // Encontrar as coordenadas corretas da minha posição
    ctx.beginPath();
    //console.log(myPosition, coords);
    //console.log($("#place-0").position());
    //ctx.moveTo(myPosition[0], myPosition[1]);
    ctx.moveTo(mine[1], mine[0]);
    ctx.strokeStyle = "red";

    ctx.lineTo(coords[0], coords[1]);
    ctx.stroke();
}

function getPosts(placeName) {

    for (let i = 0; i < places.length; i++)
        if (places[i].name === placeName)
            if (places[i].tag === 'transporte')
                return '<a href="tickets.html"><img src="images/toTicket.png" class="goToTicket"></a><p style="text-align: center;">Clique na imagem para selecionar um bilhete<p>';




    let res = "";
    for (let i = 0; i < posts.length; i++)
        if (posts[i]["place"] == placeName)
            res += '<img src="images/profile.png" class="post-author">\
            <b class="post-author-name">' + posts[i]["author"] + '</b><br><span class="post-text">' +
            posts[i]["text"] + '</span> <hr style="margin:0.1cm auto; width:90%">';

    return res ? res : "Não há informação disponível";
}

function getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}

function connect(div1, div2, color, thickness) { // draw a line connecting elements

    var off1 = getOffset(div1);
    var off2 = getOffset(div2);
    // bottom right
    var x1 = off1.left + off1.width;
    var y1 = off1.top + off1.height;
    // top right
    var x2 = off2.left + off2.width;
    var y2 = off2.top;
    // distance
    var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
    // make hr
    var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    //
    // alert(htmlLine);
    //document.body.innerHTML += htmlLine;
    $("#zoom-container").append(htmlLine);
}

function showTransportation() {
    $('#transportation-modal').modal({
        backdrop: false
    })
    $('#transportation-modal').modal('show');
    $("#my-backdrop").fadeIn("fast");
}

function changeTransport(t) {
    console.log("changing transportation")
    let trans = "";
    if (t === 'walk') {
        $("#transport-image").attr("src", "images/filters/walking.png");
        trans = " a";
    }
    if (t === 'bus') {
        $("#transport-image").attr("src", "images/filters/bus.png");
        trans = " de";
    }
    if (t === 'bicycle') {
        $("#transport-image").attr("src", "images/filters/bicycle.png");
        trans = " de";
    }
    if (t === 'car') {
        $("#transport-image").attr("src", "images/filters/car.png");
        trans = " de";
    }

    $("#gps-time").text(Math.floor(2 + Math.random() * 45) + " minutos" + trans);
    $("#gps-kcal").text(Math.floor(2 + Math.random() * 45) + " Kcal");
    $("#gps-dist").text(Math.floor(2 + Math.random() * 878) + " metros");

    $('#transportation-modal').modal('hide');
    $('#my-backdrop').fadeOut(400);
}

var isGPSRunning = false;

function showGPS() {
    $("#gps-nav").show();
    $('#place-info-modal').modal('hide');
    $('#my-backdrop').fadeOut(400);
    isGPSRunning = true;
}

var isGPSToggled = false;

function toggleGPS() {
    if (!isGPSToggled) {
        $("#gps-nav").removeClass("gps-down");
        $("#gps-nav").addClass("gps-center");
        $("#gps-arrow").attr("src", "images/arrowdown.png");
        isGPSToggled = true;
    } else {
        $("#gps-nav").removeClass("gps-center");
        $("#gps-nav").addClass("gps-down");
        $("#gps-arrow").attr("src", "images/arrowup.png");
        isGPSToggled = false;
    }
}



function tryRemove() {
    $("#try-remove").fadeOut("fast", function () {
        $("#confirmation-container").fadeIn("fast");
    });

}

function cancelRemove() {
    $("#confirmation-container").fadeOut("fast", function () {
        $("#try-remove").fadeIn("fast");
    });
}

function remove() {
    toggleGPS();
    $("#gps-nav").hide("fast");
    cancelRemove();
    isGPSRunning = false;
}

function centerMap() {
    let container = $("#zoom-container");
    for (var key in currentLocationCss)
        container.attr(key, currentLocationCss[key]);
}