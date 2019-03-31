function updateTime() {
    var now = new Date();
    document.getElementById("time").innerHTML = now.toLocaleTimeString().substring(0, 5);
}
function updateDate() {
    var now = new Date();
    document.getElementById("date").innerHTML = now.toLocaleDateString();
}
setInterval(updateTime, 1000);
setInterval(updateDate, 1000);