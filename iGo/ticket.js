/* TICKETS */
var tickets = [];
var activeTickets = JSON.parse(localStorage.getItem("activeTickets"));
filtered_tickets = [];



/* Load tickets */
function loadTickets() {

    console.log(activeTickets);

    $(document).ready(function () {
        $.ajax({
            type: 'GET',
            url: 'assets/tickets.json',
            success: function (data) {
                tickets = data;
                if (activeTickets == null) {
                    console.log("criar do zero");
                    activeTickets = [];
                    for (let i = 0; i < 5; i++) { // Add only 2 tickets (naughty)
                        activeTickets.push(tickets[i]);
                        localStorage.setItem("activeTickets", JSON.stringify(activeTickets));
                        createTicketHtml(tickets[i], i);
                        filtered_tickets.push(activeTickets[i]);
                    }
                } else {
                    console.log("criar da local storage");
                    for (let i = 0; i < activeTickets.length; i++) {
                        createTicketHtml(activeTickets[i], i);
                        filtered_tickets.push(activeTickets[i]);
                    }
                }
            }
        });
    });

}

function createTicketHtml(ticket, id) {
    fav = ticket.isFav ? '<td><img src="images/filters/star.png" class="filter-icon small"></td>' : '';

    console.log("creating ticket");
    //let id = activeTickets.length;
    let ticketHTML = '<div id="ticket-' + id + '" class="polaroid">\
                        <img src="' + ticket.img + '" class="polaroid-image" onclick="useTicket()">\
                            <table class="ticket-table">\
                                <tr>\
                                    <td class="ticket-name">' + ticket.name + '</td>\
                                    ' + fav + '<td class = "button-ticket-information">' +
        '<img src = "images/information.png" class="ticket-information-image" \
                                    onclick = "checkInfo(' + id + ')" >  </td>   </tr></table></div>';

    $('#ticket-container-main').append(ticketHTML);
}

function reloadTickets(new_tickets) {
    new_tickets.length > 1 ? $('#ticket-container-main').html("") : $('#ticket-container-main').html("<br>");

    let i = 0;
    new_tickets.forEach(t => {
        createTicketHtml(t, i++);
    });
}

var active_filter = null;

function applyFilter(filter) {
    filtered_tickets = [];
    active_filter = filter;

    if (!filter)
        filtered_tickets = activeTickets;
    else if (filter === "fav")
        filtered_tickets = activeTickets.filter(t => t.isFav);
    else
        filtered_tickets = activeTickets.filter(t => t.tags.includes(filter));

    reloadTickets(filtered_tickets);
}

function setFilter(filter) {
    applyFilter(filter);
    $('#filter-modal').modal("toggle");
}

var isOpen = 0;

function toggleMenu() {
    if (isOpen) {
        document.getElementById("my-option-menu").style.width = "0cm";
        document.getElementById("my-add-button").style.width = "0cm";
        document.getElementById("my-filter-button").style.width = "0cm";
        isOpen = 0;
    } else {
        document.getElementById("my-option-menu").style.width = "3cm";
        setTimeout(function () {
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

function changeTicketsScreen(curScreen, targetScreen) {

    if (targetScreen === "tickets-main") {
        var id = window.setTimeout(function () {}, 0);
        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
    }

    $('#' + targetScreen).hide().fadeIn("slow", function () {
        // Animation complete.        
    });

    $('#' + curScreen).fadeOut("slow", function () {
        // Animation complete.
    });

    if (targetScreen === "tickets-scan") {
        // Insert the right icon
        setTimeout(function () {
            $("#found-ticket").fadeIn("fast"),
                function () {}
            // ADDS TICKET
            let i = activeTickets.length;
            if (i < tickets.length) {
                active_filter = null;
                createTicketHtml(tickets[i], i);
                activeTickets.push(tickets[i]);
                localStorage.setItem("activeTickets", JSON.stringify(activeTickets));
            }
        }, 1000);

        // Remove the right icon
        setTimeout(function () {
            $("#found-ticket").fadeOut("fast");
        }, 2000);

        // Change screen
        setTimeout(changeTicketsScreen, 2000, "tickets-scan", "tickets-main");

    }
}

var active_ticket = null;

function checkInfo(ticketId) {
    // Fill modal with correct info   
    active_ticket = filtered_tickets[ticketId];
    $('#ticket-title').html(active_ticket.name);
    $('#ticket-description').html(active_ticket.info);
    $('#ticket-isFav').attr("src", active_ticket.isFav ? "images/filters/star.png" : "images/filters/star-empty.png");

    $('#ticket-info-modal').modal();
    $('.modal-backdrop').appendTo('.ticket-container');
    $("#ticket-info-modal").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
    });
}

function favorite(ticket) {
    if (!active_ticket.isFav) {
        ticket.src = "images/filters/star.png"
        active_ticket.isFav = true;
    } else {
        ticket.src = "images/filters/star-empty.png";
        active_ticket.isFav = false;
    }

    applyFilter(active_filter);
    localStorage.setItem("activeTickets", JSON.stringify(activeTickets));
}

function remove() {
    let i = activeTickets.indexOf(active_ticket);
    activeTickets.splice(i, 1);
    tickets.splice(i, 1);
    tickets.push(active_ticket);
    localStorage.setItem("activeTickets", JSON.stringify(activeTickets));
    applyFilter(active_filter);
    $('#ticket-info-modal').modal("toggle");
}

function useTicket() {
    $('#qr-code-modal').modal();
    $('.modal-backdrop').appendTo('.ticket-container');
    $("#qr-code-modal").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
    });
}