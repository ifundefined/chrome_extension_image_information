var REQUEST = null; // object sent from eventListener.js
var CONTEXT = null; // the context menu object
var ID = 0; // used to give each window a unique name
var WIDTH = 500; // default width
var HEIGHT = 500; // default height
var POPUP_WIDTH = 680; // default Popup width
var POPUP_HEIGHT = 650; // default Popup height


(function () {
    var props = {
        "title": chrome.i18n.getMessage('title'),
        "contexts": ["image"],
        "onclick": function (info) {
            var url = "popup.html?";
            url += "page=" + encodeURIComponent(info.pageUrl);
            url += "&src=" + encodeURIComponent(info.srcUrl);
            url += "&srcLarge=" + encodeURIComponent(getUrlLarge(info.srcUrl));
            if (REQUEST !== null) {
                if (REQUEST.hasOwnProperty('width')) {
                    url += "&width=" + encodeURIComponent(REQUEST.width);
                }
                if (REQUEST.hasOwnProperty('height')) {
                    url += "&height=" + encodeURIComponent(REQUEST.height);
                }
                if (REQUEST.hasOwnProperty('alt')) {
                    url += "&alt=" + encodeURIComponent(REQUEST.alt);
                }
                if (REQUEST.hasOwnProperty('go')) {
                    url += "&go=" + encodeURIComponent(REQUEST.go);
                }
                REQUEST = null; // reset
            }
            
            var w = parseInt(localStorage['input_option_popup_width']) || POPUP_WIDTH;
            var h = parseInt(localStorage['input_option_popup_height']) || POPUP_HEIGHT;
            window.open(url, "ip" + (ID++), "width=" + w + ", height=" + h + "");
        }
    }
    if (CONTEXT) {
        chrome.contextMenus.update(CONTEXT, props);
    } else {
        CONTEXT = chrome.contextMenus.create(props);
    }
    var cookie_sb = {
        "host": ".leguide.com",
        "name": "CK_EXTCHROME_SB",
        "protocol": "http://",
        "secure": false,
        "url": null,
        "value": "sb"
    };
    addCookie(cookie_sb);

    var cookie_pc = {
        "host": ".leguide.com",
        "name": "CK_EXTCHROME_PARTNER_CODE",
        "protocol": "http://",
        "secure": false,
        "url": null,
        "value": "lg"
    };
    addCookie(cookie_pc);
}());

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        REQUEST = request;
    }
);

function getUrlLarge(url){
    var reg=new RegExp("(T\/[0-9]{1,3}x[0-9]{1,3}\/C)", "g");
    return url.replace(reg,"T/500x500/C");
}

function addCookie(cookie) {
    var host = cookie.host.trim();
    var name = cookie.name.trim();
    var protocol = "http://";
    var secure = cookie.secure;
    var url = null;
    var value = cookie.value.trim();

    // If the cookie is secure
    if (secure) {
        protocol = "https://";
    }

    url = protocol + host;

    chrome.cookies.set({
        "domain": host,
        "name": name,
        "secure": secure,
        "url": url,
        "value": value
    });
};