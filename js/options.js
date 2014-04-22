//localise
document.getElementsByTagName('title')[0].textContent = chrome.i18n.getMessage('options');
document.getElementsByTagName('h1')[0].textContent = chrome.i18n.getMessage('ext_name');

// popup size
document.querySelector('#option-size .title').textContent = chrome.i18n.getMessage('image_size');
document.querySelector('#option-popup-size .title').textContent = chrome.i18n.getMessage('popup_size');
var input_option_width = document.getElementById('input-option-width');
input_option_width.value = parseInt(localStorage['input_option_width']) || 500;
var input_option_height = document.getElementById('input-option-height');
input_option_height.value = parseInt(localStorage['input_option_height']) || 500;

var input_option_popup_width = document.getElementById('input-option-popup-width');
input_option_popup_width.value = parseInt(localStorage['input_option_popup_width']) || 680;
var input_option_popup_height = document.getElementById('input-option-popup-height');
input_option_popup_height.value = parseInt(localStorage['input_option_popup_height']) || 650;


var input_option_code = document.getElementById('input-option-partnercode');
input_option_code.value = localStorage['input_option_code'] || 'lg';
var input_option_sb = document.getElementById('input-option-sb');
input_option_sb.value = localStorage['input_option_sb'] || '';
var elemOptionShowImage = document.getElementsByName('myradio')
valueOptionShowImage = parseInt(localStorage['optionShowImage']) || 1;
for (var i = 0, length = elemOptionShowImage.length; i < length; i++) {
    if (elemOptionShowImage[i].value == valueOptionShowImage) {
        elemOptionShowImage[i].checked=true
        break;
    }
}

// save button action
var save = document.querySelector('#save button');
save.textContent = chrome.i18n.getMessage('save');
save.onclick = function () {
    var info = document.getElementById('info');
    if (!isNaN(input_option_width.value) && !isNaN(input_option_height.value)) {
        localStorage['input_option_width'] = input_option_width.value;
        localStorage['input_option_height'] = input_option_height.value;
        localStorage['input_option_popup_width'] = input_option_popup_width.value;
        localStorage['input_option_popup_height'] = input_option_popup_height.value;
        localStorage['input_option_code'] = input_option_code.value;
        localStorage['input_option_sb'] = input_option_sb.value;
        var cookie_pc = {
            "host": ".leguide.com",
            "name": "CK_EXTCHROME_PARTNER_CODE",
            "protocol": "http://",
            "secure": false,
            "url": null,
            "value": localStorage['input_option_code']
        };
        addCookie(cookie_pc);
        var cookie_sb = {
            "host": ".leguide.com",
            "name": "CK_EXTCHROME_SB",
            "protocol": "http://",
            "secure": false,
            "url": null,
            "value": localStorage['input_option_sb']
        };
        addCookie(cookie_sb);
        localStorage['optionShowImage'] = document.querySelector('input[name="myradio"]:checked').value;
        info.textContent = chrome.i18n.getMessage('saved');
        info.className = "saved";
    }
    else {
        info.textContent = chrome.i18n.getMessage('error');
        info.className = "error";
    }
    setTimeout(function() {
        info.removeAttribute('class');
    }, 2500);
};

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