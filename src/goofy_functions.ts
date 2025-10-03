import * as vscode from 'vscode';


/**
 * Finds and deletes a random quotation mark from the active document.
 */
export function deleteRandomQuote() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const text = document.getText();

    // Find all quote characters and store their indices.
    const quoteRegex = /'|"/g;
    const quoteIndices: number[] = [];
    let match;
    while ((match = quoteRegex.exec(text)) !== null) {
        quoteIndices.push(match.index);
    }

    if (quoteIndices.length === 0) {
        return; // No quotes to delete.
    }

    // Select a random quote to delete.
    const randomIndex = Math.floor(Math.random() * quoteIndices.length);
    const quoteIndex = quoteIndices[randomIndex];
    const rangeToDelete = new vscode.Range(document.positionAt(quoteIndex), document.positionAt(quoteIndex + 1));

    // Perform the edit.
    editor.edit(editBuilder => {
        editBuilder.delete(rangeToDelete);
    });
}