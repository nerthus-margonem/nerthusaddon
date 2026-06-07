import {
  addDrawableToRendering,
  loadOnEveryMap,
  removeDrawableFromRendering,
} from "../game-integration/loaders";
import { addSettingToPanel } from "../interface/panel";
import { Drawable } from "../npc/Drawable";
import { settings } from "../settings";
import { isCurrentMapOutdoor } from "../utility-functions";
import { lightsOn, resetLights, turnLightsOn } from "./lights";

let currentDarknessObject: Drawable | undefined;
let opacityChange = 0;
const forcedParameters = new Map<
  number | "default",
  { opacity: number; color: string }
>();

function timeToOpacity(time: Date): number {
  const hour = time.getHours();
  let opacity: number;
  if (hour < 12) {
    opacity = -Math.pow(0.14 * hour - 1.29, 2) + 1;
  } else {
    opacity = -Math.pow(0.1 * hour - 1.57, 2) + 1;
  }

  if (opacity < 0.3) {
    opacity = 0.3;
  } else if (opacity > 1) {
    opacity = 1;
  }

  return 1 - opacity;
}

function getDarknessDrawable(opacity: number, color: string): Drawable {
  const drawable = new Drawable();
  drawable.alwaysDraw();
  drawable.setDrawOrder(950);
  drawable.setDrawFunction((ctx) => {
    const style = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(
      0 - Engine.map.offset[0],
      0 - Engine.map.offset[1],
      Engine.map.width,
      Engine.map.height,
    );
    ctx.globalAlpha = 1;
    ctx.fillStyle = style;
  });

  return drawable;
}

function getCurrentForcedParameters(): { opacity: number; color: string } {
  const forcedParameterForCurrentMap = forcedParameters.get(CURRENT_MAP_ID);
  if (forcedParameterForCurrentMap) {
    return forcedParameterForCurrentMap;
  }

  const forcedDefaultParameter = forcedParameters.get("default");
  if (forcedDefaultParameter) {
    return forcedDefaultParameter;
  }

  return {
    opacity: -1,
    color: "#000",
  };
}

function getCurrentNaturalOpacity(): number {
  if (!isCurrentMapOutdoor()) {
    return 0;
  }

  let opacity = 0;
  if (settings.night) {
    opacity = timeToOpacity(new Date());
  }

  return opacity + opacityChange;
}

function getNightElement(): HTMLElement {
  let nightElement = document.getElementById("nerthus-night");

  if (!nightElement) {
    nightElement = document.createElement("div");
    nightElement.id = "nerthus-night";
    document.getElementById("ground")?.append(nightElement);
  }

  return nightElement;
}

function setNightElementOpacity(opacity: number, color: string): void {
  const nightElement = getNightElement();
  nightElement.style.height = `${map.y * 32}px`;
  nightElement.style.width = `${map.x * 32}px`;
  nightElement.style.zIndex = (map.y * 2 + 12).toString();
  nightElement.style.opacity = opacity.toString();
  nightElement.style.backgroundColor = color;
}

function setNightDrawable(opacity: number, color: string) {
  if (currentDarknessObject) {
    removeDrawableFromRendering(currentDarknessObject);
  }
  currentDarknessObject = getDarknessDrawable(opacity, color);
  addDrawableToRendering(currentDarknessObject);
}

export function setForcedParameters(
  opacity: number,
  color: string,
  mapId: number | "default" = "default",
): void {
  if (!opacity) {
    forcedParameters.delete(mapId);
    return;
  }

  forcedParameters.set(mapId, {
    opacity,
    color,
  });
}

export function changeLight(
  opacity = getCurrentNaturalOpacity(),
  color = "#000",
): void {
  opacity = Math.min(Math.max(0, opacity), 1);

  if (INTERFACE === "NI") {
    setNightDrawable(opacity, color);
  } else {
    setNightElementOpacity(opacity, color);
  }
}

export function applyCurrentNight(): void {
  let opacity = getCurrentNaturalOpacity();
  let color = "#000";

  const currentForcedParameters = getCurrentForcedParameters();
  if (currentForcedParameters.opacity !== -1) {
    opacity = currentForcedParameters.opacity;
    color = currentForcedParameters.color;
  }

  if (opacity <= 0.2) {
    resetLights();
  } else if (opacity > 0.2 && !lightsOn) {
    turnLightsOn();
  }

  changeLight(opacity, color);
}

export function setOpacityChange(newOpacityChange: number): void {
  if (!newOpacityChange) {
    newOpacityChange = 0;
  } else if (newOpacityChange > 1) {
    newOpacityChange = 1;
  } else if (newOpacityChange < -1) {
    newOpacityChange = -1;
  }

  opacityChange = newOpacityChange;
  applyCurrentNight();
}

export function initNightManager(): void {
  loadOnEveryMap(resetLights);
  loadOnEveryMap(applyCurrentNight);

  addSettingToPanel(
    "night",
    "Pory dnia i nocy",
    "Ściemnianie mapy w zależności od pory dnia.",
    applyCurrentNight,
  );
}
