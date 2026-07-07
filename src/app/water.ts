import { mapBoundAssetLoader } from "./assets/map-bound-asset-loader.js";
import { loadOnEveryMap } from "./game-integration/loaders.js";

function applySingleWaterChange(
  x: number,
  y: number,
  waterTopModify: number,
): void {
  if (INTERFACE === "NI") {
    Engine.map.water[x + 256 * y] = waterTopModify;
  } else {
    map.water[x + 256 * y] = waterTopModify;
  }
}

async function loadWaterFromUrl(url: string): Promise<void> {
  const waterData =
    await mapBoundAssetLoader.loadJsonAsset<
      { x: number; y: number; water: number }[]
    >(url);
  if (!waterData) {
    return;
  }

  for (const waterChange of waterData) {
    applySingleWaterChange(waterChange.x, waterChange.y, waterChange.water);
  }
}

export function applyWater(mapId: number): void {
  if (!AVAILABLE_MAP_FILES.water.includes(mapId)) {
    return;
  }

  void loadWaterFromUrl(FILE_PREFIX + "res/configs/water/" + mapId + ".json");
}

export function initWaterManager(): void {
  loadOnEveryMap(() => {
    applyWater(CURRENT_MAP_ID);
  });
}
