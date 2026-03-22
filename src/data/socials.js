/**
 * Edit URLs and bank lines for the #socials section on the home page.
 * Leave `href` empty to hide that link until you add it.
 */
export const SOCIAL_LINKS = [
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@FurqanQureshiBlogs',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@furqan.qureshi.blogs',
  },
  {
    id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/furqan.qureshi.blogs/',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/Furqan.Qureshi.Blogs.Official/',
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    href: 'https://x.com/FQB_Official',
  },
  {
    id: 'buymeacoffee',
    label: 'Buy Me a Coffee',
    href: 'https://buymeacoffee.com/mrfurqanqureshi',
  },
];

/**
 * Shown in a separate “Bank” card. Set lines to [] to hide the block.
 */
export const BANK_SUPPORT = {
  title: 'Bank transfer',
  /** Shown with a “Copy” control — only this value is copied, not the label. */
  iban: 'PK65FAYS3469301000003308',
  lines: [
    'Bank name: Faysal Bank',
    // 'Account title: …',
    // 'Account no. / branch: …',
  ],
};
