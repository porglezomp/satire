var SECTION_DURATION = 800;
var IMAGE_DURATION = 600;
var IMAGE_EXPOSED_PERCENT = 5;
var PAGES = [
    {
        title: '',
        type: 'video',
        count: 0
    },
    {
        title: "The Problem",
        source: '01-00-the-problem',
        count: 4,
        images: ['headdress.jpg', 'so-many-feathers.jpg', 'red-tribe.jpg', 'huni-kuni.jpg']
    },
    {
        title: "Why Amazon?",
        source: '01-01-why-amazon',
        count: 3,
        images: ['lots-of-trees.jpg', 'tree-above.jpg', 'vine-tree.jpg']
    },
    {
        title: "What We're Doing",
        source: '02-00-what-were-doing',
        count: 3,
        images: ["bird.jpg", "yo-bird.jpg", "yo-yo-bird.jpg"]
    },
    {
        title: "Products",
        source: '02-01-products',
        count: 3,
        images: ['man-with-leaves.jpg', 'xingu.jpg', 'arrers.jpg']
    },
    {
        title: "The Technology",
        source: '02-02-the-technology',
        count: 3,
        images: ['vine-tree.jpg', 'its-another-tree.jpg', 'rainforest-canopy.jpg']
    },
    {
        title: "More",
        source: '03-00-more',
        count: 6,
        images: ['cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg','cacao-tree.jpg', 'my-god-its-full-of-feathers.jpg']
    }
];

function ready(fn) {
    if (document.readyState != 'loading') {
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
    if (PAGES[sectionIndex].count) {
        var target = PAGES[sectionIndex].imageElements[index];
        target.style.left = endOffset + '%';
    }

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
    var targetIndex = sectionIndex;
    if (direction == 'forward') {
        targetIndex++;
        current.element.className = 'above';
    } else {
        targetIndex--;
        current.element.className = 'below';
    }
    var target = PAGES[targetIndex];
    target.element.className = 'focus';
    document.body.className = target.type || '';
    pauseYouTubeVideo();

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
    PAGES.forEach(function(section, i) {
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
            imageContainer.style.backgroundImage = 'url(/images/'+section.images[i]+')';
        }

        if (i === 0) {
            section.element.className = 'focus';
            section.element.innerHTML = '<div class="video-container"><iframe id="promo-video" src="//www.youtube.com/embed/uautw3v0Gs0?enablejsapi=1" frameborder="0" modestbranding="1" allowfullscreen></iframe></div>';
            function infect(element, event, fn) {
                element.addEventListener(event, onScroll);
                var children = element.childNodes;
                for (var i = 0; i < children.length; i++) {
                    infect(children[i], event, fn);
                }
            }
            infect(document.getElementById('promo-video'), 'wheel', onScroll);
        } else {
            section.element.className = 'below';
        }

        if (!section.source) return;

        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                articleNode.insertAdjacentHTML('beforeend', request.responseText);
                var links = articleNode.getElementsByTagName('a');
                [].forEach.call(links, function(link) {
                    link.onclick = overlayFullText;
                });
            }
        };
        request.open('GET', '/content/' + section.source + '.html', true);
        request.send();
    });
    document.body.className = PAGES[sectionIndex].type;
}

function overlayFullText(event) {
    var href = event.target.getAttribute('href');
    if (href.match(/^https?:/)) return;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var sidebar = document.getElementById('full-text');
            sidebar.className = '';
            document.getElementById('full-article').innerHTML = request.responseText;
            [].forEach.call(
                document.getElementsByClassName('image-stack-container'),
                function(c) { c.style.width = '100%'; });
            PAGES[sectionIndex].imageElements.forEach(function(element) {
                element.className += ' stick-left';
            });
        }
    };
    request.open('GET', '/content'+href+'.html', true);
    request.send();
    document.removeEventListener('wheel', onScroll);
    document.getElementsByTagName('header')[0].className = 'white-header';
    document.body.className = 'full-text';
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
    document.body.className = PAGES[sectionIndex].type;
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

function viewSatire(event) {
    event.preventDefault();
    closeSatireNotification(event);
    document.body.className = 'show-satire';
    document.getElementById('about-toggle').onclick = closeSatire;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            document.getElementById('satire-article').innerHTML = request.responseText;
        }
    };
    var href = event.target.getAttribute('href');
    request.open('GET', '/content'+href+'.html', true);
    request.send();
    document.removeEventListener('wheel', onScroll);
}

function closeSatire(event) {
    event.preventDefault();
    document.body.className = PAGES[sectionIndex].type || '';
    document.getElementById('about-toggle').onclick = viewSatire;
    document.addEventListener('wheel', onScroll);
}

function displaySatireNotification() {
    if (!window.sessionStorage.getItem('no-nag')) {
        window.setTimeout(function() {
            document.getElementById('about-satire').style.top = '';
        }, 10);
    }
}

function closeSatireNotification(event) {
    event.preventDefault();
    window.sessionStorage.setItem('no-nag', true);
    document.getElementById('about-satire').style.top = '-100px';
}

function pauseYouTubeVideo() {
    document.getElementById('promo-video').contentWindow
        .postMessage('{"event": "command", "func": "pauseVideo", "arg": ""}', '*');
}

ready(function() {
    buildPage();
    displaySatireNotification();
    document.addEventListener('wheel', onScroll);
    document.getElementById('down-button').onclick=forwardState;
    document.getElementById('close-text').onclick=closeFullText;
    document.getElementById('close-satire-notification')
        .onclick=closeSatireNotification;
    document.getElementById('view-satire').onclick=viewSatire;
    document.getElementById('about-toggle').onclick=viewSatire;
});
