import sanitizeHtml from 'sanitize-html'

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  'h1',
  'img',
  'figure',
  'figcaption',
  'iframe',
  'video',
  'source',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

export function sanitizeArticleHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      '*': ['class', 'dir', 'lang', 'style'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'title', 'allow', 'allowfullscreen'],
      video: ['src', 'controls', 'width', 'height', 'poster'],
      source: ['src', 'type'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
  })
}
