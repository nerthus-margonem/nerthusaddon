import { decodeGifFromUrl } from "../decodeGif";
import {
  addDrawableToRendering,
  removeDrawableFromRendering,
} from "../game-integration/loaders";
import { Drawable } from "../npc/Drawable";
import { clearLightnings } from "./lightnings";

const rainEffect = {
  url: FILE_PREFIX + "res/img/weather/rain.gif",
  frames: {
    width: 0,
    height: 0,
    frameData: [],
  },
  frameTime: 120,
  cache: [],
  cacheMapId: -1,
  opacity: 1,
};
const snowEffect = {
  url: FILE_PREFIX + "res/img/weather/snow.gif",
  frames: {
    width: 0,
    height: 0,
    frameData: [],
  },
  frameTime: 400,
  cache: [],
  cacheMapId: -1,
  opacity: 1,
};

rainEffect.drawable = getWeatherDrawable(rainEffect);
snowEffect.drawable = getWeatherDrawable(snowEffect);

async function cacheWeatherCanvas(effect, force = false) {
  if (INTERFACE === "SI") {
    return true;
  }
  if (!force && effect.cacheMapId === Engine.map.d.id) {
    return true;
  }

  effect.cacheMapId = Engine.map.d.id;
  effect.cache = [];

  if (!effect.frames.frameData.length) {
    try {
      effect.frames = await decodeGifFromUrl(effect.url);
      // Variable frame time is not supported yet.
      // Frame delay value is 10 times lower than frame time ms
      effect.frameTime = effect.frames.frameDelays[0] * 10;
    } catch (err) {
      console.error(
        "Error decoding GIF from url while caching weather canvas: ",
        err,
      );
      return false;
    }
  }
  for (const frameData of effect.frames.frameData) {
    const canvas = document.createElement("canvas");
    // Caching can happen before Engine.map.width and Engine.map.height are calculated,
    // but Engine.map.d will always be present
    canvas.width = Engine.map.d.x * 32;
    canvas.height = Engine.map.d.y * 32;
    const ctx = canvas.getContext("2d");

    const imgData = new ImageData(
      frameData,
      effect.frames.width,
      effect.frames.height,
    );
    const imgCanvas = document.createElement("canvas");
    imgCanvas.width = effect.frames.width;
    imgCanvas.height = effect.frames.height;
    const imgCtx = imgCanvas.getContext("2d");
    imgCtx.putImageData(imgData, 0, 0);

    ctx.fillStyle = ctx.createPattern(imgCanvas, "repeat");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    effect.cache.push(canvas);
  }
  return true;
}

function getWeatherDrawable(effect) {
  const drawable = new Drawable();
  drawable.alwaysDraw();
  drawable.setDrawOrder(930);
  drawable.setDrawFunction((ctx) => {
    const cachedCanvas =
      effect.cache[
        Math.floor(Date.now() / effect.frameTime) %
          effect.frames.frameData.length
      ];
    if (!cachedCanvas) {
      return;
    }
    const alpha = ctx.globalAlpha;
    ctx.globalAlpha = effect.opacity;
    ctx.drawImage(
      cachedCanvas,
      Math.floor(-Engine.map.offset[0]),
      Math.floor(-Engine.map.offset[1]),
    );
    ctx.globalAlpha = alpha;
  });

  return drawable;
}

export function clearEffects(clearGameEffects) {
  if (INTERFACE === "NI") {
    removeDrawableFromRendering(rainEffect.drawable);
    removeDrawableFromRendering(snowEffect.drawable);
    if (clearGameEffects) {
      Engine.weather.onClear();
    }
  } else {
    $(".nerthus-weather").remove();
    if (clearGameEffects) {
      window.clearWeather();
    }
  }
  clearLightnings();
}

export function displayRain(opacity = 1) {
  rainEffect.opacity = opacity;
  if (INTERFACE === "NI") {
    cacheWeatherCanvas(rainEffect);
    // We can't wait for caching to add the object,
    // because it can be removed by the next chat command
    // parsed when entering the map with existing commands
    addDrawableToRendering(rainEffect.drawable);
  } else {
    $('<div class="nerthus-weather"/>')
      .css({
        backgroundImage: `url(${rainEffect.url})`,
        zIndex: map.y * 2 + 10,
        opacity: opacity,
      })
      .appendTo("#ground");
  }
}

export function displaySnow(opacity = 1) {
  snowEffect.opacity = opacity;
  if (INTERFACE === "NI") {
    cacheWeatherCanvas(snowEffect);
    // We can't wait for caching to add the object,
    // because it can be removed by the next chat command
    // parsed when entering the map with existing commands
    addDrawableToRendering(snowEffect.drawable);
  } else {
    $('<div class="nerthus-weather"/>')
      .css({
        backgroundImage: `url(${snowEffect.url})`,
        zIndex: map.y * 2 + 10,
        opacity: opacity,
      })
      .appendTo("#ground");
  }
}

export function displayGameWeather(name) {
  if (INTERFACE === "NI") {
    const uppercaseWeatherName = name.charAt(0).toUpperCase() + name.slice(1);

    Engine.weather.setMapSize();
    if (Engine.weather.mapSize) {
      Engine.weather.createObjects(uppercaseWeatherName, {});
    }
  } else {
    window.changeWeather(name);
  }
}
