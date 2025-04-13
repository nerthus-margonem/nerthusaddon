import { callEvent, initAPI } from "./app/API";
import { initChatMgr } from "./app/chat/chat";
import { initBasicChatCommands } from "./app/chat/commands";
import { initHideChatCommercials } from "./app/chat/hide-chat-commercials";
import { initiateGameIntegrationLoaders } from "./app/game-integration/loaders";
import { initTips } from "./app/game-integration/tips";
import { addBasicStyles } from "./app/interface/css-manager";
import { initPanel } from "./app/interface/panel";
import { initMapsManager } from "./app/maps";
import { initNightManager } from "./app/night/night";
import { initNpcManager } from "./app/npc/npc";
import { loadSettings } from "./app/settings";
import { sanitizeText } from "./app/utility-functions";
import { initWeather } from "./app/weather/weather";
import { initWidgets } from "./app/widgets";
import { initZodiac } from "./app/zodiac";

const logText = sanitizeText("Nerthus addon version: " + VERSION);
if (INTERFACE === "NI") {
  log(logText);
} else {
  log(`<span style="color:lime">${logText}</span>`);
}

function start() {
  initAPI();

  addBasicStyles();
  loadSettings();

  initTips();

  initiateGameIntegrationLoaders();

  initMapsManager();

  initNpcManager();

  initNightManager();

  initWidgets();
  initWeather();
  initZodiac();

  initHideChatCommercials();
  initBasicChatCommands();
  initChatMgr();

  initPanel();

  callEvent("loaded");
}

if (INTERFACE === "NI") {
  if (Engine?.map?.d?.id) start();
  else {
    // We need to make sure the map image is loaded, as most of
    // the Engine's functions won't work correctly without it.
    // Since we can't influence weirdly linked dependencies in
    // the game's code, we are going to use this hack, as
    // we know for certain hero.updateCollider is called once
    // after map update
    const heroUpdateCollider = Engine.hero.updateCollider;
    Engine.hero.updateCollider = function () {
      heroUpdateCollider.call(Engine.hero);
      // Make sure the map image has been loaded, as something else can
      // execute this function otherwise.
      if (Engine.map.imgLoaded) {
        // We only want to start once, so after starting,
        // this hook is no longer needed. That's why we
        // change it back to default.
        Engine.hero.updateCollider = heroUpdateCollider;

        start();
      }
    };
  }
} else {
  start();
}
