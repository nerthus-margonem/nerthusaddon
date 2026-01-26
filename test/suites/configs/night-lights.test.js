import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const LIGHTS_DIR = "./res/configs/night-lights";

function checkLight(light) {
  expect(light).to.be.an(typeof {});

  expect(light).to.have.property("x");
  expect(light.x).to.match(/^-?\d+$/);

  expect(light).to.have.property("y");
  expect(light.y).to.match(/^-?\d+$/);

  expect(light).to.have.property("type");
  expect(light.type).to.be.a("string");
}

async function checkFileWithLights(filename) {
  const file = await fs.readFile(path.join(LIGHTS_DIR, filename));
  const lights = JSON.parse(file.toString());
  expect(lights).to.be.an("array");
  lights.forEach((light) => checkLight(light));
}

describe.concurrent("Night lights config files", async function () {
  const files = await fs.readdir(LIGHTS_DIR);
  for (const filename of files) {
    describe("File: " + filename, function () {
      it("should have a correct structure", function () {
        checkFileWithLights(filename);
      });
    });
  }
});
