function updateTime() {
    var now = new Date();
    document.getElementById("time").innerHTML = now.toLocaleTimeString().substring(0, 5);
    document.getElementById("date").innerHTML = now.toLocaleDateString();

}

setInterval(updateDate, 60000);