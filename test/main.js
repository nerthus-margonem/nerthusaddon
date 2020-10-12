function init()
{
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
    const { JSDOM } = require( 'jsdom' );
    const jsdom = new JSDOM( testHTML );

    // Set window and document from jsdom
    const { window } = jsdom;
    const { document } = window;

    // Also set global window and document before requiring jQuery
    global.window = window;
    global.document = document;

    global.$ = global.jQuery = require( 'jquery' );


    global.Image = function () {this.src = ''}
    global.navigator = {userAgent: 'node.js'}
    global.resetWindow = init
}

init()

context = require.context('./suites', true, /\.js$/)
context.keys().forEach(context)
