var canvas = document.getElementById('main');
var turtle = document.getElementById('turtle');
var tctx = turtle.getContext('2d');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "#000";
var x = canvas.height/2;
var y = canvas.width/2;
var angle = -90;
var pen_down = true;

function move(distance) {
    turtle.width=turtle.width;
    if (pen_down) {
        ctx.moveTo(x, y);
        x = x + distance * Math.cos(Math.PI * angle / 180.0);
        y = y + distance * Math.sin(Math.PI * angle / 180.0);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

var fd = move;
var bk = function(d) { move(-d); }; 
var pu = function() { pen_down = false; };
var pd = function() { penu_down = true; };
var rt = function(r) { angle = angle + r; move(0); };
var lt = function(r) { angle = angle - r; move(0); };

var run = function (el) {
    eval(parse_start(document.getElementById(el).value, 0).val);
};
