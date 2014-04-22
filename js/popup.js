/*jslint browser: true, vars: false, plusplus: true, indent: 4 */
/*global chrome */
if (typeof LGExtension == "undefined" || !LGExtension) {var LGExtension = {}};

var lg = LGExtension;

lg.option = {
    "show_image_location" : false,
    "show_data_uri" : false,
    "show_size_file" : false,
    "show_type_mime" : false,
    "show_alt" : false,
    "show_dimensions" : false,
    "show_src" : false,
    "show_src_large" : true,
    "show_image_large" : true
}

// localise
document.getElementsByTagName('title')[0].textContent = chrome.i18n.getMessage('title');
document.querySelector('#exif h1').textContent = chrome.i18n.getMessage('exif');

// close the popup by pressing 'esc'
document.onkeydown = function (e) {
    if (e.keyCode === 27) {
        window.close();
    }
};

// information from background.html
var Query = (function () {
    var o = {};
    var q = location.search.substring(1).split('&');
    for (var i=0; i<q.length; i++) {
        var p = q[i].split('=');
        o[p[0]] = decodeURIComponent(p[1]);
    }
    return o;
}());

// add a row of information to a table
var Table = function (elem) {
    var table = elem;
    var EMPTY = "<span>N/A</span>";
    return function add (title, value) {
        var r = document.createElement('tr');
        var t = document.createElement('td');
        var v = document.createElement('td');
        t.innerHTML = title || EMPTY;
        if (value instanceof HTMLElement) {
            v.appendChild(value);
        } else {
            v.innerHTML = value || EMPTY;
            v.onclick = function () {
                window.getSelection().setBaseAndExtent(this, 0, this, 1);
                /*alert('x');
                alert(this.value);
                //clipboardCopier.value = text;
                //this.select();
                document.execCommand("copy", false, null);*/
            }
        }
        r.appendChild(t);
        r.appendChild(v);
        table.appendChild(r);
    }
};

// info table
var Info = Table(document.querySelector('#info > table'));

// overlay (needs work)
var overlay = document.getElementById('overlay');

(function () {
    var close = document.getElementsByClassName('close');
    var boxes = document.querySelectorAll('#overlay > div');
    for (var i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            overlay.setAttribute('class', 'hide');
            for (var j = 0; j < boxes.length; j++) {
                boxes[j].setAttribute('class', 'hide');
            }
        }
    }
}());

///////////////////////////////////////////////////////////////////////////////

var img = new Image();
img.src = Query.src;
img.srcLarge = Query.srcLarge;
if(lg.option.show_image_large){
    var imgLarge = new Image();
    imgLarge.src = Query.srcLarge;
    imgLarge.srcLarge = Query.srcLarge;
    imgLarge.onload = getImage;
}else{
    img.onload = getImage;
}

function getImage () {
    document.getElementById('preview').appendChild(this);
    controls(this);
    getInfo(this);
}

function controls (img) {
    var WIDTH = img.width;
    var HEIGHT = img.height;
    // zoom control
    var zoom = document.getElementById('zoom');
    var zoom_reset = zoom.querySelector('a.reset')
    var zoom_range = zoom.querySelector('input[type="range"]')
    zoom_reset.onclick = function () {
        img.style.width = WIDTH+"px";
        img.style.height = HEIGHT+"px";
        zoom_range.value = 100;
    }
    zoom_range.onchange = function () {
        var w = Math.floor(WIDTH * (this.value/100));
        var h = Math.floor(HEIGHT * (this.value/100));
        img.style.width = w+"px";
        img.style.height = h+"px";
    }
    // set default width and height to stop css transition jerking
    img.style.width = WIDTH+"px";
    img.style.height = HEIGHT+"px";
}

function getInfo (img) {
    var SRC      = img.src;
    var SRCLARGE = img.srcLarge;
    var WIDTH    = img.width;
    var HEIGHT   = img.height;
    var DIMEN    = WIDTH + " x " + HEIGHT;
    var PAGE     = Query.page;
    var ALT      = Query.alt;
    var GO       = Query.go;
    
    GO = (GO === "null")? chrome.i18n.getMessage('not_available') : GO;
    console.log(Query);
    if ((Query.width && WIDTH !== parseInt(Query.width))
    || (Query.height && HEIGHT !== parseInt(Query.height))) {
        DIMEN += " (" + Query.width + " x " + Query.height + ")";
    }
    if(lg.option.show_image_location)
        Info(chrome.i18n.getMessage('location'), PAGE);
    if(!lg.option.show_image_large)
        Info(chrome.i18n.getMessage('source'), SRC);
    Info(chrome.i18n.getMessage('source_large'), SRCLARGE);
    if(lg.option.show_dimensions)
        Info(chrome.i18n.getMessage('dimensions'), DIMEN);
    if(lg.option.show_alt)
        Info(chrome.i18n.getMessage('alt'), ALT);
    Info(chrome.i18n.getMessage('go'), GO);
    getFileSize(SRC);
    imageDataURL(img);
};

function getFileSize (url) {
    if (/^http:\/\//.test(url)) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var fsize = null;
                var type = xhr.getResponseHeader('Content-Type');
                var B = xhr.responseText.length;
                var KB = B/1024;
                var MB = B/1024/1024;
                if (MB > 1) {
                    fsize = MB.toFixed(2) + " MB (" + B + " bytes)";
                } else if (KB > 1) {
                    fsize = KB.toFixed(2) + " KB (" + B + " bytes)";
                } else {
                    fsize = B + " bytes";
                }
                if (fsize) {
                    if(lg.option.show_size_file)
                    Info(chrome.i18n.getMessage('size'), fsize);
                }
                if (type) {
                    if(lg.option.show_type_mime)
                        Info(chrome.i18n.getMessage('type'), type);
                }
                getEXIF(xhr.responseText)
            }
        }
    }
};

function getEXIF (responseText) {
    var data = findEXIFinJPEG(responseText);
    if (data && Object.getOwnPropertyNames(data).length > 0) {
        var exif = document.getElementById('exif');
        var table = document.createElement('table');
        var t = Table(table);
        for (var d in data) {
            t(d, data[d]);
        }
        document.querySelector('#exif div').appendChild(table);
        var open = document.createElement('a');
        open.textContent = chrome.i18n.getMessage('view');
        open.onclick = function () {
            overlay.setAttribute('class', 'show');
            exif.setAttribute('class', 'show');
        }
        Info(chrome.i18n.getMessage('exif'), open);
    }

};

// needs work
function imageDataURL (img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    try {
        var d = canvas.toDataURL("image/png");
        var data = document.getElementById('data');
        var div = document.querySelector('#data div');
        div.innerText = d;
        div.onclick = function () {
            window.getSelection().setBaseAndExtent(this, 0, this, 1);
        }
        var open = document.createElement('a');
        open.textContent = "view data";
        open.onclick = function () {
            overlay.setAttribute('class', 'show');
            data.setAttribute('class', 'show');
        }
        if(lg.option.show_data_uri)
            Info("Data URI", open);
    } catch (e) {
        // I don't always suppress errors
        // but when I do I leave a useless comment
    }
};

/*function copyToClipboard (text) {
    var clipboardCopier = document.getElementById('clipboard-copier');
    if (!clipboardCopier) {
        clipboardCopier = document.createElement('textarea');
        clipboardCopier.id = 'clipboard-copier';
        document.body.appendChild(clipboardCopier);
    }

    clipboardCopier.value = text;
    clipboardCopier.select();
    document.execCommand("copy", false, null);
}*/