"use strict";
var posX = 0;
var speedX = 10;
function update(timestamp, elapsedMsec, intervalMsec) {
    var t = intervalMsec / 1000;
    posX += speedX * t;
    console.log("posX：" + posX);
}
function render(ctx) {
    console.log("render");
}
var start = 0;
var lastTime = 0;
var count = 0;
function step(timestamp) {
    if (!start)
        start = timestamp;
    if (!lastTime)
        lastTime = timestamp;
    var elapsedMsec = timestamp - start;
    var intervalMsec = timestamp - lastTime;
    lastTime = timestamp;
    update(timestamp, elapsedMsec, intervalMsec);
    render(null);
    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
