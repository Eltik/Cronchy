var KEYS = require('./keys')

var defaultHtml = '<!doctype html><html><head><meta charset="utf-8">' +
  '</head><body></body></html>'

function globalJSDOM(html, options) {
    if (!html) {
        html = defaultHtml
    }

    if (options === undefined) {
        options = {}
    }

    const jsdom = require('jsdom');
    const document = new jsdom.JSDOM(html, options);
    const window = document.window;

    const newWindow = {};

    KEYS.forEach(function (key) {
        newWindow[key] = window[key]
    });

    newWindow.document = window.document;
    newWindow.window = window;
    newWindow.console = window.console;
    newWindow.document.destroy = cleanup;

    function cleanup () {
        KEYS.forEach(function (key) { delete global[key] })
        window.close();
    }

    return { dom: newWindow, cleanup: cleanup };
}
exports.__esModule = true;
exports["default"] = globalJSDOM;