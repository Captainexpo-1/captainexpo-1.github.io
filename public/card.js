var card = document.getElementById('card');

var mouseHover = false;
var mouseCursorLocation = { x: 0, y: 0 };
var cardSize = { width: 0, height: 0 };
var SCALE_X = 4;
var SCALE_Y = 8;



card.onmouseleave = function() {
    mouseHover = false;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
};

card.onmouseenter = function() {
    mouseHover = true;
};

const rotationAmount = 0.25;

card.onmousemove = function(e) {
    if (!mouseHover) return;
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    mousePosition = { x, y };
    cardSize = {
        width: card.offsetWidth || 0,
        height: card.offsetHeight || 0,
    };

    var xRot = rotationAmount*lerp(SCALE_Y, -SCALE_Y, y / cardSize.height);
    var yRot = rotationAmount*lerp(-SCALE_X, SCALE_X, x / cardSize.width); 
    card.style.transform = `perspective(600px) rotateX(${xRot}deg) rotateY(${yRot}deg) translateZ(0px)`;
};