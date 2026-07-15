"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRichTextInput = normalizeRichTextInput;
function normalizeRichTextInput(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value
        .replace(/\u0000/g, '')
        .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
        .replace(/\r\n?/g, '\n')
        .trim();
}
//# sourceMappingURL=rich-text.util.js.map