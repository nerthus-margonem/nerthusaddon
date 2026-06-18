/**
 *  Thrown to abort loading assets that are no longer relevant.
 *
 *  For example, the player left the map for which the lights were still loading.
 */
export class StaleAssetLoadError extends Error {
  constructor(message = "Asset no longer needed", options?: ErrorOptions) {
    super(message, options);
    this.name = "StaleAssetLoadError";
  }
}
