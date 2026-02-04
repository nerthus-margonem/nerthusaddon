// ==UserScript==
// @name         Nerthus Addon
// @namespace    http://www.margonem.pl/
// @version      5.0.0
// @description  Addon for the Nerthus game server in Margonem
// @author       Kris Aphalon, Aldi
// @match        https://nerthus.margonem.pl/
// @icon         https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@production/res/img/widget-icon.gif
// ==/UserScript==

(function () {
  function start() {
    const gameInterface = document.cookie
      .split("; ")
      .find((row) => row.startsWith("interface="))
      ?.split("=")[1];

    if (!gameInterface) {
      setTimeout(() => start(), 500);
      return;
    }

    let src;
    switch (gameInterface) {
      case "ni": {
        src = "https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@releases/$VERSION/dist/nerthus-addon-NI.js";
        break;
      }
      case "si": {
        src = "https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@releases/$VERSION/dist/nerthus-addon-SI.js";
        break;
      }
      default: {
        const errorMsg =
          "Nerthus addon couldn't detect your interface. " +
          "Try restarting your game or clearing cookies. " +
          "If this error persists, submit a bug on Nerthus's forum.";
        this.error?.(errorMsg);
        console.error(errorMsg);
        return;
      }
    }

    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  }

  start();
})();
