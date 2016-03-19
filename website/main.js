scrollProgress = 0;
function updateScrollProgress(delta) {
    scrollProgress += delta;
    if (scrollProgress < 0) {
        scrollProgress = 0;
    }
}

function onScroll(delta) {
    updateScrollProgress(delta.deltaY);
    var color = '#FFF';
    if (scrollProgress > 120) {
        var color = (scrollProgress - 120) / 100;
        color = (255 - Math.min(color, 1)*255)|0;
        color = 'rgb(' + color + ', ' + color + ', ' + color + ')';
    }
    document.body.style.backgroundColor = color;
    console.log(color);
}

document.addEventListener('wheel', onScroll);
