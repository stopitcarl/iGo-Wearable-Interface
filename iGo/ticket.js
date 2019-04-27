/* TICKETS */
var tickets = [];
var activeTickets = [];
/* Load tickets */
function loadTickets() {
    console.log("lamo");
    $(document).ready(function () {
        console.log("creating tickets");
        $.ajax({
            type: 'GET',
            url: 'assets/tickets.json',
            success: function (data) {
                console.log("creating tickets");
                tickets = data;

                for (let i = 0; i < 5; i++) // Add only 2 tickets (naughty)
                    createTicketHtml(tickets[i]);
            }
        });
    });
}

function createTicketHtml(ticket) {
    activeTickets.push(ticket);

    console.log("creating tickets");
    let id = activeTickets.length;
    let ticketHTML = '<div id="ticket-' + id + '" class="polaroid">\
                        <img src="' + ticket.img + '" class="polaroid-image">\
                            <table class="ticket-table">\
                                <tr>\
                                    <td class="ticket-name">' + ticket.name + '</td>\
                                    <td class="button-ticket-information">\
                                        <img src="images/information.png" class="ticket-information-image" onclick="checkInfo(' + id + ')">\
                                    </td>\
                                </tr>\
                            </table>\
                    </div>';
    $('#ticket-container-main').append(ticketHTML);
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
        console.log("got in");
    });
    $('#' + curScreen).fadeOut("slow", function () {
        // Animation complete.

        console.log("got out");
    });
    if (targetScreen === "tickets-scan") {
        setTimeout(changeTicketsScreen, 2000, "tickets-scan", "tickets-main");
    }
}

function checkInfo(ticketId) {
    // Fill modal with correct info    
    ticket = tickets[ticketId - 1];
    $('#ticket-title').html(ticket.name);
    $('#ticket-description').html(ticket.info);

    $('#ticket-info-modal').modal();
    $('.modal-backdrop').appendTo('.ticket-container');
    $("#ticket-info-modal").on("hidden.bs.modal", function () {
        $(".fade").fadeOut("fast", function () {});
    });
}

function favorite(ticket) {

    if (ticket.src.indexOf("images/star-empty.png") != -1) {
        ticket.src = "images/filters/star.png"
    } else {
        ticket.src = "images/star-empty.png";
    }

}