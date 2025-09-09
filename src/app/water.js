import { loadOnEveryMap } from "./game-integration/loaders";

function applySingleWaterChange(x, y, waterTopModify) {
  if (INTERFACE === "NI") {
    Engine.map.water[x + 256 * y] = waterTopModify;
  } else {
    map.water[x + 256 * y] = waterTopModify;
  }
}

export function applyWater(mapId) {
  if (!AVAILABLE_MAP_FILES.water.includes(mapId)) {
    return;
  }
  fetch(FILE_PREFIX + "res/configs/water/" + CURRENT_MAP_ID + ".json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((waterChange) => {
        applySingleWaterChange(waterChange.x, waterChange.y, waterChange.water);
      });
    })
    .catch((error) => {
      console.error("Error loading Nerthus water data:", error);
    });
}

export function initWaterManager() {
  loadOnEveryMap(() => {
    applyWater(CURRENT_MAP_ID);
  });
}
