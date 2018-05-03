// ==UserScript==
// @name         Youtube - Restore Classic
// @version      1.0.6
// @description  If youtube is in the new 2017 YouTube Material Redesign, automatically restore classic view
// @author       Cpt_mathix
// @include      https://www.youtube.com
// @include      https://www.youtube.com/*
// @license      GPL-2.0+; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace    https://greasyfork.org/users/16080
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

(function() {
    init();

    window.addEventListener("spfdone", function(e) {
		document.getElementById("body").classList.remove("sitewide-ticker-visible");
	});

    function init() {
        restoreClassicYoutube();
        document.addEventListener('DOMContentLoaded', function(){
            hideNewYoutubeBanner();
        }, false);
    }

    function restoreClassicYoutube() {
        // Cookies are enabled?
        if (navigator.cookieEnabled) {
            if (document.cookie) {
                var cookie = getCookie("PREF");

                // Pref cookie exists?
                if (cookie) {
                    console.log("current PREF cookie: " + cookie);
                    if (cookie.search(/f6=(8|9)(&|;|$)/) === -1) {
                        replaceCookieAndReload(cookie);
                    } else {
                        deleteCache("reloadCount");
                    }
                } else {
                    createCookieAndReload();
                }
            } else {
                createCookieAndReload();
            }
        } else {
            console.log("Error: Youtube - Restore Classic doesn't work if cookies are disabled");
        }
    }

    function getCookie(name) {
        var cookie=  document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (cookie && cookie[1]) {
            return cookie[1];
        }
        return null;
    }

    function createCookieAndReload() {
        document.cookie = "PREF=f6=8;path=/;domain=.youtube.com";
        reload();
    }

    function replaceCookieAndReload(cookie) {
        if (cookie.search(/f6=[^;&]*/) === -1) {
            document.cookie = "PREF=" + cookie + "&f6=8" + ";path=/;domain=.youtube.com";
        } else if (cookie.search(/f6=[^;&]*/) !== -1) {
            document.cookie = "PREF=" + cookie.replace(/f6=[^;&]*/, 'f6=8') + ";path=/;domain=.youtube.com";
        }
        reload();
    }

    function reload() {
        var reloadCount = getCache("reloadCount");
        if (reloadCount && parseInt(reloadCount) <= 3) {
            setCache("reloadCount", parseInt(reloadCount) + 1);
            location.reload();
        } else if (reloadCount && parseInt(reloadCount) > 3) {
            console.log("Youtube - Restore Classic\nSomething went wrong... Please post the following information on greasyfork and disable this script\n\nDebug information:\nCookies enabled: " + navigator.cookieEnabled + "\nCurrent cookies: " + getCookie("PREF"));
            deleteCache("reloadCount");
        } else {
            setCache("reloadCount", 1);
            location.reload();
        }
    }

    function getCache(key) {
		return JSON.parse(localStorage.getItem("YTRestore#" + key));
	}

	function deleteCache(key) {
		localStorage.removeItem("YTRestore#" + key);
	}

	function setCache(key, value) {
		localStorage.setItem("YTRestore#" + key, JSON.stringify(value));
	}

    function hideNewYoutubeBanner() {
        document.getElementById("body").classList.remove("sitewide-ticker-visible");

		var css = `
#ticker {
    display: none!important;
}
`;

		var style = document.createElement("style");
		style.type = "text/css";
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		document.documentElement.appendChild(style);
	}
})();
