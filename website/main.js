var IMAGE_DURATION = 0.3;
var SECTION_DURATION = 800;
var IMAGE_EXPOSED_PERCENT = 5;
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

function lerp(x0, x1, t) { return x0 + (x1 - x0) * t; }

function sanitize(text) {
    return text.replace(/^!.*\n?/gm, '');
}

var animating = false;
var startTime = null;
var direction = 0;
function beginAnimatingImage(_direction) {
    animating = true;
    direction = _direction;
    window.requestAnimationFrame(animateImage);
}

var sectionIndex = 0;
var imageIndex = 0;
function animateImage(time) {
    var index = PAGES[sectionIndex].imageElements.length - imageIndex - 1;
    if (direction == 'backward') index++;
    var startOffset = index * IMAGE_EXPOSED_PERCENT;
    var endOffset = 100;
    if (direction == 'backward') {
        var tmp = startOffset;
        startOffset = endOffset;
        endOffset = tmp;
    }
    var target = PAGES[sectionIndex].imageElements[index];

    if (!startTime) {
        startTime = time;
        target.style.left = startOffset + '%';
    }

    var timeProgress = (time - startTime)/1000;
    if (timeProgress > IMAGE_DURATION) animating = false;
    var progress = timeProgress/IMAGE_DURATION;

    if (animating) {
        window.requestAnimationFrame(animateImage);
        target.style.left = lerp(startOffset, endOffset, progress) + '%';
    } else {
        startTime = null;
        target.style.left = endOffset + '%';
        if (direction == 'forward') {
            imageIndex++;
        } else {
            imageIndex--;
        }
    }
}

function animateSection(direction) {
    if (animating) return;
    animating = true;
    var current = PAGES[sectionIndex];
    var target;
    if (direction == 'forward') {
        target = PAGES[sectionIndex + 1];
        current.element.className = 'above';
    } else {
        target = PAGES[sectionIndex - 1];
        current.element.className = 'below';
    }
    target.element.className = 'focus';

    window.setTimeout(function() {
        animating = false;
        if (direction == 'forward') {
            sectionIndex++;
            imageIndex = 0;
        } else {
            sectionIndex--;
            imageIndex = PAGES[sectionIndex].count - 1;
        }
    }, SECTION_DURATION);
}

function buildPage() {
    var sidebar = document.getElementsByTagName('sidebar')[0];
    var first = true;
    PAGES.forEach(function(section) {
        section.element = document.createElement('section');
        sidebar.appendChild(section.element);
        var articleNode = document.createElement('article');
        section.element.appendChild(articleNode);
        var imageStackContainer = document.createElement('div');
        imageStackContainer.className = 'image-stack-container';
        section.element.appendChild(imageStackContainer);

        section.imageElements = [];
        for (var i = 0; i < section.count; i++) {
            var imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            imageContainer.style.left = (IMAGE_EXPOSED_PERCENT * i) + '%';
            imageContainer.style.backgroundColor = 'rgb(' + (255-50*i) + ', 0, 0)';
            section.imageElements.push(imageContainer);
            imageStackContainer.appendChild(imageContainer);
        }

        if (first) {
            first = false;
        } else {
            section.element.className = 'below';
        }

        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var text = sanitize(request.responseText);
                var content = markdown.toHTML(text);
                articleNode.insertAdjacentHTML('beforeend', content);
            }
        };
        request.open("GET", section.source, true);
        request.send();
    });
}

function onScroll(delta) {
    if (animating) return;
    if (delta.deltaY < 0) {
        backwardState();
    } else if (delta.deltaY > 0) {
        forwardState();
    }
}

function forwardState() {
    if (animating) return;
    if (imageIndex >= PAGES[sectionIndex].count - 1) {
        if (sectionIndex < PAGES.length - 1) {
            animateSection('forward');
        }
    } else {
        beginAnimatingImage('forward');
    }
}

function backwardState() {
    if (animating) return;
    if (imageIndex == 0) {
        if (sectionIndex > 0) {
            animateSection('backward');
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
