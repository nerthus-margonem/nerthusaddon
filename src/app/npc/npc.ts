import { mapBoundAssetLoader } from "../assets/map-bound-asset-loader.js";
import { loadOnEveryMap } from "../game-integration/loaders.js";
import { addSettingToPanel } from "../interface/panel.js";
import { coordsToId, resolveUrl } from "../utility-functions.js";
import { initNpcDialog } from "./dialog.js";
import { addNpc } from "./npc-actions/add.js";
import { changeGameNpc } from "./npc-actions/change.js";
import {
  customHiddenNpcs,
  hideGameNpc,
  isNpcHidable,
} from "./npc-actions/hide.js";
import { isNpcDeployable } from "./npc-time.js";
import { NpcConfig } from "./types/npc-config.js";

export const customNpcs: Record<number | "default", Record<number, Npc>> = {
  default: {},
};

export class Npc {
  id: number;
  x: number;
  y: number;
  nick: string;
  type: NpcType;
  icon: string;
  collision: boolean;
  dialog: unknown;
  wt: 1 | 0;
  actions = 0;
  grp = 0;

  constructor(
    x: number,
    y: number,
    url: string,
    nick: string,
    collision?: boolean,
    dialog?: unknown,
    type?: NpcType,
  ) {
    this.x = x;
    this.y = y;
    this.id = coordsToId(this.x, this.y);

    this.nick = nick;
    type ??= this.nick === "" ? 4 : 0;
    this.type = type;

    this.icon = resolveUrl(url);
    this.wt = this.type === 4 ? 1 : 0;

    this.collision = !!collision;
    this.dialog = dialog;
  }

  update = (): void => {};
}

function deploy(npc: NpcConfig) {
  if (!isNpcDeployable(npc)) return 1;
  switch (npc.type) {
    case "delete": {
      if (!isNpcHidable(npc)) {
        return;
      }
      return hideGameNpc(npc.id, npc.lvl === 0);
    }
    case "change": {
      return changeGameNpc(npc);
    }
    default: {
      const tip = npc.tip ?? npc.name;

      const customNpc = new Npc(
        npc.x,
        npc.y,
        npc.url,
        tip,
        npc.collision,
        npc.dialog,
        npc.npcType,
      );
      return addNpc(customNpc);
    }
  }
}

export async function loadNpcsFromUrl(url: string): Promise<void> {
  const npcs = await mapBoundAssetLoader.loadJsonAsset<NpcConfig[]>(url);
  if (!npcs) {
    return;
  }

  for (const npc of npcs) {
    deploy(npc);
  }
}

function loadNpcs() {
  const mapId = INTERFACE === "NI" ? Engine.map.d.id : map.id;

  if (AVAILABLE_MAP_FILES.npc.includes(mapId)) {
    void loadNpcsFromUrl(FILE_PREFIX + "res/configs/npcs/" + mapId + ".json");
  }

  for (const npc of Object.values(customNpcs[mapId] ?? {})) {
    addNpc(npc);
  }
  for (const npc of Object.values(customNpcs.default)) {
    addNpc(npc);
  }
}

function handleChangedNpcsOnMinimap() {
  if (INTERFACE === "NI") {
    const oldCreateNpcIcon = window.createNpcIcon;
    window.createNpcIcon = function (...args) {
      // Replace urls with custom sufix to be only that sufix,
      // so that the minimap will show the correct image
      if (args[2].includes("?nerthus-icon=")) {
        args[2] = args[2].replace(/^.*?nerthus-icon=/, "");
      }
      return oldCreateNpcIcon.apply(window, args);
    };
  }
}

export function initNpcManager() {
  initNpcDialog();
  handleChangedNpcsOnMinimap();

  loadOnEveryMap(function () {
    if (INTERFACE === "SI") {
      $(".nerthus-npc").remove();

      // fixes strange reference error in SI engine
      if (window.groupId === undefined) {
        window.groupId = null;
      }
    }
    loadNpcs();
    for (const npcToHide of customHiddenNpcs) {
      hideGameNpc(npcToHide);
    }
  });

  addSettingToPanel(
    "hideNpcs",
    "Ukrywanie NPCów",
    "Ukrywa NPCów ustawionych przez dodatek oraz przez specjalną komendę dostępną dla narratorów. (wymaga resetu gry)",
    function () {
      // TODO
    },
  );
}
