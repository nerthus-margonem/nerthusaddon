import commonjs from "@rollup/plugin-commonjs";
import yaml from "@rollup/plugin-yaml";
import fs from "node:fs";
import process from "node:process";
import { defineConfig, loadEnv, PluginOption } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

function getVersion() {
  let version;
  try {
    const versionFile = fs.readFileSync("version");
    version = versionFile.toString().trim();
  } catch {
    version = "local";
  }

  return version;
}

function getEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  const DIST_URL = env["DIST_URL"];
  const INTERFACE = env["INTERFACE"];
  const USERSCRIPT_FILENAME =
    env["USERSCRIPT_FILENAME"] ?? "nerthus-addon.user.js";
  const USERSCRIPT_ICON_URL = env["USERSCRIPT_ICON_URL"] ?? "";
  const USERSCRIPT_NAME = env["USERSCRIPT_NAME"] ?? "Nerthus Addon";

  if (!DIST_URL) {
    throw new Error(`DIST_URL env variable is required`);
  }
  if (!INTERFACE) {
    throw new Error(`INTERFACE env variable is required`);
  }

  return {
    DIST_URL,
    INTERFACE,
    USERSCRIPT_FILENAME,
    USERSCRIPT_ICON_URL,
    USERSCRIPT_NAME,
  };
}

export default defineConfig(({ mode }) => {
  const env = getEnv(mode);

  const gameInterface = env["INTERFACE"] || "NI";

  const npc = fs
    .readdirSync("res/configs/npcs")
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => filename.substring(0, filename.length - 5))
    .map((filename) => Number.parseInt(filename));
  const lights = fs
    .readdirSync("res/configs/night-lights")
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => filename.substring(0, filename.length - 5))
    .map((filename) => Number.parseInt(filename));
  const water = fs
    .readdirSync("res/configs/water")
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => filename.substring(0, filename.length - 5))
    .map((filename) => Number.parseInt(filename));

  const filePrefix = env["DIST_URL"].replace("$VERSION", getVersion());

  const plugins: PluginOption[] = [
    yaml() as PluginOption,
    commonjs({ strictRequires: "auto" }) as PluginOption,
  ];

  // While SI also needs the copied resources directory,
  // we don't include the viteStaticCopy here since that would copy it 2 times
  console.error();
  if (gameInterface === "NI") {
    plugins.push(
      ...viteStaticCopy({
        targets: [
          {
            src: "res/*",
            dest: "res",
          },
          {
            src: "LICENSE",
            dest: "",
          },
          {
            src: "src/userscript.js",
            dest: "../dist",
            rename: () => env["USERSCRIPT_FILENAME"],
            transform: (content) =>
              content
                .replace("$USERSCRIPT_NAME", env["USERSCRIPT_NAME"])
                .replace(
                  "$USERSCRIPT_ICON_URL",
                  env["USERSCRIPT_ICON_URL"] ?? "",
                )
                .replace(
                  "NI_VERSION_URL",
                  JSON.stringify(env["DIST_URL"] + "nerthus-addon-NI.js"),
                )
                .replace(
                  "SI_VERSION_URL",
                  JSON.stringify(env["DIST_URL"] + "nerthus-addon-SI.js"),
                ),
          },
        ],
      }),
    );
  }

  let CURRENT_MAP_ID = gameInterface === "NI" ? "Engine.map.d.id" : "map.id";
  if (mode === "test") {
    // Vitest really wants to load the custom `define`s before the environment is set up,
    // so a hardcoded test value needs to be explicitly set up here.
    CURRENT_MAP_ID = "1";
  }

  return {
    build: {
      emptyOutDir: false,
      outDir: "dist",
      minify: "terser",
      terserOptions: {
        ecma: 2020,
        compress: {
          passes: 4,
        },
      },
      lib: {
        entry: "src/main.js",
        name: "main",
        fileName: () =>
          gameInterface === "NI"
            ? "nerthus-addon-NI.js"
            : "nerthus-addon-SI.js",
        formats: ["iife"],
      },
      rollupOptions: {
        treeshake: "smallest",
      },
    },
    define: {
      AVAILABLE_MAP_FILES: { npc, lights, water },
      CURRENT_MAP_ID: CURRENT_MAP_ID,
      FILE_PREFIX: JSON.stringify(filePrefix),
      INTERFACE: JSON.stringify(gameInterface),
      VERSION: JSON.stringify(getVersion()),
    },
    test: {
      environment: "./test/vitest-environment-jquery.js",
    },
    plugins,
  };
});
