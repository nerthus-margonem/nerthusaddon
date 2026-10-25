import { decodeGifFromUrl } from "../decodeGif";
import {
  addDrawableToRendering,
  removeDrawableFromRendering,
} from "../game-integration/loaders";
import { Drawable } from "../npc/Drawable";
import { clearLightnings } from "./lightnings";

interface WeatherEffect {
  url: string;
  patterns: CanvasPattern[];
  frameTime: number;
  opacity: number;
  drawable?: Drawable;
  cached: boolean;
}

const rainEffect: WeatherEffect = {
  url: FILE_PREFIX + "res/img/weather/rain.gif",
  patterns: [],
  frameTime: 120,
  opacity: 1,
  cached: false,
};
const snowEffect: WeatherEffect = {
  url: FILE_PREFIX + "res/img/weather/snow.gif",
  patterns: [],
  frameTime: 400,
  opacity: 1,
  cached: false,
};

rainEffect.drawable = getWeatherDrawable(rainEffect);
snowEffect.drawable = getWeatherDrawable(snowEffect);

async function cacheWeather(effect: WeatherEffect): Promise<void> {
  if (INTERFACE === "SI") {
    return;
  }
  if (effect.cached) {
    return;
  }
  effect.cached = true;

  try {
    const decodedGif = await decodeGifFromUrl(effect.url);
    if (!decodedGif.frameDelays[0]) {
      console.error("Decoded GIF has 0 frames or 0 frame time");
      effect.cached = false;
      return;
    }

    // Variable frame time is not supported.
    // Frame delay value is 10 times lower than frame time ms
    effect.frameTime = decodedGif.frameDelays[0] * 10;

    const imgCanvas = document.createElement("canvas");
    imgCanvas.width = decodedGif.width;
    imgCanvas.height = decodedGif.height;
    const imgCtx = imgCanvas.getContext("2d")!;
    for (const frameData of decodedGif.frameData) {
      const imgData = new ImageData(
        frameData,
        decodedGif.width,
        decodedGif.height,
      );
      imgCtx.putImageData(imgData, 0, 0);

      const pattern = imgCtx.createPattern(imgCanvas, "repeat")!;

      effect.patterns.push(pattern);
    }
  } catch (err) {
    console.error("Error caching weather patterns: ", err);
    effect.patterns = [];
    effect.cached = false;
  }
}

function getWeatherDrawable(effect: WeatherEffect) {
  const drawable = new Drawable();
  drawable.alwaysDraw();
  drawable.setDrawOrder(930);

  drawable.setDrawFunction((ctx) => {
    if (!effect.patterns.length) {
      return;
    }
    const frame =
      Math.floor(Date.now() / effect.frameTime) % effect.patterns.length;
    const pattern = effect.patterns[frame]!;

    const x = Math.floor(-Engine.map.offset[0]);
    const y = Math.floor(-Engine.map.offset[1]);
    pattern.setTransform({
      e: x,
      f: y,
    });

    const alpha = ctx.globalAlpha;
    const fillStyle = ctx.fillStyle;
    ctx.globalAlpha = effect.opacity;
    ctx.fillStyle = pattern;
    ctx.fillRect(x, y, Engine.map.width, Engine.map.height);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;
  });

  return drawable;
}

export function clearEffects(clearGameEffects = false) {
  if (INTERFACE === "NI") {
    removeDrawableFromRendering(rainEffect.drawable);
    removeDrawableFromRendering(snowEffect.drawable);
    if (clearGameEffects) {
      Engine.weather.onClear();
    }
  } else {
    $(".nerthus-weather").remove();
    if (clearGameEffects) {
      clearWeather();
    }
  }
  clearLightnings();
}

export function displayRain(opacity = 1) {
  rainEffect.opacity = opacity;
  if (INTERFACE === "NI") {
    void cacheWeather(rainEffect);
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
    void cacheWeather(snowEffect);
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

export function displayGameWeather(name: string) {
  if (INTERFACE === "NI") {
    const uppercaseWeatherName = name.charAt(0).toUpperCase() + name.slice(1);

    Engine.weather.setMapSize();
    if (Engine.weather.mapSize) {
      Engine.weather.createObjects(uppercaseWeatherName, {});
    }
  } else {
    changeWeather(name);
  }
}
