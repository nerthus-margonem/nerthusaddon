import { mapBoundAssetLoader } from "./assets/map-bound-asset-loader.ts";
import { loadOnEveryMap } from "./game-integration/loaders";

function applySingleWaterChange(x, y, waterTopModify) {
  if (INTERFACE === "NI") {
    Engine.map.water[x + 256 * y] = waterTopModify;
  } else {
    map.water[x + 256 * y] = waterTopModify;
  }
}

async function loadWaterFromUrl(url) {
  const waterData = await mapBoundAssetLoader.loadJsonAsset(url);
  if (!waterData) {
    return;
  }

  for (const waterChange of waterData) {
    applySingleWaterChange(waterChange.x, waterChange.y, waterChange.water);
  }
}

export function applyWater(mapId) {
  if (!AVAILABLE_MAP_FILES.water.includes(mapId)) {
    return;
  }

  void loadWaterFromUrl(FILE_PREFIX + "res/configs/water/" + mapId + ".json");
}

export function initWaterManager() {
  loadOnEveryMap(() => {
    applyWater(CURRENT_MAP_ID);
  });
}
