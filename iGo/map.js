$(document).ready(function () {
    var places = JSON.parse(localStorage.getItem("places"));
    $.ajax({
        type: 'GET',
        url: 'assets/map.json',
        success: function (data) {
            if (places == null || places.length < data.length) {
                console.log("criar de novo");
                places = [];
                places = data;
                localStorage.setItem("places", JSON.stringify(places));
            }
        }
    });
});

function showFilters() {
    $('#filter-modal').modal();
    $('.modal-backdrop').appendTo('.map-container');
    $("#filter-modal").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
    });
}
