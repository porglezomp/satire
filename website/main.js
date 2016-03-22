var SECTION_DURATION = 800;
var IMAGE_DURATION = 600;
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
        count: 3
    },
    {
        title: "What We're Doing",

        source: 'content/02-00-what-were-doing.md',
        count: 4
    },
    {
        title: "Products",
        source: 'content/02-01-products.md',
        count: 3
    },
    {
        title: "The Technology",
        source: 'content/02-02-the-technology.md',
        count: 4
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

function getLinkElementByHref(href) {
    var links = document.getElementsByTagName('a');
    for (var i = 0, l = links.length; i < l; i++) {
        var link = links[i];
        if (link.href === href) {
            return link;
        }
    }
}

function lerp(x0, x1, t) { return x0 + (x1 - x0) * t; }

function sanitize(text) {
    return text.replace(/^!.*\n?/gm, '');
}

var animating = false;
var sectionIndex = 0;
var imageIndex = 0;
function animateImage(direction) {
    if (animating) return;
    animating = true;

    var index = PAGES[sectionIndex].imageElements.length - imageIndex - 1;
    if (direction == 'backward') index++;
    var endOffset = 100;
    if (direction == 'backward') {
        endOffset = index * IMAGE_EXPOSED_PERCENT;
    }
    var target = PAGES[sectionIndex].imageElements[index];
    target.style.left = endOffset + '%';

    window.setTimeout(function() {
        animating = false;
        if (direction == 'forward') {
            imageIndex++;
        } else {
            imageIndex--;
        }
    }, IMAGE_DURATION);
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
        articleNode.className = 'summary';
        section.element.appendChild(articleNode);
        var imageStackContainer = document.createElement('div');
        imageStackContainer.className = 'image-stack-container';
        section.element.appendChild(imageStackContainer);

        section.imageElements = [];
        for (var i = 0; i < section.count; i++) {
            var imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            imageContainer.style.left = (IMAGE_EXPOSED_PERCENT * i) + '%';
            imageContainer.style.backgroundColor = 'rgb(0, ' + (255-50*i) + ', 0)';
            section.imageElements.push(imageContainer);
            imageStackContainer.appendChild(imageContainer);
        }

        if (first) {
            first = false;
            section.element.className = 'focus';
        } else {
            section.element.className = 'below';
        }

        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var text = sanitize(request.responseText);
                var content = markdown.toHTML(text);
                articleNode.insertAdjacentHTML('beforeend', content);
                var links = articleNode.getElementsByTagName('a');
                [].forEach.call(links, function(link) {
                    link.onclick = overlayFullText;
                });
            }
        };
        request.open('GET', section.source, true);
        request.send();
    });
}

function overlayFullText(event) {
    var href = event.target.getAttribute('href');
    if (href.match(/^https?:/)) return;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var text = sanitize(request.responseText);
            var content = markdown.toHTML(text);
            var sidebar = document.getElementById('full-text');
            sidebar.className = '';
            document.getElementById('full-article').innerHTML = content;
            [].forEach.call(
                document.getElementsByClassName('image-stack-container'),
                function(c) { c.style.width = '100%'; });
            PAGES[sectionIndex].imageElements.forEach(function(element) {
                element.className += ' stick-left';
            });
        }
    };
    request.open('GET', '/content'+href+'.md', true);
    request.send();
    document.removeEventListener('wheel', onScroll);
    document.getElementsByTagName('header')[0].className = 'white-header';
    event.preventDefault();
}

function closeFullText(event) {
    event.preventDefault();
    document.getElementById('full-text').className = 'collapsed';
    [].forEach.call(document.getElementsByClassName('image-stack-container'),
                    function(c) { c.style.width = ''; });
    PAGES[sectionIndex].imageElements.forEach(function(element) {
        element.className = 'image-container';
    });
    document.getElementsByTagName('header')[0].className = '';
    document.addEventListener('wheel', onScroll);
}

function onScroll(event) {
    event.preventDefault();
    if (animating) return;
    if (event.deltaY < 0) {
        backwardState(event);
    } else if (event.deltaY > 0) {
        forwardState(event);
    }
}

function forwardState(event) {
    event.preventDefault();
    if (animating) return;
    if (imageIndex >= PAGES[sectionIndex].count - 1) {
        if (sectionIndex < PAGES.length - 1) {
            animateSection('forward');
        }
    } else {
        animateImage('forward');
    }
}

function backwardState(event) {
    event.preventDefault();
    if (animating) return;
    if (imageIndex == 0) {
        if (sectionIndex > 0) {
            animateSection('backward');
        }
    } else {
        animateImage('backward');
    }
}

ready(function() {
    buildPage();
    document.addEventListener('wheel', onScroll);
    document.getElementById('up-button').onclick=backwardState;
    document.getElementById('down-button').onclick=forwardState;
    document.getElementById('close-text').onclick=closeFullText;
});
