// src/extension.ts

import * as vscode from 'vscode';
import { deleteRandomQuote,commentOutRandomLine, deleteRandom } from './goofy_functions';

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

    // 2. LINTING: Run our linter on the active document when it's first opened.
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document);
    }

    // 3. LINTING: Re-run the linter every time the document is changed.
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document) {
                updateDiagnostics(event.document);
            }
        })
    );

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
        deleteRandom();
    }, 5000); // 5000 milliseconds = 5 seconds
}

/**
 * Analyzes a text document to find and report diagnostics (issues).
 * @param document The document to analyze.
 */
function updateDiagnostics(document: vscode.TextDocument): void {
    // We only want to analyze Python files.
    if (document.languageId !== 'python') {
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    // A simple regex to find 'print(' statements, avoiding commented lines.
    const printRegex = /^\s*print\(/;
    
    lines.forEach((lineText, lineNumber) => {
        if (printRegex.test(lineText)) {
            // Find the start and end of the 'print' keyword.
            const startIndex = lineText.indexOf('print');
            const endIndex = startIndex + 'print'.length;
            

            // Create a range for the squiggly underline.
            const range = new vscode.Range(lineNumber, startIndex, lineNumber, endIndex);

            // Create the diagnostic message.
            const diagnostic = new vscode.Diagnostic(
                range,
                'Found a `print` statement. Consider using a logger for production code.',
                vscode.DiagnosticSeverity.Warning // You can use .Error, .Information, or .Hint
            );
            print_call+=1;
            // Add a tag to indicate it's unnecessary code, which can be used by VS Code for filtering.
            diagnostic.tags = [vscode.DiagnosticTag.Unnecessary];
            diagnostics.push(diagnostic);
        }
    });

    // Update the collection with the new diagnostics for this document.
    diagnosticCollection.set(document.uri, diagnostics);
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
