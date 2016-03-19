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

colors = [[255, 255, 255], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];

function onScroll(delta) {
    updateScrollProgress(delta.deltaY);
    var region = Math.floor(scrollProgress/150);
    var regionProgress = (scrollProgress % 150)/150;
    if (regionProgress > 0.66) {
        var transitionProgress = (regionProgress - 0.66) * 3;
        var color = lerpColor(colors[region], colors[region+1], transitionProgress);
        color = toCssColor.apply(null, color);
        document.body.style.backgroundColor = color;
    }
}

document.addEventListener('wheel', onScroll);
