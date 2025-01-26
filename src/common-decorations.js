const vscode = require('vscode');
const { memoize, loadCustomStyle } = require('./util');

function getSvgDecoration(svgUri, darkMode, customStyles = {}) {
    const baseStyle = {
        color: "transparent",
        textDecoration: "none; display: inline-block; width: 0;",
        before: {
            contentIconPath: vscode.Uri.parse(svgUri),
            textDecoration: `none;${darkMode ? " filter: invert(1)" : ""}`,
        },
    };

    return vscode.window.createTextEditorDecorationType({
        ...baseStyle,
        ...customStyles
    });
}

const createDecoration = (baseStyle, selector) => {
    const customStyles = loadCustomStyle()[selector] || {};
    return vscode.window.createTextEditorDecorationType({
        ...baseStyle,
        ...customStyles
    });
};

const hideDecoration = createDecoration({
    color: "transparent",
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    textDecoration: "none; display: inline-block; width: 0;",
}, '.markless-hide');

const transparentDecoration = createDecoration({
    color: "transparent",
}, '.markless-transparent');

const getUrlDecoration = memoize((isImage) => {
    const baseStyle = {
        color: "transparent",
        textDecoration: "none; display: inline-block; width: 0;",
        before: {
            contentText: isImage ? "🌄" : " 🔗",
            fontWeight: "bold",
            color: "cyan",
        },
    };

    const customStyles = loadCustomStyle()[isImage ? '.markless-image-url' : '.markless-url'] || {};

    return vscode.window.createTextEditorDecorationType({
        ...baseStyle,
        ...customStyles
    });
});

const createRainbowDecoration = (level) => {
    const hueRotationMultiplier = [0, 5, 9, 2, 6, 7];
    level = level % hueRotationMultiplier.length;
    const baseStyle = {
        textDecoration: `; filter: hue-rotate(${hueRotationMultiplier[level] * 360 / 12}deg);`
    };
    const customStyles = loadCustomStyle()[`.markless-rainbow-${level}`] || {};
    return vscode.window.createTextEditorDecorationType({
        ...baseStyle,
        ...customStyles
    });
};

const createListBulletDecoration = (level, bullet) => {
    const baseStyle = {
        color: "transparent",
        textDecoration: "none; display: inline-block; width: 0;",
        after: {
            contentText: bullet,
            fontWeight: "bold"
        }
    };
    const customStyles = loadCustomStyle()[`.markless-list-bullet-${level}`] || {};
    return vscode.window.createTextEditorDecorationType({
        ...baseStyle,
        ...customStyles
    });
};

const createCheckboxDecoration = (checked) => {
    const baseStyle = {
        color: "transparent",
        textDecoration: "none; display: inline-block; width: 0;",
        after: {
            contentText: checked ? "☑" : "☐",
            fontWeight: "bold"
        }
    };
    const customStyles = loadCustomStyle()[checked ? '.markless-checkbox-checked' : '.markless-checkbox-unchecked'] || {};
    return vscode.window.createTextEditorDecorationType({
        ...baseStyle,
        ...customStyles
    });
};

module.exports = {
    hideDecoration,
    transparentDecoration,
    getUrlDecoration,
    getSvgDecoration,
    createRainbowDecoration,
    createListBulletDecoration,
    createCheckboxDecoration
};