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

/**
 * Finds and comments out a random line of code, prioritizing lines with
 * function calls or variable assignments.
 */
export function commentOutRandomLine() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const prioritizedLines: number[] = [];
    const otherLines: number[] = [];

    // Regex to find function calls or variable assignments.
    const priorityRegex = /(\b\w+\s*\(|\b\w+\s*=)/;

    // Categorize lines
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        if (line.isEmptyOrWhitespace || line.text.trim().startsWith('#')) {
            continue;
        }

        if (priorityRegex.test(line.text)) {
            prioritizedLines.push(i);
        } else {
            otherLines.push(i);
        }
    }

    let lineToComment: number | undefined;
    if (prioritizedLines.length > 0) {
        lineToComment = prioritizedLines[Math.floor(Math.random() * prioritizedLines.length)];
    } else if (otherLines.length > 0) {
        lineToComment = otherLines[Math.floor(Math.random() * otherLines.length)];
    } else {
        return; // No lines to comment out.
    }

    if (lineToComment !== undefined) {
        const line = document.lineAt(lineToComment);
        const position = new vscode.Position(lineToComment, line.firstNonWhitespaceCharacterIndex);
        editor.edit(editBuilder => {
            editBuilder.insert(position, '# ');
        });
    }
}
export function deleteRandom() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const text = document.getText();

    // Find all quote characters and store their indices.
    const quoteRegex = /'|"/g;
    const allText = document.getText();

    const quoteIndices: number[] = [];
    let match;
    // while ((match = text) !== null) {
    //     quoteIndices.push(match.index);
    // }

    if (text.length === 0) {
        return; // No quotes to delete.
    }

    // Select a random quote to delete.
    const randomIndex = Math.floor(Math.random() * text.length);
    const quoteIndex = text[randomIndex];
    const rangeToDelete = new vscode.Range(document.positionAt(randomIndex), document.positionAt(randomIndex + 1));

    // Perform the edit.
    editor.edit(editBuilder => {
        editBuilder.delete(rangeToDelete);
    });
}