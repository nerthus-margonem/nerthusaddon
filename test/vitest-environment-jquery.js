import jQuery from "jquery";
import { JSDOM } from "jsdom";

export default {
  name: "jquery",
  transformMode: "ssr",
  async setup() {
    const testHTML = `
        <!DOCTYPE html>
        <html>
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

    return {
      teardown() {
        window.close();
      },
    };
  },
};
