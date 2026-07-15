"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRichText = sanitizeRichText;
const sanitize_html_1 = require("sanitize-html");
const ALLOWED_TAGS = [
    'p',
    'br',
    'hr',
    'div',
    'span',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'blockquote',
    'pre',
    'code',
    'kbd',
    'mark',
    'sup',
    'sub',
    'ul',
    'ol',
    'li',
    'dl',
    'dt',
    'dd',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'img',
];
const ALLOWED_ATTRIBUTES = {
    a: ['href', 'rel', 'title'],
    img: ['src', 'alt'],
};
function sanitizeRichText(html) {
    if (!html)
        return '';
    return (0, sanitize_html_1.default)(html, {
        allowedTags: ALLOWED_TAGS,
        allowedAttributes: ALLOWED_ATTRIBUTES,
        allowedSchemes: ['http', 'https', 'mailto'],
        allowProtocolRelative: false,
        disallowedTagsMode: 'discard',
        transformTags: {
            a: (tagName, attribs) => ({
                tagName,
                attribs: {
                    ...attribs,
                    rel: 'noopener noreferrer',
                },
            }),
            img: (tagName, attribs) => ({
                tagName,
                attribs: {
                    src: attribs.src,
                    alt: attribs.alt || '',
                },
            }),
        },
    });
}
//# sourceMappingURL=sanitize-html.util.js.map