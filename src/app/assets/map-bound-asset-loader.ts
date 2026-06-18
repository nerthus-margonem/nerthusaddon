import { StaleAssetLoadError } from "./stale-asset-load-error.js";

export class MapBoundAssetLoader {
  #staleAssetLoadAbortController = new AbortController();
  readonly #getCurrentMapId: () => number;

  constructor(getCurrentMapId: () => number) {
    this.#getCurrentMapId = getCurrentMapId;
  }

  async loadJsonAsset<T = unknown>(url: string): Promise<undefined | T> {
    const mapId = this.#getCurrentMapId();

    try {
      const response = await fetch(url, {
        signal: this.#staleAssetLoadAbortController.signal,
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        console.error(`Failed to load asset from ${url}`, response);
        return;
      }

      const asset = (await response.json()) as T;

      if (mapId !== this.#getCurrentMapId()) {
        return;
      }
      return asset;
    } catch (error) {
      if (error instanceof StaleAssetLoadError) {
        console.info(`Discarding stale asset from ${url}`);
        return;
      }
      throw error;
    }
  }

  reset(): void {
    this.#staleAssetLoadAbortController.abort(new StaleAssetLoadError());
    this.#staleAssetLoadAbortController = new AbortController();
  }
}

export const mapBoundAssetLoader = new MapBoundAssetLoader(
  () => CURRENT_MAP_ID,
);
