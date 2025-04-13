import { settings } from "../../settings";

export const customHiddenNpcs = [];

export function isNpcHidable(npc) {
  if (INTERFACE === "NI") {
    return npc.lvl === 0 || npc.lvl + 13 < Engine.hero.d.lvl;
  } else {
    return npc.lvl === 0 || npc.lvl + 13 < hero.lvl;
  }
}

let hidingStarted = false;

function startHidingNpcs() {
  const oldUpdateNpc =
    Engine.miniMapController.handHeldMiniMapController.updateNpc;
  Engine.miniMapController.handHeldMiniMapController.updateNpc = function (
    npcData,
  ) {
    npcData = npcData.filter((npc) => !customHiddenNpcs.includes(npc.id));
    return oldUpdateNpc.call(
      Engine.miniMapController.handHeldMiniMapController,
      npcData,
    );
  };
}

export function hideGameNpc(id, always) {
  if (INTERFACE === "NI") {
    if (!hidingStarted) {
      hidingStarted = true;
      startHidingNpcs();
    }

    if (always || settings.hideNpcs) {
      if (!customHiddenNpcs.includes(id)) {
        customHiddenNpcs.push(id);
      }

      const callback = function (newNpc) {
        if (newNpc.d && newNpc.d.id === id) {
          // Run only once
          // setTimeout so that it removes itself after all NPCs are checked by API,
          // otherwise it would throw an error
          setTimeout(() => {
            API.removeCallbackFromEvent.bind(API, "newNpc", callback);

            // Remove in this fashion (instead of just calling .delete())
            // because we don't want to unset collisions when hiding.
            //
            // We also need to remove it after the callback is executed
            // to fight race condition as the 'newNpc'
            // event is fired before all the checks and changes
            // for the NPC are made in the game
            API.callEvent("removeNpc", newNpc);
            if (Engine.npcs.getById(newNpc.d.id)) {
              Engine.npcs.removeOne(newNpc.d.id);
            }
            Engine.emotions.removeAllFromSourceId(newNpc.d.id);
          }, 0);
        }
      };
      API.addCallbackToEvent("newNpc", callback);
    }
  } else {
    let $style = $("#nerthus-npc-hiding");
    if (!$style.length) {
      $style = $('<style id="nerthus-npc-hiding"></style>').appendTo("head");
    }

    if (always || settings.hideNpcs) {
      if (!customHiddenNpcs.includes(id)) {
        customHiddenNpcs.push(id);
      }
      $style.append("#npc" + id + "{display: none}");
    }
  }
}
