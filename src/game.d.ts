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
declare interface Drawable {
  rx: number;
  ry: number;

  collider?: { box?: [number, number, number, number] };

  getOrder(): number;

  getAlwaysDraw(): boolean;

  draw(ctx: CanvasRenderingContext2D): void;
}

declare interface BusinessCard {
  getNick(): string;
  getAcc(): unknown;
}

declare interface ChatMessageData {
  authorBusinessCard: BusinessCard;
  channel:
    | "GENERAL"
    | "GLOBAL"
    | "LOCAL"
    | "TRADE"
    | "GROUP"
    | "CLAN"
    | "SYSTEM"
    | "PRIVATE"
    | "COMMERCIAL";
  id: number | undefined;
  receiverBusinessCard: BusinessCard;
  text: string;
  town: boolean;
  ts: number;
  style: string | null;

  /** Nerthus-specific addition to track authors of messages without authorBusinessCard */
  nick?: string;
  /** Nerthus-specific addition to track a specific message tip */
  tip?: string;
}

/**
 * NPC type used by the game.
 * - `0`: NPC with a tooltip and a collision
 * - `1`: NPC you can fight
 * - `2`: unknown
 * - `3`: unknown
 * - `4`: Background object without tooltip
 * - `5`: Object with a tooltip, but possibly shifted by -16px if !(width % 64); tagged by game as a "machine"
 * - `6`: unknown
 * - `7`: Renewable resources on the map
 * - `9`: unknown
 */
declare type NpcType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9;

/**
 * Engine global variable available in the new interface.
 */
declare const Engine: {
  apiData: {
    CALL_DRAW_ADD_TO_RENDERER: "call_draw_add_to_renderer";
  };
  chatController: {
    addMessage(data: ChatMessageData): void;
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
    add(key: string): void;
    remove(key: string): void;
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
      x: number;
      y: number;
    };
    drawImage(ctx: CanvasRenderingContext2D): unknown;
    gateways: {
      townnames: unknown;
    };
    height: number;
    hideLoaderSplash(): unknown;
    offset: [number, number];
    water: Partial<Record<number, number>>;
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
    getById(id: number): unknown;
    getDrawableList(): unknown;
    getTip(): unknown;
    removeONe(): unknown;
    updateData(): unknown;
  };
  others: {
    getDrawableList(): unknown;
    otherTipRefresh(): unknown;
  };
  renderer: {
    add(...drawable: Drawable[]): void;
  };
  serverStorage: {
    get(): unknown;
  };
  weather: {
    createObjects(objectName: string, data: object): void;
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
 * API global variable available in the new interface.
 */
declare const API: {
  addCallbackToEvent(eventName: string, callback: () => unknown): unknown;
  removeCallbackFromEvent(eventName: string, callback: () => unknown): unknown;
  callEvent(eventName: string, data: unknown): unknown;
};
declare var createNpcIcon: (a: unknown, b: unknown, url: string) => string;

/**
 * Engine global variable available in the old interface.
 */
declare const g: {
  chatController: {
    addMessage(data: ChatMessageData): void;
  };
  lock: {
    add(key: string): void;
    remove(key: string): void;
  };
  settingsOptions: {
    isMouseHeroWalkOn(): boolean;
  };
  settingsStorage: {
    sendRequest(id: number, key: unknown, value: boolean): void;
  };
  npc: Partial<
    Record<
      number,
      {
        actions: number;
        fh: number;
        fw: number;
        grp: 0;
        icon: string;
        id: number;
        imgStatus: true;
        imgload: () => void;
        isIconInvisible: true;
        lvl: number;
        nick: string;
        srajId: number;
        tpl: number;
        type: number;
        wt: number;
        x: number;
        y: number;
      }
    >
  >;
};
declare const map: {
  id: number;
  x: number;
  y: number;
  water: Partial<Record<number, number>>;
};
declare const hero: {
  x: number;
  y: number;
};
declare const clearWeather: () => void;
declare const changeWeather: (weatherName: string) => void;

/**
 * There is a bug in the SI engine that leaves `groupId` as a global variable.
 * it needs to be set to `null` if it's `undefined` before adding any NPCs to not cause problems.
 */
declare var groupId: number | null | undefined;

/**
 * Global variables available on both interfaces.
 */
declare const log: (message: string) => void;
declare const _g: (task: string, callback?: unknown, payload?: unknown) => void;
