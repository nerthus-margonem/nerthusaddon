import basicMapsUrls from "../../res/configs/maps.json" with { type: "json" };
import { loadOnEveryMap } from "./game-integration/loaders.js";
import { decodeImage } from "./images.js";
import {
  changeCustomStyle,
  removeCustomStyle,
} from "./interface/css-manager.js";
import { getCurrentSeason, type Season } from "./time.js";
import { resolveUrl } from "./utility-functions.js";

export const MAP_PRIORITY = { CUSTOM: 2, CUSTOM_NO_ID: 1, BASIC: 0 };

export class MapManager {
  readonly #customMapsUrls = new Map();

  #mapChangeId = 0;
  #currentMapImage: CanvasImageSource | undefined = undefined;
  #currentMapImageUrl: string = "";
  #customMapNoIdUrl: string | undefined = undefined;

  readonly #basicMapsUrls: Record<Season | "default", Record<number, string>>;
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
    this.#loadOnEveryMap(() => this.applyCurrentMapChange());
  }

  async applyCurrentMapChange() {
    if (INTERFACE === "NI") {
      await this.#applyMapChange(Engine.map.d.id);
    } else {
      await this.#applyMapChange(map.id);
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
    const season = this.#getCurrentSeason();
    if (this.#basicMapsUrls[season][mapId]) {
      return this.#basicMapsUrls[season][mapId];
    }
    if (this.#basicMapsUrls.default[mapId]) {
      return this.#basicMapsUrls.default[mapId];
    }
    return false;
  }

  async #applyMapChange(mapId: number) {
    const mapChangeId = ++this.#mapChangeId;

    let mapImageUrl = "";

    const basicMapUrl = this.#getBasicMapUrl(mapId);
    if (this.#customMapsUrls.has(mapId)) {
      mapImageUrl = resolveUrl(this.#customMapsUrls.get(mapId));
    } else if (this.#customMapNoIdUrl) {
      mapImageUrl = resolveUrl(this.#customMapNoIdUrl);
    } else if (basicMapUrl) {
      mapImageUrl = resolveUrl(basicMapUrl);
    }

    // Prevent blinking when applying the same map
    if (this.#mapIsAlreadyDisplayed(mapImageUrl)) {
      return;
    }
    this.#discardMapImage(this.#currentMapImage);
    this.#currentMapImage = undefined;
    this.#currentMapImageUrl = "";

    if (INTERFACE === "NI") {
      await this.#loadMapImageNi(mapImageUrl, mapChangeId);
    } else {
      this.#loadMapImageSi(mapImageUrl);
    }
  }

  #mapIsAlreadyDisplayed(mapImageUrl: string): boolean {
    return mapImageUrl !== "" && mapImageUrl === this.#currentMapImageUrl;
  }

  async #loadMapImageNi(
    mapImageUrl: string,
    mapChangeId: number,
  ): Promise<void> {
    if (INTERFACE !== "NI") {
      return;
    }

    if (!mapImageUrl) {
      return;
    }

    const decodedMapImage = await decodeImage(mapImageUrl);

    if (!decodedMapImage || mapChangeId !== this.#mapChangeId) {
      this.#discardMapImage(decodedMapImage);
      return;
    }
    this.#currentMapImage = decodedMapImage;
    this.#currentMapImageUrl = mapImageUrl;
  }

  #loadMapImageSi(mapImageUrl: string): void {
    if (INTERFACE !== "SI") {
      return;
    }

    if (!mapImageUrl) {
      this.#removeCustomStyle("map-background-image");
      return;
    }

    const mapImage = new Image();
    mapImage.src = mapImageUrl;
    this.#currentMapImage = mapImage;
    this.#currentMapImageUrl = mapImageUrl;

    this.#changeCustomStyle(
      "map-background-image",
      `#ground {
          background-image: url(${mapImage.src}) !important; 
          background-color: transparent !important;
      }`.replaceAll(" ", ""),
    );
  }

  #discardMapImage(image: CanvasImageSource | undefined): void {
    if (image instanceof ImageBitmap) {
      image.close();
    }
  }

  #startMapChanging() {
    const tmpMapDrawImage = Engine.map.drawImage;
    Engine.map.drawImage = (...args) => {
      // draw a normal game map
      tmpMapDrawImage.apply(Engine.map, args);

      // draw new maps on top of the game map
      if (this.#currentMapImage) {
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
