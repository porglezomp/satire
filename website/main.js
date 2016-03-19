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

function onScroll(delta) {
    updateScrollProgress(delta.deltaY);
    var region = Math.floor(scrollProgress/INTERVAL_SIZE);
    var intervalProgress = (scrollProgress%INTERVAL_SIZE);
    var transitionProgress = 0;
    if (intervalProgress > REGION_SIZE) {
        transitionProgress = (intervalProgress - REGION_SIZE)/TRANSITION_SIZE;
    }
    if (transitionProgress > 0) {
        var color = lerpColor(COLORS[region], COLORS[region+1], transitionProgress);
        color = toCssColor.apply(null, color);
        document.body.style.backgroundColor = color;
    }
}

document.addEventListener('wheel', onScroll);
