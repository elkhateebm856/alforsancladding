export function slugifyArabicTitle(title: string): string {
  return title
    .normalize('NFKC')
    .replace(/\+?\s*20\s*1\d{8}\b/g, '')
    .replace(/\b01\d{8}\b/g, '')
    .replace(/\b\d{10,}\b/g, '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .trim()
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export function isValidArticleSlug(slug: string): boolean {
  return /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9]+(?:-[\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9]+)*$/.test(
    slug,
  )
}
