import jQuery from "jquery";
import { JSDOM } from "jsdom";

export default {
  name: "jquery",
  viteEnvironment: "ssr",
  async setup() {
    const testHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title></title>
        </head>
        <body></body>
        </html>
        `;
    const jsdom = new JSDOM(testHTML);
    globalThis.window = jsdom.window;
    globalThis.Image = jsdom.window.Image;
    globalThis.$ = globalThis.jQuery = jQuery(window);

    globalThis.FILE_PREFIX = "";
    globalThis.INTERFACE = "SI";

    /* SI global variables */
    globalThis.map = { id: 1 };

    return {
      teardown() {
        window.close();
      },
    };
  },
};
