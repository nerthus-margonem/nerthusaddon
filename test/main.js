import jQuery from "jquery";
import { JSDOM } from "jsdom";

function init() {
  const testHTML = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <title>Nerthus addon</title>
        </head>
        <body>
            <div></div>
        </body>
        </html>
    `;
  const jsdom = new JSDOM(testHTML);

  // Set window and document from jsdom
  const { window } = jsdom;
  const { document } = window;

  // Also set a global window and document before requiring jQuery
  global.window = window;
  global.document = document;

  global.$ = global.jQuery = jQuery;

  global.Image = function () {
    this.src = "";
  };
  global.resetWindow = init;
}

init();

const context = import.meta.webpackContext("./suites/configs", {
  recursive: true,
  regExp: /\.js$/,
});
context.keys().forEach(context);
