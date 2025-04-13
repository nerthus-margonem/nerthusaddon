import { customNpcs, Npc } from "../npc/npc";
import { addNpc } from "../npc/npc-actions/add";
import { removeNpc } from "../npc/npc-actions/remove";
import { pseudoRandom } from "../utility-functions";

const lightningUrls = [
  "/obrazki/npc/oev/piorun1.gif",
  "/obrazki/npc/oev/piorun2.gif",
  "/obrazki/npc/oev/piorun3.gif",
  //'/obrazki/npc/oev/lightning.gif'
];

const CHUNK_SIZE = 12;
/**
 * 2d table of points where NPCs sit as well as 1 step around them.
 * This is so lightning doesn't strike poor NPCs
 * @type {{}}
 */
let npcZone = {};
const lightningNpcs = [];

function addToZone(x, y) {
  if (x > 0 && !npcZone[x - 1]) {
    npcZone[x - 1] = {};
  }
  if (!npcZone[x]) {
    npcZone[x] = {};
  }
  if (!npcZone[x + 1]) {
    npcZone[x + 1] = {};
  }
  for (let i = -1; i < 1; i++) {
    for (let j = -1; j < 1; j++) {
      if (x + i >= 0) npcZone[x + i][y + j] = true;
    }
  }
}

function fillNpcZone() {
  npcZone = {};
  if (INTERFACE === "NI") {
    for (const npc of Engine.npcs.getDrawableList()) {
      if (npc.d && !isNaN(npc.d.x)) {
        addToZone(npc.d.x, npc.d.y);
      }
    }
  } else {
    for (const id in g.npc) {
      addToZone(g.npc[id].x, g.npc[id].y);
    }
  }

  if (customNpcs[CURRENT_MAP_ID]) {
    for (const npcId in customNpcs[CURRENT_MAP_ID]) {
      addToZone(
        customNpcs[CURRENT_MAP_ID][npcId].x,
        customNpcs[CURRENT_MAP_ID][npcId].y,
      );
    }
  }

  for (const npc of customNpcs.default) {
    addToZone(npc.x, npc.y);
  }
}

function addLightningToChunk(chunkX, chunkY, tries = 0) {
  if (tries > 3) {
    return;
  }

  const minX = chunkX * CHUNK_SIZE;
  const maxX = chunkX * CHUNK_SIZE + CHUNK_SIZE;
  const minY = chunkY * CHUNK_SIZE;
  const maxY = chunkY * CHUNK_SIZE + CHUNK_SIZE;

  const date = new Date();
  date.setMinutes(0, 0, 0);
  const seed =
    Number(date) + (chunkX + 1) * (chunkY + 1) * CURRENT_MAP_ID + tries;

  const x = Math.floor(pseudoRandom(seed) * (maxX + 1 - minX)) + minX;
  const y = Math.floor(pseudoRandom(seed + 1) * (maxY + 1 - minY)) + minY;

  if (npcZone[x] && npcZone[x][y]) {
    addLightningToChunk(chunkX, chunkY, tries + 1);
  } else {
    const imgId = Math.floor(
      pseudoRandom(seed + chunkX + chunkY) * lightningUrls.length,
    );
    lightningNpcs.push(addNpc(new Npc(x, y, lightningUrls[imgId], "", false)));
  }
}

export function clearLightnings() {
  for (const npcData of lightningNpcs) {
    if (INTERFACE === "NI") {
      for (let id in npcData) {
        removeNpc(npcData[id].x, npcData[id].y);
      }
    } else {
      npcData.remove();
    }
  }
  lightningNpcs.splice(0);
}

export function displayLightnings() {
  fillNpcZone();

  let mapChunks = {};
  if (INTERFACE === "NI") {
    mapChunks.x = Math.floor(Engine.map.d.x / CHUNK_SIZE);
    mapChunks.y = Math.floor(Engine.map.d.y / CHUNK_SIZE);
  } else {
    mapChunks.x = Math.floor(map.x / CHUNK_SIZE);
    mapChunks.y = Math.floor(map.y / CHUNK_SIZE);
  }

  for (let i = 0; i < mapChunks.x; i++) {
    for (let j = 0; j < mapChunks.y; j++) {
      addLightningToChunk(i, j);
    }
  }
}
