let currentLoadedMapId = -1;
const loadQueue = [];

/** @type { import("../../game.d.ts").Drawable[]} */
const drawables = [];

/**
 * Executes function immediately, then executes it at every new map load
 * @param fun - function that will be executed
 * @param args - arguments function will take
 */
export function loadOnEveryMap(fun, args) {
  if (currentLoadedMapId !== -1) fun(args);
  loadQueue.push([fun, args]);
}

function loadNewMapQueue() {
  if (INTERFACE === "NI") {
    currentLoadedMapId = Engine.map.d.id;
  } else {
    currentLoadedMapId = map.id;
  }

  for (const i in loadQueue) {
    loadQueue[i][0](loadQueue[i][1]);
  }
}

export function initiateGameIntegrationLoaders() {
  //TODO bug: sometimes long loading new map is loaded faster than old
  if (INTERFACE === "NI") {
    currentLoadedMapId = Engine.map.d.id;
    const hideLoaderSplash = Engine.map.hideLoaderSplash;
    Engine.map.hideLoaderSplash = function () {
      if (Engine.map.d.id !== currentLoadedMapId) {
        loadNewMapQueue();
      }
      hideLoaderSplash.call(Engine.map);
    };
  } else {
    currentLoadedMapId = map.id;
    map.__id = map.id;
    Object.defineProperty(map, "id", {
      set(val) {
        this.__id = val;
        setTimeout(loadNewMapQueue, 0);
      },
      get() {
        return this.__id;
      },
    });
    // Handle Szybsze przechodzenie by Adi Wilk
    window.g.chat.__parsers = window.g.chat.parsers;
    Object.defineProperty(window.g.chat, "parsers", {
      set(val) {
        this.__parsers = val;
        if (val.length === 0) loadNewMapQueue();
      },
      get() {
        return this.__parsers;
      },
    });
  }
}

export function addToNiDrawList(preparedObject, id) {
  const npcList = Engine.npcs.check();
  npcList[id] = preparedObject;
}

export function removeFromNiDrawList(id) {
  const npcList = Engine.npcs.check();
  delete npcList[id];
}

/** @param preparedObject { import("../../game.d.ts").Drawable } */
export function addDrawableToRendering(preparedObject) {
  drawables.push(preparedObject);
}

/** @param preparedObject { import("../../game.d.ts").Drawable } */
export function removeDrawableFromRendering(preparedObject) {
  if (drawables.includes(preparedObject)) {
    drawables.splice(drawables.indexOf(preparedObject), 1);
  }
}

export function startRenderer() {
  if (INTERFACE === "NI") {
    API.addCallbackToEvent(Engine.apiData.CALL_DRAW_ADD_TO_RENDERER, () => {
      Engine.renderer.add(...drawables);
    });
  }
}
