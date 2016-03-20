var DURATION = 0.5;
var PAGES = [
    {
        title: "The Problem",
        source: 'content/01-00-the-problem.md',
        count: 4
    },
    {
        title: "Why Amazon?",
        source: 'content/01-01-why-amazon.md',
        count: 2
    },
    {
        title: "What We're Doing",
        source: 'content/02-00-what-were-doing.md',
        count: 4
    },
    {
        title: "Products",
        source: 'content/02-01-products.md',
        count: 4
    },
    {
        title: "The Technology",
        source: 'content/02-02-the-technology.md',
        count: 3
    },
    {
        title: "More",
        source: 'content/03-00-more.md',
        count: 5
    }
];

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

var animating = false;
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

var sectionIndex = 0;
var imageIndex = 0;
function animateImage(time) {
    if (!startTime) {
        startTime = time;
    }

    var timeProgress = (time - startTime)/1000;
    if (timeProgress > DURATION) animating = false;
    var progress = timeProgress/DURATION;

    if (animating) {
        window.requestAnimationFrame(animateImage);
    } else {
        startTime = null;
        if (direction == 'forward') {
            imageIndex++;
        } else {
            imageIndex--;
        }
    }
}

function animateSection(time) {
    var current = PAGES[sectionIndex];
    var target;
    var targetStart;
    var currentEnd;
    if (direction == 'forward') {
        target = PAGES[sectionIndex + 1];
        targetStart = 200;
        currentEnd = -200;
    } else {
        target = PAGES[sectionIndex - 1];
        targetStart = -200;
        currentEnd = 200;
    }

    if (!startTime) {
        startTime = time;
        target.element.style.display = 'block';
        current.element.style.opacity = 1;
        target.element.style.opacity = 0;
        current.element.style.top = 0;
        target.element.style.top = targetStart;
    }

    var timeProgress = (time - startTime)/1000;
    if (timeProgress > DURATION) animating = false;
    var progress = timeProgress/DURATION;

    if (animating) {
        current.element.style.opacity = 1 - progress;
        target.element.style.opacity = progress;
        window.requestAnimationFrame(animateSection);
        current.element.style.top = lerp(0, currentEnd, progress) + 'px';
        target.element.style.top = lerp(targetStart, 0, progress) + 'px';
        console.log(current.element.style.top);
    } else {
        startTime = null;
        current.element.style.opacity = 0;
        target.element.style.opacity = 1;
        current.element.style.top = currentEnd;
        target.element.style.top = 0;
        current.element.style.display = 'none';
        if (direction == 'forward') {
            sectionIndex++;
            imageIndex = 0;
        } else {
            sectionIndex--;
            imageIndex = PAGES[sectionIndex].count - 1;
        }
    }
}

function buildPage() {
    var main = document.getElementsByTagName('main')[0];
    var first = true;
    PAGES.forEach(function(section) {
        section.element = document.createElement('section');
        main.appendChild(section.element);
        var articleNode = document.createElement('article');
        section.element.appendChild(articleNode);

        if (first) {
            first = false;
        } else {
            section.element.style.opacity = 0;
            section.element.style.display = 'none';
        }

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

function forwardState() {
    if (animating) return;
    console.log('fore');
    if (imageIndex >= PAGES[sectionIndex].count - 1) {
        if (sectionIndex < PAGES.length - 1) {
            beginAnimatingSection('forward');
        }
    } else {
        beginAnimatingImage('forward');
    }
}

function backwardState() {
    if (animating) return;
    console.log('wow');
    if (imageIndex == 0) {
        if (sectionIndex > 0) {
            beginAnimatingSection('backward');
        }
    } else {
        beginAnimatingImage('backward');
    }
}

ready(function() {
    buildPage();
    document.addEventListener('wheel', onScroll);
    document.getElementById('up-button').onclick=backwardState;
    document.getElementById('down-button').onclick=forwardState;
});
