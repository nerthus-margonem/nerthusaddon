import { loadOnEveryMap } from "../game-integration/loaders";
import { debounce } from "../utility-functions";

const NERTHUS_FOG_ID = "nerthus-fog";

/** @type {Map<number | "default", {r: number, g: number, b: number, a: number}>} */
const fogs = new Map();

// Displaying and clearing fogs is a bit buggy,
// So we add 100 ms delay to any fog change event.
// This isn't perfect but hides most of the problems.
const debouncedDisplayFog = debounce(displayFog, 100);

/**
 * @param {{r: number, g: number, b: number, a: number}} color
 * @param {number | "default"} mapId
 */
export function createFog(
  color = { r: 255, g: 255, b: 255, a: 0.4 },
  mapId = "default",
) {
  fogs.set(mapId, color);
  if (
    mapId === "default" ||
    mapId === (INTERFACE === "NI" ? Engine.map.d.id : map.id)
  ) {
    debouncedDisplayFog();
  }
}

/**
 * @param {number | "default"} mapId
 */
export function clearFog(mapId = "default") {
  console.log("Clearing fog", mapId);
  fogs.delete(mapId);
  if (
    mapId === "default" ||
    mapId === (INTERFACE === "NI" ? Engine.map.d.id : map.id)
  ) {
    debouncedDisplayFog();
  }
}

function displayFog() {
  if (INTERFACE === "SI") {
    console.log("Fog effects work only on NI");
    return;
  }

  Engine.floatForegroundManager.updateData({
    action: "REMOVE",
    id: NERTHUS_FOG_ID,
  });

  const fogColor = fogs.get(Engine.map.d.id) ?? fogs.get("default");
  if (fogColor === undefined) {
    return;
  }

  if (fogColor.a !== 0) {
    Engine.floatForegroundManager.updateData({
      action: "CREATE",
      id: NERTHUS_FOG_ID,
      url: "chmury/mgla1.png",
      color: fogColor,
      configurationType: "WEATHER",
    });
  }
}

export function initFog() {
  if (INTERFACE === "SI") {
    console.log("Fog effects work only on NI");
    return;
  }
  loadOnEveryMap(displayFog);
}
