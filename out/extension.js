"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const _findAndSelect = (editor, findValue) => {
        let foundSelections = [];
        // Get the entire document
        let fullText = editor?.document.getText();
        // Matching the name and value pair
        let matches = [...fullText.matchAll(new RegExp(findValue, "gm"))];
        // Iterating over the match to fin the start position, end position and range of text
        matches.forEach((match, index) => {
            if (match.index) {
                let startPos = editor.document.positionAt(match.index);
                let endPos = editor.document.positionAt(match.index + match[0].length);
                let range = editor.document.lineAt(startPos.line - 1).range;
                // Selection/Highlighted section when the string is found
                foundSelections[index] = new vscode.Selection(startPos, endPos);
                // Scroll the editor to the line where the JSON string is found
                editor.revealRange(range);
            }
        });
        editor.selections = foundSelections; // this will remove all the original selections
    };
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('jsonpathhighlighter.jsonpathquery', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let value = '';
        let editor = vscode.window.activeTextEditor;
        let text = JSON.parse(editor?.document.getText().toString());
        vscode.window.showInputBox().then((key) => {
            let keyArr = key?.split('.');
            keyArr?.forEach((key) => {
                value = text[key];
                text = value;
            });
            const splitKeys = key?.split('.');
            const keyIdentifier = splitKeys ? splitKeys[splitKeys?.length - 1] : '';
            const modifiedValue = `"${keyIdentifier}": "${value}"`;
            vscode.window.showInformationMessage(value);
            _findAndSelect(editor, modifiedValue);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map