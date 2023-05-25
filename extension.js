// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let colorDecorationType = vscode.window.createTextEditorDecorationType({
        before: {
            contentText: '',
            border: 'solid 1px',
            width: '12px',
            height: '12px',
            marginRight: '4px'
        }
    });

    let disposable = vscode.commands.registerCommand('colored.highlightColors', () => {
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            let document = activeEditor.document;
            let text = document.getText();

            // Регулярное выражение для поиска значений цветов
            let colorRegex = /#([0-9A-Fa-f]{3}){1,2}\b|\b(?:rgb|hsl)a?\((?:\d+%?(?:,\s*)?){3,4}\)/g;

            let colorRanges = [];
            let match;
            while ((match = colorRegex.exec(text)) !== null) {
                let startPosition = document.positionAt(match.index);
                let endPosition = document.positionAt(match.index + match[0].length);
                let range = new vscode.Range(startPosition, endPosition);
                let colorValue = match[0];

                // Определение цвета для элемента before
                let colorStyle = getColorStyle(colorValue);
                let colorDecoration = {
                    range: range,
                    renderOptions: {
                        before: {
                            contentText: '',
                            border: 'solid 1px',
                            width: '12px',
                            height: '12px',
                            marginRight: '4px',
                            backgroundColor: colorStyle
                        }
                    }
                };
                colorRanges.push(colorDecoration);
            }

            activeEditor.setDecorations(colorDecorationType, colorRanges);
        }
    });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

function getColorStyle(colorValue) {
    let color = '';
    if (colorValue.startsWith('#')) {
        // Если цвет в формате HEX
        color = colorValue;
    } else if (colorValue.startsWith('rgb') || colorValue.startsWith('hsl')) {
        // Если цвет в формате RGB или HSL
        let match = colorValue.match(/(\d+)/g);
        if (match) {
            let [r, g, b] = match;
            color = `rgb(${r}, ${g}, ${b})`;
        }
    }
    return color;
}

module.exports = {
  activate,
  deactivate,
};
