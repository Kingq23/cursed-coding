// src/extension.ts

import * as vscode from 'vscode';
import {random} from './function';

// This collection will hold all the diagnostic issues we find.
let diagnosticCollection: vscode.DiagnosticCollection;
var print_call = 0;
/**
 * This is the main entry point for your extension.
 * It's called when your extension is activated (i.e., when a Python file is opened).
 */
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "python-runtime-editor" is now active!');

    // 1. SETUP: Create a collection for diagnostic messages (the red squiggles).
    diagnosticCollection = vscode.languages.createDiagnosticCollection('python');
    context.subscriptions.push(diagnosticCollection);

    
    // 3. LINTING: Re-run the linter every time the document is changed.
    

    // 4. COMMAND: Register the command defined in package.json.
    // The commandId parameter must match the command field in package.json
    const disposableCommand = vscode.commands.registerCommand('python-runtime-editor.wrapInTryExcept', () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selection = editor.selection;
            // Get the text that is currently selected by the user.
            const selectedText = editor.document.getText(selection);

            if (selectedText) {
                // Indent each line of the selected text.
                const indentedText = selectedText.split('\n').map(line => `    ${line}`).join('\n');

                // Create the new code block.
                const newText = `try:\n${indentedText}\nexcept Exception as e:\n    print(f"An error occurred: {e}")`;

                // Use the editor's 'edit' method to replace the selected text.
                // This is the "runtime code editing" part.
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, newText);
                });
            } else {
                vscode.window.showInformationMessage('Please select a block of code to wrap.');
            }
        }
    });

    // Add the command to the extension's subscriptions so it's disposed of when the extension is deactivated.
    context.subscriptions.push(disposableCommand);

    // Set a timer to delete a random quote every 5 seconds.
    const quoteDeletionTimer = setInterval(() => {
        random();
    }, (Math.random()*10000)+20000); // 5000 milliseconds = 5 seconds
}




/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {
    // Clean up the diagnostic collection.
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
