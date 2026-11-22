import { callEvent } from "../../API";
import { coordsToId } from "../../utility-functions";
import { customNpcs } from "../npc.js";
import { removeCollision } from "./collision";

export function removeNpc(x, y, mapId) {
  if (customNpcs[mapId]?.[coordsToId(x, y)]) {
    delete customNpcs[mapId][coordsToId(x, y)];
  }

  if (INTERFACE === "NI") {
    if (
      mapId === undefined ||
      mapId === "default" ||
      mapId === Engine.map.d.id
    ) {
      const id = coordsToId(x, y);
      const npc = Engine.npcs.getById(id);
      if (npc) {
        // fix for when npc is somehow loaded without collision
        if (!npc.mapColSet) npc.mapColSet = [npc.d.x, npc.d.y];

        npc.delete();
        Engine.map.col.setStaticColsCache();
      }
    }
    if (mapId === "default" || mapId === Engine.map.d.id) {
      removeCollision(x, y);
    }
  } else {
    if (mapId === undefined || mapId === "default" || mapId === map.id) {
      document.querySelector(`#npc${coordsToId(x, y)}`)?.remove();
    }
    if (mapId === "default" || mapId === map.id) {
      removeCollision(x, y);
    }
  }
  callEvent("removeTemporaryNpc", { x: x, y: y, mapId: mapId });
}
