import CopyPlugin from "copy-webpack-plugin";
import yaml from "js-yaml";
import fs from "node:fs";
import * as path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getVersion() {
  let version = "local";
  try {
    const versionFile = fs.readFileSync("version");
    version = versionFile.toString().trim();
  } catch {
    // defaulting to 'local'
  }

  return version;
}

const CONSTANTS = new webpack.DefinePlugin({
  FILE_PREFIX: webpack.DefinePlugin.runtimeValue(
    () => {
      return JSON.stringify(
        process.env.DIST_URL.replace("$VERSION", getVersion()),
      );
    },
    {
      fileDependencies: [path.resolve(__dirname, "version")],
    },
  ),
  VERSION: webpack.DefinePlugin.runtimeValue(
    () => {
      return JSON.stringify(getVersion());
    },
    {
      fileDependencies: [path.resolve(__dirname, "version")],
    },
  ),
  AVAILABLE_MAP_FILES: webpack.DefinePlugin.runtimeValue(
    () => {
      const npc = fs
        .readdirSync("res/configs/npcs")
        .filter((filename) => filename.endsWith(".json"))
        .map((filename) => filename.substring(0, filename.length - 5))
        .map((filename) => parseInt(filename));
      const lights = fs
        .readdirSync("res/configs/night-lights")
        .filter((filename) => filename.endsWith(".json"))
        .map((filename) => filename.substring(0, filename.length - 5))
        .map((filename) => parseInt(filename));
      const water = fs
        .readdirSync("res/configs/water")
        .filter((filename) => filename.endsWith(".json"))
        .map((filename) => filename.substring(0, filename.length - 5))
        .map((filename) => parseInt(filename));

      return JSON.stringify({ npc, lights, water });
    },
    {
      contextDependencies: [
        path.resolve(__dirname, "res/configs/npcs/"),
        path.resolve(__dirname, "res/configs/night-lights/"),
      ],
    },
  ),
});

const rules = [
  {
    test: /\.m?js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-transform-runtime"],
      },
    },
  },
  {
    test: /\.yaml$/i,
    type: "json",
    parser: {
      parse: yaml.load,
    },
  },
];

/**
 * Plugin that allows for changing every occurrence of given string to different string.
 * It differs from `webpack.DefinePlugin` in that it also changes strings inside comments.
 *
 * This is used to populate userscript header with options from .env
 */
class ReplaceTextPlugin {
  #definitions = {};

  constructor(definitions) {
    this.#definitions = definitions;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("ReplaceTextPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "ReplaceTextPlugin",
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          for (const [assetName, asset] of Object.entries(compilation.assets)) {
            const original = asset.source();
            let replaced = original;
            for (const [from, to] of Object.entries(this.#definitions)) {
              replaced = replaced.replaceAll(from, to);
            }
            if (replaced !== original) {
              compilation.assets[assetName] = new webpack.sources.RawSource(
                replaced,
              );
            }
          }
        },
      );
    });
  }
}

function getUserscriptConfig() {
  if (!process.env.USERSCRIPT_NAME) {
    // If no name is provided, don't build the userscript
    return undefined;
  }

  return {
    name: "Userscript",
    mode: "none",
    entry: "./src/userscript.js",
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: process.env.USERSCRIPT_FILENAME,
      module: true,
    },
    experiments: {
      outputModule: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        NI_VERSION_URL: JSON.stringify(
          process.env.DIST_URL + "nerthus-addon-NI.js",
        ),
        SI_VERSION_URL: JSON.stringify(
          process.env.DIST_URL + "nerthus-addon-SI.js",
        ),
      }),
      new ReplaceTextPlugin({
        $USERSCRIPT_NAME: process.env.USERSCRIPT_NAME,
        $USERSCRIPT_ICON_URL: process.env.USERSCRIPT_ICON_URL,
      }),
    ],
  };
}

export default [
  getUserscriptConfig(),
  {
    name: "NI-production",
    mode: process.env.NODE_ENV,
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: "nerthus-addon-NI.js",
    },
    plugins: [
      CONSTANTS,
      new webpack.DefinePlugin({
        INTERFACE: JSON.stringify("NI"),
        CURRENT_MAP_ID: "Engine.map.d.id",
      }),
      new CopyPlugin({
        patterns: [{ from: "res", to: "res" }, "LICENSE"],
      }),
    ],
    module: {
      rules,
    },
  },
  {
    name: "SI-production",
    mode: process.env.NODE_ENV,
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: "nerthus-addon-SI.js",
    },
    plugins: [
      CONSTANTS,
      new webpack.DefinePlugin({
        INTERFACE: JSON.stringify("SI"),
        CURRENT_MAP_ID: "map.id",
      }),
      // While SI also needs the copied resources directory,
      // we don't include the CopyPlugin here since that would copy it 2 times
    ],
    module: {
      rules,
    },
  },
].filter((config) => config);
