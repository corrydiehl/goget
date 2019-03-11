// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GoSearchProvider } from './goSearchProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "goget" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		vscode.window.showInformationMessage("It's mothafuckin' " + time + " o'clock");
	});

	let newOne = vscode.commands.registerCommand('extension.damnStraight', () => {
		vscode.window.showInformationMessage("Damn Straight!");
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(newOne);

	const provider = new GoSearchProvider();
	vscode.window.registerTreeDataProvider('goSearchProvider', provider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
