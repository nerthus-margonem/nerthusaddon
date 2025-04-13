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
    global.window = jsdom.window;
    global.Image = jsdom.window.Image;
    global.$ = global.jQuery = jQuery(window);

    return {
      teardown() {
        window.close();
      },
    };
  },
};
