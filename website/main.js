function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function lerp(initial, final, factor) {
    return initial + (final - initial) * factor;
}

function lerpColor(initial, final, factor) {
    return [
        lerp(initial[0], final[0], factor),
        lerp(initial[1], final[1], factor),
        lerp(initial[2], final[2], factor),
    ];
}

function toCssColor(r, g, b) {
    return 'rgb(' + (r|0) + ', ' + (g|0) + ', ' + (b|0) + ')';
}

scrollProgress = 0;
function updateScrollProgress(delta) {
    scrollProgress += delta;
    if (scrollProgress < 0) {
        scrollProgress = 0;
    }
}

REGION_SIZE = 50;
TRANSITION_SIZE = 25;
INTERVAL_SIZE = REGION_SIZE + TRANSITION_SIZE;

COLORS = [[255, 255, 255], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];

function getRegion() {
    return Math.floor(scrollProgress/INTERVAL_SIZE);
}

function onScroll(delta) {
    updateScrollProgress(delta.deltaY);
    updateDisplay();
}

function updateDisplay() {
    var region = getRegion();
    var intervalProgress = (scrollProgress%INTERVAL_SIZE);
    var transitionProgress = 0;
    if (intervalProgress > REGION_SIZE) {
        transitionProgress = (intervalProgress - REGION_SIZE)/TRANSITION_SIZE;
    }
    var color = lerpColor(COLORS[region], COLORS[region+1], transitionProgress);
    color = toCssColor.apply(null, color);
    document.body.style.backgroundColor = color;
}

function gotoRegion(region) {
    if (region < 0) {
        region = 0;
    } else if (region >= COLORS.length - 1) {
        region = COLORS.length - 2;
    }
    console.log('before', scrollProgress);
    scrollProgress = INTERVAL_SIZE*(region + 1) - TRANSITION_SIZE - REGION_SIZE/2;
    console.log('after', scrollProgress);
}

function scrollDown(event) {
    gotoRegion(getRegion() + 1);
    updateDisplay();
}

function scrollUp(event) {
    gotoRegion(getRegion() - 1);
    updateDisplay();
}

document.addEventListener('wheel', onScroll);
ready(function() {
    document.getElementById('up-button').onclick=scrollUp;
    document.getElementById('down-button').onclick=scrollDown;
});
