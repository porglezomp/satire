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

var scrollProgress = 0;
function updateScrollProgress(delta) {
    scrollProgress += delta;
    if (scrollProgress < 0) {
        scrollProgress = 0;
    }
}

var REGION_SIZE = 50;
var TRANSITION_SIZE = 25;
var INTERVAL_SIZE = REGION_SIZE + TRANSITION_SIZE;

function getRegion() {
    return Math.floor(scrollProgress/INTERVAL_SIZE);

}

var animating = false;
var animation = 0;
function onScroll(delta) {
    if (!animating && delta.deltaY < 0) {
        backwardState();
    } else if (!animating && delta.deltaY > 0) {
        forwardState();
    }
    return false;
}

var startTime = null;
var direction = 0;
var DURATION = 0.5;
function beginAnimatingImage(_direction) {
    animating = true;
    direction = _direction;
    window.requestAnimationFrame(animateImage);
}

function beginAnimatingSection(_direction) {
    animating = true;
    direction = _direction;
    window.requestAnimationFrame(animateSection);
}

function animateImage(time) {
    if (!startTime) startTime = time;
    var timeProgress = (time - startTime)/1000;
    if (timeProgress > DURATION) animating = false;
    var progress = timeProgress/DURATION;

    if (animating) {
        console.log(progress, direction);
        window.requestAnimationFrame(animateImage);
    } else {
        startTime = null;
    }
}

function animateSection(time) {
    if (!startTime) startTime = time;
    var timeProgress = (time - startTime)/1000;
    if (timeProgress > DURATION) animating = false;
    var progress = timeProgress/DURATION;

    if (animating) {
        console.log(progress, direction);
        window.requestAnimationFrame(animateSection);
    } else {
        startTime = null;
    }
}

var PAGES = [
    {title: "The Problem", source: 'content/01-00-the-problem.md'},
    {title: "Why Amazon?", source: 'content/01-01-why-amazon.md'},
    {title: "What We're Doing", source: 'content/02-00-what-were-doing.md'},
    {title: "Products", source: 'content/02-01-products.md'},
    {title: "The Technology", source: 'content/02-02-the-technology.md'},
    {title: "More", source: 'content/03-00-more.md'},
];

function buildPage() {
    var main = document.getElementsByTagName('main')[0];
    PAGES.forEach(function(section) {
        var sectionNode = document.createElement('section');
        main.appendChild(sectionNode);
        var articleNode = document.createElement('article');
        sectionNode.appendChild(articleNode);

        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var content = markdown.toHTML(request.responseText);
                articleNode.insertAdjacentHTML('beforeend', content);
            }
        };
        request.open("GET", section.source, true);
        request.send();
    });
}
var sectionIndex = 0;
var imageIndex = 0;

function forwardState() {
    if (imageIndex == PAGES[sectionIndex].length - 1) {
        if (sectionIndex < PAGES.length - 1) {
            sectionIndex++;
            imageIndex = 0;
            beginAnimatingSection('forward');
        }
    } else {
        imageIndex++;
        beginAnimatingImage('forward');
    }
}

function backwardState() {
    if (imageIndex == 0) {
        if (sectionIndex > 0) {
            sectionIndex--;
            imageIndex = PAGES[sectionIndex].length - 1;
            beginAnimatingSection('backward');
        }
    } else {
        imageIndex--;
        beginAnimatingImage('backward');
    }
}

ready(function() {
    buildPage();
    document.addEventListener('wheel', onScroll);
    document.getElementById('up-button').onclick=backwardState;
    document.getElementById('down-button').onclick=forwardState;
});
