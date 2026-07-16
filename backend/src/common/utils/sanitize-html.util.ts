import * as sanitizeHtmlModule from 'sanitize-html';
const sanitizeHtml =
  (sanitizeHtmlModule as any).default ?? sanitizeHtmlModule;
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

export function sanitizeRichText(html: string): string {
  if (!html) return '';

  return sanitizeHtml(html, {
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
