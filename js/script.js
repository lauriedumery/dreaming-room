function play() {
    document.getElementById('home').style.display = "none"; // Pour retirer le loading une fois chargé
}

function credits() {
    document.getElementById("credits").style.display = "block";
    console.log("ok");
}

function home() {
    document.getElementById('home').style.display = "block";;
    document.getElementById("credits").style.display = "none";
}