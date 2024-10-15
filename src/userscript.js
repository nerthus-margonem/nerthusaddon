// ==UserScript==
// @name         $USERSCRIPT_NAME
// @namespace    http://www.margonem.pl/
// @version      4.0.0
// @description  Addon for the Nerthus game server in Margonem
// @author       Kris Aphalon, Aldi
// @match        https://nerthus.margonem.pl/
// @icon         $USERSCRIPT_ICON_URL
// ==/UserScript==

(function ()
{
    function start(version)
    {
        const gameInterface = document.cookie
            .split('; ')
            .find((row) => row.startsWith('interface='))
            ?.split('=')[1]

        if (!gameInterface)
        {
            setTimeout(() => start(version), 500)
            return
        }

        let logText = 'Nerthus addon version: ' + version
        let src
        switch (gameInterface)
        {
            case 'ni':
            {
                src = NI_VERSION_URL
                break
            }
            case 'si':
            {
                src = SI_VERSION_URL
                logText = `<span style="color:lime">${logText}</span>`
                break
            }
            default:
            {
                const errorMsg =
                    'Nerthus addon couldn\'t detect your interface. ' +
                    'Try restarting your game or clearing cookies. ' +
                    'If this error persists, submit a bug on Nerthus\'s forum.'
                this.error?.(errorMsg)
                console.error(errorMsg)
                return
            }
        }
        this.log?.(logText)

        const script = document.createElement('script')
        script.src = src.replace('$VERSION', version)
        document.head.appendChild(script)
    }

    fetch(VERSION_URL)
        .then((res) => res.text())
        .then(start)
        .catch((error) =>
        {
            console.error('Unable to load nerthus addon: ', error)
        })
})()
