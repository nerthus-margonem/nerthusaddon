// ==UserScript==
// @name         Nerthus Addon
// @namespace    http://www.margonem.pl/
// @version      2.10.6
// @description  Addon for Nerthus
// @author       Aldi, Kris Aphalon
// @match        http://nerthus.margonem.pl/
// ==/UserScript==

(function ()
{
    const script = document.createElement('script')
    script.src = 'https://akrzyz.github.io/nerthusaddon/NN_start.js'
    script.async = false
    document.head.appendChild(script)
})()
