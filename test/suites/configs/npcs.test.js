import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const NPC_DIR = "./res/configs/npcs";

function checkNpc(npc) {
  try {
    expect(npc).to.be.an(typeof {});

    if (typeof npc.name === "undefined") {
      expect(npc).to.have.property("type");
      expect(npc.type).to.be.a("string");

      expect(npc).to.have.property("id");

      expect(npc).to.have.property("lvl");
      expect(npc.lvl).to.be.a("number");
    } else {
      expect(npc).to.have.property("name");
      expect(npc.name).to.be.a("string");

      expect(npc).to.have.property("x");
      expect(npc.x).to.be.a("number");

      expect(npc).to.have.property("y");
      expect(npc.y).to.be.a("number");

      expect(npc).to.have.property("url");
      expect(npc.url).to.be.a("string");
    }

    if (npc.time)
      expect(npc.time).to.match(/^[0-9]+(:[0-9]+)?-[0-9]+(:[0-9]+)?$/);
    if (npc.days) expect(npc.days).to.be.an("array");
    if (npc.date)
      expect(npc.date).to.match(
        /^[0-9]+(\.[0-9]+){0,2}-[0-9]+(\.[0-9]+){0,2}$/,
      );

    if (npc.dialog) checkDialog(npc.dialog);
  } catch (e) {
    e.message = "npc name " + npc.name + " : " + e.message;
    throw e;
  }
}

function checkDialog(dialog) {
  expect(dialog).to.be.a("object");
  expect(dialog).to.have.property("0");
  for (const i in dialog) {
    checkDialogSet(dialog[i]);
  }
}

function checkDialogSet(dialog) {
  expect(dialog).to.be.an("array");
  expect(dialog.length).to.be.greaterThan(1);
  for (const i in dialog) {
    expect(dialog[i]).to.be.a(typeof "");
    const HAS_GO_TO_ON_END = /(->END|->[0-9]+)$/;
    if (i === "0")
      //nps text
      expect(dialog[i]).to.not.match(HAS_GO_TO_ON_END);
    if (i > 0)
      //answer
      expect(dialog[i]).to.match(HAS_GO_TO_ON_END);
  }
}

async function checkFileWithNpcs(filename) {
  const file = await fs.readFile(path.join(NPC_DIR, filename));
  const npcs = JSON.parse(file.toString());
  expect(npcs).to.be.an("array");
  npcs.forEach((npc) => checkNpc(npc));
}

describe.concurrent("NPCs config files", async function () {
  const files = await fs.readdir(NPC_DIR);
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    describe("File: " + filename, function () {
      it("should have correct structure", function () {
        checkFileWithNpcs(filename);
      });
    });
  }
});
