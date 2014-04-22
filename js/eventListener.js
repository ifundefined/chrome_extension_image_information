/* get the width and height of the img as it appears on the page and the alt text */
document.addEventListener("contextmenu", function (e) {
    var elem = e.srcElement;
    if (elem instanceof HTMLImageElement) {
        var img = {
            src: elem.src,
            alt: elem.alt,
            height: elem.height,
            width: elem.width,
            go: elem.getAttribute("data-ext-chrome-url-go")
        }
        chrome.extension.sendRequest(img);
    }
}, true);