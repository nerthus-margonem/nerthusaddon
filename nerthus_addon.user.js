// ==UserScript==
// @name         Nerthus NI
// @namespace    http://www.margonem.pl/
// @version      2.0
// @description  Addon for Nerthus
// @author       Kris Aphalon
// @match        http://nerthus.margonem.pl/
// @match        http://game3.margonem.pl/
// ==/UserScript==

(function ()
{
    "use strict"
    let loadScript = function (scriptSrc)
    {
        let script = document.createElement("script")
        script.src = scriptSrc
        script.async = false
        document.head.appendChild(script)
    }
    loadScript("https://krisaphalon.github.io/nerthusaddon/NN_start.js")
})()
