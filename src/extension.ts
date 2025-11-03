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



    // Set a timer to delete a random quote every 5 seconds.
    const quoteDeletionTimer = setInterval(() => {
        random();
    }, (Math.random()*5000)+2000); // 5000 milliseconds = 5 seconds
}




/**
 * This method is called when your extension is deactivated.
 */
