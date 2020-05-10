// ==UserScript==
// @name         Nerthus Addon
// @namespace    http://www.margonem.pl/
// @version      3.0 Beta 1
// @description  Addon for Nerthus
// @author       Aldi, Kris Aphalon
// @match        http://nerthus.margonem.pl/
// ==/UserScript==

(function ()
{
    function start(version)
    {
        const arr = /interface=(..)/.exec(document.cookie)
        if (arr)
        {
            const gameInterface = arr[1]
            let src
            if (gameInterface === 'ni') src = 'https://cdn.jsdelivr.net/gh/krisaphalon/nerthusaddon@webpack/dist/nerthus-addon-NI.js?v=' + version
            else if (gameInterface === 'si') src = 'https://cdn.jsdelivr.net/gh/krisaphalon/nerthusaddon@webpack/dist/nerthus-addon-SI.js?v=' + version
            else
            {
                const errorMsg =
                    'Nerthus addon couldn\'t detect your interface. ' +
                    'Try restarting your game or cleaning cookies. ' +
                    'If this error persists, submit a bug on Nerthus\'s forum.'
                window.error(errorMsg)
                console.error(errorMsg)
            }

            if (src)
            {
                const script = document.createElement('script')
                script.src = src
                document.head.appendChild(script)
            }
        }
        else setTimeout(start, 500)
    }
    $.get('https://raw.githubusercontent.com/KrisAphalon/nerthusaddon/webpack/version', function (version)
    {
        start(version)
    })
})()
