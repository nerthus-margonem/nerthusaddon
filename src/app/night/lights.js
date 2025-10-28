import {
  addDrawableToRendering,
  removeDrawableFromRendering,
} from "../game-integration/loaders";
import { Drawable } from "../npc/Drawable";
import { settings } from "../settings";

const LIGHT_TYPE_SIZES = { S: 64, M: 96, L: 160, XL: 192 };

export let lightsOn = false;

/**
 * Ids of NPCs on NI that hold lights
 * @type {Drawable[]}
 */
const lightDrawables = [];

function getLightTypeUrl(lightType) {
  return FILE_PREFIX + "res/img/night-lights/" + lightType + ".png";
}

/**
 * @param image {CanvasImageSource}
 * @param x {number}
 * @param y {number}
 * @param lightTypeSize {number}
 * @return {Drawable}
 */
function getLightDrawable(image, x, y, lightTypeSize) {
  const rx = (x + lightTypeSize / 2) / 32;
  const ry = (y + lightTypeSize / 2) / 32;

  const drawable = new Drawable();
  drawable.setDrawOrder(1000);
  drawable.setCenter(rx, ry);
  drawable.setDrawFunction((ctx) => {
    ctx.drawImage(image, x - Engine.map.offset[0], y - Engine.map.offset[1]);
  });

  return drawable;
}

export function addSingleLight(lightType, x, y) {
  const lightTypeSize = LIGHT_TYPE_SIZES[lightType];

  if (INTERFACE === "NI") {
    const image = new Image(lightTypeSize, lightTypeSize);
    const lightDrawable = getLightDrawable(image, x, y, lightTypeSize);

    image.onload = () => addDrawableToRendering(lightDrawable);

    image.src = getLightTypeUrl(lightType);
    lightDrawables.push(lightDrawable);
  } else {
    return $('<div class="nerthus__night-light" />')
      .css({
        background: "url(" + getLightTypeUrl(lightType) + ")",
        width: lightTypeSize + "px",
        height: lightTypeSize + "px",
        zIndex: map.y * 2 + 13,
        left: x,
        top: y,
      })
      .attr("type", lightType)
      .appendTo("#ground")
      .css("opacity", "1");
  }
}

export function addLights(lights) {
  if (settings.night) {
    for (const i in lights) {
      addSingleLight(lights[i].type, lights[i].x, lights[i].y);
    }
  }
}

export function resetLights() {
  if (INTERFACE === "NI") {
    for (const drawable of lightDrawables) {
      removeDrawableFromRendering(drawable);
    }
    lightDrawables.splice(0, lightDrawables.length);
  } else {
    $("#ground .nerthus__night-light").remove();
  }

  lightsOn = false;
}

export function turnLightsOn() {
  resetLights();
  if (INTERFACE === "NI" && typeof Engine.map.d.id === "undefined") {
    setTimeout(turnLightsOn, 500);
    return;
  }

  if (AVAILABLE_MAP_FILES.lights.includes(CURRENT_MAP_ID)) {
    $.getJSON(
      FILE_PREFIX + "res/configs/night-lights/" + CURRENT_MAP_ID + ".json",
      addLights,
    );
  } else {
    console.log("lights not loaded - no file");
  }

  lightsOn = true;
}
