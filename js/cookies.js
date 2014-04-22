var LGExtension = LGExtension || {};

LGExtension.Cookies = LGExtension.Cookies || {};

// Adds a cookie
LGExtension.Cookies.addCookie = function(cookie)
{
  var host     = cookie.host.trim();
  var name     = cookie.name.trim();
  var protocol = "http://";
  var secure   = cookie.secure;
  var url      = null;
  var value    = cookie.value.trim();

  // If the cookie is secure
  if(secure)
  {
    protocol = "https://";
  }

  url = protocol + host + cookie.path.trim();

  // If the cookie is a session cookie
  if(cookie.session)
  {
    chrome.cookies.set({ "domain": host, "name": name, "secure": secure, "url": url, "value": value });
  }
  else
  {
    chrome.cookies.set({ "domain": host, "expirationDate": (new Date(cookie.expires.trim()).getTime()) / 1000, "name": name, "secure": secure, "url": url, "value": value });
  }
};

// Returns true if you can edit a local cookie
LGExtension.Cookies.canEditLocalCookie = function()
{
  return false;
};

// Deletes a cookie
LGExtension.Cookies.deleteCookie = function(cookie)
{
  var protocol = "http://";

  // If the cookie is secure
  if(cookie.secure)
  {
    protocol = "https://";
  }

  chrome.cookies.remove({ "name": cookie.name, "url": protocol + cookie.host + cookie.path });
};
