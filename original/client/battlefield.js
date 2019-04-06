
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var units = 31;
var unitSize = 20; // px
var size = units * unitSize;

var timePeriod = 1000;

var vikingImg = new Image();
vikingImg.src = 'viking.png';

var grassImg = new Image();
grassImg.src = 'grass.png';

canvas.width = size;
canvas.height = size;
document.body.appendChild(canvas);

function getVikings() {

    return fetch('http://52.58.199.76:8080/api/vikings');

}

function renderVikings(vikings) {

    for (var i = 0; i <= units; i++) {
        for (var j = 0; j <= units; j++) {
            ctx.drawImage(grassImg, i * unitSize, j * unitSize, unitSize, unitSize);
        }
    }

    vikings.forEach(function(viking) {

        var x = viking.position.x;
        var y = viking.position.y;

        var fontSize = 15;
        ctx.font = fontSize + "px Arial";
        
        ctx.fillText(viking.name, x * unitSize - 20, y * unitSize - 5);
        ctx.fillText(viking.level, x * unitSize + 3, y * unitSize + fontSize + 18);

        ctx.drawImage(vikingImg, x * unitSize, y * unitSize, unitSize, unitSize);

    });

}

function displayTheBest(vikings) {

    var bestViking = vikings.reduce(function(candidate, current) {

        return candidate.level > current.level ? candidate : current;

    });

    var div = document.getElementById('best-viking');
    div.innerHTML = '';
    var text = document.createTextNode("Best Viking: " + bestViking.name);
    div.appendChild(text);

    var div = document.getElementById('best-level');
    div.innerHTML = '';
    var text = document.createTextNode("With level: " + bestViking.level);
    div.appendChild(text);
}

function main() {

    getVikings()
    .then(function(response) {

        return response.json().then(function(json) {
            var vikings = json.vikings;
            renderVikings(vikings);
            displayTheBest(vikings);
        });
    
    });

}

main();
window.setInterval(main, timePeriod);