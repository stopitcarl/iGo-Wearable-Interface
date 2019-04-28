/* TICKETS */
var tickets = [];
var activeTickets = [];
/* Load tickets */
function loadTickets() {
    console.log("lamo");
    $(document).ready(function () {
        $.ajax({
            type: 'GET',
            url: 'assets/tickets.json',
            success: function (data) {
                tickets = data;
                for (let i = 0; i < 5; i++) // Add only 2 tickets (naughty)
                    createTicket(tickets[i]);
            }
        });
    });




    var myFunction = function (i) {
        console.log(i);
    }
    let filters = document.getElementsByClassName("filter-icon");
    let i = 0;
    Array.from(filters).forEach(function (element) {
        element.addEventListener('click', myFunction, i++);
    });

}

function createTicketHtml(ticket) {
    fav = ticket.isFav ? '<td><img src="images/filters/star.png" class="filter-icon small"></td>' : '';

    console.log("creating ticket");
    let id = activeTickets.length;
    let ticketHTML = '<div id="ticket-' + id + '" class="polaroid">\
                        <img src="' + ticket.img + '" class="polaroid-image">\
                            <table class="ticket-table">\
                                <tr>\
                                    <td class="ticket-name">' + ticket.name + '</td>\
                                    ' + fav + '<td class = "button-ticket-information">' +
        '<img src = "images/information.png" class="ticket-information-image" \
                                    onclick = "checkInfo(' + id + ')" >  </td>   </tr></table></div>';

    $('#ticket-container-main').append(ticketHTML);
}

function createTicket(ticket) {
    activeTickets.push(ticket);
    localStorage.setItem("tickets", JSON.stringify(activeTickets));
    createTicketHtml(ticket);
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
        }, 1000);

        // Change screen
        setTimeout(changeTicketsScreen, 2000, "tickets-scan", "tickets-main");
        // Remove the right icon
        setTimeout(function () {
            $("#found-ticket").fadeOut("fast"),
                function () {}
        }, 2000);
    }
}

var active_ticket = null;

function checkInfo(ticketId) {
    // Fill modal with correct info    
    active_ticket = tickets[ticketId - 1];
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
    $('#ticket-container-main').html(""); // Clean ticket list
    activeTickets.forEach(ticket => {
        createTicketHtml(ticket);
    });
}