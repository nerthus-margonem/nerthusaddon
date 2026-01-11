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

declare const INTERFACE: "NI" | "SI";

/**
 * Interface that the game can take into Engine.renderer.add()
 * Used to render custom objects on the map.
 */
declare interface Drawable {
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
declare const Engine: {
  apiData: {
    CALL_DRAW_ADD_TO_RENDERER: "call_draw_add_to_renderer";
  };
  chatController: {
    addMessage(data: {
      authorBusinessCard: {
        getNick(): unknown;
      };
      channel: unknown;
      id: number | undefined;
      receiverBusinessCard: unknown;
      text: string;
      town: boolean;
      ts: number;
      style: string | null;
    }): void;
  };
  communication: {
    dispatcher: {
      on_d(): unknown;
    };
  };
  dialogue: {
    finish(): unknown;
  };
  emotions: {
    removeAllFromSourceId(): unknown;
  };
  floatForegroundManager: {
    updateData(): unknown;
  };
  globalAddons: {
    setVisibleOfTurnOnOffAddonButton(): unknown;
  };
  hero: {
    createStrTip(): unknown;
    d: {
      lvl: number;
      nick: string;
    };
    updateCollider(): unknown;
  };
  interface: {
    afterUnlock(): unknown;
  };
  interfaceStart: boolean;
  items: {
    getItemById(): unknown;
  };
  lock: {
    add(): unknown;
    remove(): unknown;
  };
  map: {
    col: {
      check(): unknown;
      set(): unknown;
      setStaticColsCache(): unknown;
      unset(): unknown;
    };
    d: {
      id: number;
      x: unknown;
      y: unknown;
    };
    drawImage(ctx: CanvasRenderingContext2D): unknown;
    gateways: {
      townnames: unknown;
    };
    height: number;
    hideLoaderSplash(): unknown;
    offset: [number, number];
    water: unknown;
    width: number;
  };
  miniMapController: {
    handHeldMiniMapController: {
      updateNpc(): unknown;
    };
  };
  npcIconManager: {
    updateData(): unknown;
  };
  npcTplManager: {
    updateData(): unknown;
  };
  npcs: {
    check(): unknown;
    getById(): unknown;
    getDrawableList(): unknown;
    getTip(): unknown;
    removeONe(): unknown;
    updateData(): unknown;
  };
  others: {
    getDrawableList(): unknown;
  };
  renderer: {
    add(...drawable: Drawable[]): void;
  };
  serverStorage: {
    get(): unknown;
  };
  weather: {
    createObjects(): unknown;
    mapSize: unknown;
    onClear(): unknown;
    setMapSize(): unknown;
  };
  widgetManager: {
    addKeyToDefaultWidgetSet(): unknown;
    createOneWidget(): unknown;
    findPositionToWidgetsWithoutFreeSlot(): unknown;
    getDefaultWidgetSet(): unknown;
    getPathToHotWidgetVersion(): unknown;
    setEnableDraggingButtonsWidget(): unknown;
  };
};

/**
 * Engine global variable available in the old interface.
 */
declare const g: {
  chatController: {
    addMessage(): unknown;
  };
};
declare const map: {
  id: number;
};
