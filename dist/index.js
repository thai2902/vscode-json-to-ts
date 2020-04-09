"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var os = require("os");
var fs = require("fs");
var vscode_1 = require("vscode");
var src_1 = require("json-to-ts/dist/src");
var lib_1 = require("./lib");
var UA = require("universal-analytics");
var visitor = UA("UA-97872528-2", lib_1.getUserId());
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand("jsonToTs.fromSelection", transformFromSelection));
    context.subscriptions.push(vscode_1.commands.registerCommand("jsonToTs.fromClipboard", transformFromClipboard));
}
exports.activate = activate;
function transformFromSelection() {
    var tmpFilePath = path.join(os.tmpdir(), "json-to-ts.ts");
    var tmpFileUri = vscode_1.Uri.file(tmpFilePath);
    console.log('>>> JSON to TS: From File', tmpFilePath);
    lib_1.getSelectedText()
        // .then(logEvent(visitor, "Selection"))
        .then(lib_1.validateLength)
        .then(lib_1.parseJson)
        .then(function (json) {
        return src_1.default(json).reduce(function (a, b) { return a + "\n\n" + b; });
    })
        .then(function (interfaces) {
        fs.writeFileSync(tmpFilePath, interfaces);
    })
        .then(function () {
        vscode_1.commands.executeCommand("vscode.open", tmpFileUri, lib_1.getViewColumn());
    })
        .catch(lib_1.handleError);
}
function transformFromClipboard() {
    console.log('>>> JSON to TS: Clipboard');
    lib_1.getClipboardText()
        // .then(logEvent(visitor, "Clipboard"))
        .then(lib_1.validateLength)
        .then(lib_1.parseJson)
        .then(function (json) {
        return src_1.default(json).reduce(function (a, b) { return a + "\n\n" + b; });
    })
        .then(function (interfaces) {
        lib_1.pasteToMarker(interfaces);
    })
        .catch(lib_1.handleError);
}
