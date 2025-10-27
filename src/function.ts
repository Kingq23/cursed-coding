import * as vscode from 'vscode';
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function random(){
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const document = editor.document;
    const text = document.getText();
    const random_variant:number = getRandomInt(0,3);
    let regex: RegExp;
    const prioritizedLines: number[] = [];
    const otherLines: number[] = [];
    const quoteIndices: number[] = [];
    let match;
    switch (random_variant) {
        default:
            return;
        case 0:
            // Deletes random quotes
            regex = /'|"/g;
        case 1:
            // Coments out random line
            regex = /(\b\w+\s*\(|\b\w+\s*=)/;
        case 2:
            // Deletes randomly
            regex = /'|"/g;
        case 3:
            regex = /\d+/g;
        
    }
    if(random_variant === 2){
        
        for (let i = 0; i < document.lineCount; i++) {
            //comment out random lines doesn't reuse code
            const line = document.lineAt(i);
            if (line.isEmptyOrWhitespace || line.text.trim().startsWith('#')) {
                continue;
            }
    
            if (regex.test(line.text)) {
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
        return;    
        }
    }
    while ((match = regex.exec(text)) !== null) {
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
        
    
    switch (random_variant) {
            case 0||2:
                editor.edit(editBuilder => {
                    editBuilder.delete(rangeToDelete);
                });
            case 3:
                editor.edit(editBuilder => {
                    editBuilder.replace(rangeToDelete,"67");
                });
    }

}