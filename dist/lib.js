"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var os = require("os");
var copyPaste = require("copy-paste");
var UuidByString = require("uuid-by-string");
function getUserId() {
    var hostname = os.hostname();
    var username = os.userInfo().username;
    var platform = os.platform();
    var str = [hostname, username, platform].join("--");
    return UuidByString(str);
}
exports.getUserId = getUserId;
function getClipboardText() {
    try {
        return Promise.resolve(copyPaste.paste());
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getClipboardText = getClipboardText;
function handleError(error) {
    console.trace('>>> Error');
    console.error(error);
    vscode_1.window.showErrorMessage(error.message);
}
exports.handleError = handleError;
function parseJson(json) {
    var tryEval = function (str) { return eval("const a = " + str + "; a"); };
    try {
        return Promise.resolve(JSON.parse(json));
    }
    catch (ignored) { }
    try {
        return Promise.resolve(tryEval(json));
    }
    catch (error) {
        return Promise.reject(new Error("Selected string is not a valid JSON"));
    }
}
exports.parseJson = parseJson;
exports.logEvent = function (visitor, eventAction) { return function (jsonString) {
    var eventLabel = jsonString.slice(0, 250);
    visitor
        .event({
        eventCategory: "JSON transform",
        eventAction: eventAction,
        eventLabel: eventLabel
    })
        .send();
    return jsonString;
}; };
function getViewColumn() {
    var activeEditor = vscode_1.window.activeTextEditor;
    if (!activeEditor) {
        return vscode_1.ViewColumn.One;
    }
    switch (activeEditor.viewColumn) {
        case vscode_1.ViewColumn.One:
            return vscode_1.ViewColumn.Two;
        case vscode_1.ViewColumn.Two:
            return vscode_1.ViewColumn.Three;
    }
    return activeEditor.viewColumn;
}
exports.getViewColumn = getViewColumn;
function pasteToMarker(content) {
    var activeTextEditor = vscode_1.window.activeTextEditor;
    return activeTextEditor === null || activeTextEditor === void 0 ? void 0 : activeTextEditor.edit(function (editBuilder) {
        editBuilder.replace(activeTextEditor.selection, content);
    });
}
exports.pasteToMarker = pasteToMarker;
function getSelectedText() {
    var _a = vscode_1.window.activeTextEditor, selection = _a.selection, document = _a.document;
    return Promise.resolve(document.getText(selection).trim());
}
exports.getSelectedText = getSelectedText;
exports.validateLength = function (text) {
    if (text.length === 0) {
        return Promise.reject(new Error("Nothing selected"));
    }
    else {
        return Promise.resolve(text);
    }
};
