import basicMapsUrls from "../../res/configs/maps.json" with { type: "json" };
import { loadOnEveryMap } from "./game-integration/loaders.js";
import {
  changeCustomStyle,
  removeCustomStyle,
} from "./interface/css-manager.js";
import { getCurrentSeason } from "./time.js";
import { resolveUrl } from "./utility-functions.js";

export const MAP_PRIORITY = { CUSTOM: 2, CUSTOM_NO_ID: 1, BASIC: 0 };

export class MapManager {
  readonly #currentMapImage = new Image();
  readonly #customMapsUrls = new Map();

  #customMapNoIdUrl: string | undefined = undefined;

  readonly #basicMapsUrls: Record<
    "spring" | "summer" | "autumn" | "winter" | "default",
    Record<number, string>
  >;
  readonly #loadOnEveryMap: typeof loadOnEveryMap;
  readonly #changeCustomStyle: typeof changeCustomStyle;
  readonly #removeCustomStyle: typeof removeCustomStyle;
  readonly #getCurrentSeason: typeof getCurrentSeason;

  constructor(
    _basicMapsUrls: typeof basicMapsUrls,
    _loadOnEveryMap: typeof loadOnEveryMap,
    _changeCustomStyle: typeof changeCustomStyle,
    _removeCustomStyle: typeof removeCustomStyle,
    _getCurrentSeason: typeof getCurrentSeason,
  ) {
    this.#basicMapsUrls = _basicMapsUrls;
    this.#loadOnEveryMap = _loadOnEveryMap;
    this.#changeCustomStyle = _changeCustomStyle;
    this.#removeCustomStyle = _removeCustomStyle;
    this.#getCurrentSeason = _getCurrentSeason;
  }

  init() {
    if (INTERFACE === "NI") {
      this.#startMapChanging();
    }
    this.#loadOnEveryMap(() => this.applyCurrentMapChange(), undefined);
  }

  applyCurrentMapChange() {
    if (INTERFACE === "NI") {
      this.#applyMapChange(Engine.map.d.id);
    } else {
      this.#applyMapChange(map.id);
    }
  }

  addToMapChangelist(url: string, priority: number, mapId?: number) {
    switch (priority) {
      case MAP_PRIORITY.CUSTOM:
        this.#customMapsUrls.set(mapId, url);
        return;
      case MAP_PRIORITY.CUSTOM_NO_ID:
        this.#customMapNoIdUrl = url;
        return;
    }
  }

  removeFromMapChangelist(mapId: number, priority: number) {
    switch (priority) {
      case MAP_PRIORITY.CUSTOM:
        this.#customMapsUrls.delete(mapId);
        return;
      case MAP_PRIORITY.CUSTOM_NO_ID:
        this.#customMapNoIdUrl = undefined;
        return;
    }
  }

  #getBasicMapUrl(mapId: number) {
    const season: "spring" | "summer" | "autumn" | "winter" =
      this.#getCurrentSeason();
    if (this.#basicMapsUrls[season][mapId]) {
      return this.#basicMapsUrls[season][mapId];
    }
    if (this.#basicMapsUrls.default[mapId]) {
      return this.#basicMapsUrls.default[mapId];
    }
    return false;
  }

  #applyMapChange(mapId: number) {
    const mapImage = new Image();

    const basicMapUrl = this.#getBasicMapUrl(mapId);
    if (this.#customMapsUrls.has(mapId)) {
      mapImage.src = resolveUrl(this.#customMapsUrls.get(mapId));
    } else if (this.#customMapNoIdUrl) {
      mapImage.src = resolveUrl(this.#customMapNoIdUrl);
    } else if (basicMapUrl) {
      mapImage.src = resolveUrl(basicMapUrl);
    }

    this.#currentMapImage.src = mapImage.src;

    if (INTERFACE === "SI") {
      // this way it's more robust than simply changing an elements style
      if (mapImage.src) {
        this.#changeCustomStyle(
          "map-background-image",
          `#ground {
            background-image: url(${mapImage.src}) !important; 
            background-color: transparent !important;
        }`.replaceAll(" ", ""),
        );
      } else {
        this.#removeCustomStyle("map-background-image");
      }
    }
  }

  #startMapChanging() {
    const tmpMapDrawImage = Engine.map.drawImage;
    Engine.map.drawImage = (...args) => {
      // draw a normal game map
      tmpMapDrawImage.apply(Engine.map, args);

      // draw new maps on top of the game map
      if (
        this.#currentMapImage.complete &&
        this.#currentMapImage.naturalWidth !== 0
      ) {
        args[0].drawImage(
          this.#currentMapImage,
          0 - Engine.map.offset[0],
          0 - Engine.map.offset[1],
        );
      }
    };
  }
}

export const mapManager = new MapManager(
  basicMapsUrls,
  loadOnEveryMap,
  changeCustomStyle,
  removeCustomStyle,
  getCurrentSeason,
);
