/**
 * Resolve a playlist by URL slug. Pass the live list from `usePlaylists().playlists`.
 */
export function getPlaylistBySlug(slug, playlists = []) {
  return playlists.find((p) => p.slug === slug) ?? null;
}

export function playlistThumbnail(p) {
  if (p.thumbnailUrl) return p.thumbnailUrl;
  if (p.coverVideoId) return `https://i.ytimg.com/vi/${p.coverVideoId}/hqdefault.jpg`;
  return '/hero.svg';
}
