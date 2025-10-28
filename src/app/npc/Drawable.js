/** @implements {import("../../game.d.ts").Drawable} */
export class Drawable {
  #drawOrder = 0;
  #alwaysDraw = false;

  alwaysDraw(alwaysDraw = true) {
    this.#alwaysDraw = alwaysDraw;
  }

  /** @param drawOrder {number} */
  setDrawOrder(drawOrder) {
    this.#drawOrder = drawOrder;
  }

  /** @param drawFunction { (ctx: CanvasRenderingContext2D) => void} */
  setDrawFunction(drawFunction) {
    this.draw = drawFunction;
  }

  /**
   * @param rx {number}
   * @param ry {number}
   */
  setCenter(rx, ry) {
    this.rx = rx;
    this.ry = ry;
  }

  getOrder() {
    return this.#drawOrder;
  }

  getAlwaysDraw() {
    return this.#alwaysDraw;
  }
}
