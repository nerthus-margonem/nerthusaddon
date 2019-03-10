// ==UserScript==
// @name         Nerthus NI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Addon for Nerthus
// @author       Kris Aphalon
// @match        http://nerthus.margonem.pl/
// @match        http://game3.margonem.pl/
// ==/UserScript==

(function ()
{
    "use strict"
    let loadScript = function (scriptName)
    {
        let head = document.getElementsByTagName("head")[0]
        let script = document.createElement("script")
        script.type = "text/javascript"
        script.src = scriptName
        script.async = false
        head.appendChild(script)
    }
    loadScript("https://krisaphalon.github.io/nerthusaddon/NN_start.js")
})()
