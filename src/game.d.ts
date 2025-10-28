/**
 * @file
 * Interfaces that the Margonem game uses.
 *
 * It might not be a 1:1 match with the actual game,
 * since the source code is not available,
 * but it should be enough for our purposes.
 *
 * The addon mostly uses interfaces from this file to type-hint the
 * used methods from the game's code.
 * Without this file, the same structures would need to be used,
 * just without any type-hinting.
 *
 * The interfaces are purposefully not complete,
 * as only the parts used in the addon are described.
 */

/**
 * Interface that the game can take into Engine.renderer.add()
 * Used to render custom objects on the map.
 */
export interface Drawable {
  rx: number;
  ry: number;

  collider?: { box?: [number, number, number, number] };

  getOrder(): number;

  getAlwaysDraw(): boolean;

  draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Engine global variable available in the new interface.
 */
export const Engine: {
  apiData: {
    CALL_DRAW_ADD_TO_RENDERER: "call_draw_add_to_renderer";
  };
  renderer: {
    add(...drawable: Drawable[]): void;
  };
};

/**
 * Engine global variable available in the old interface.
 */
export const g: {};
