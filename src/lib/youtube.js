const BASE = 'https://www.googleapis.com/youtube/v3';

function apiKey() {
  return import.meta.env.VITE_YOUTUBE_API_KEY?.trim() || '';
}

/**
 * Resolve channel UC… id from a @handle (e.g. FurqanQureshiBlogs for @FurqanQureshiBlogs).
 */
export async function fetchChannelIdByHandle(handle) {
  const key = apiKey();
  if (!key || !handle) return null;

  const clean = handle.replace(/^@/, '').trim();
  const url = new URL(`${BASE}/channels`);
  url.searchParams.set('part', 'id');
  url.searchParams.set('forHandle', clean);
  url.searchParams.set('key', key);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `channels.list ${res.status}`);
  }

  const data = await res.json();
  return data.items?.[0]?.id ?? null;
}

/**
 * All playlists for a channel (paginated).
 */
export async function fetchPlaylistsForChannel(channelId) {
  const key = apiKey();
  if (!key || !channelId) return null;

  const out = [];
  let pageToken = '';

  for (let i = 0; i < 25; i += 1) {
    const url = new URL(`${BASE}/playlists`);
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', key);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `playlists.list ${res.status}`);
    }

    const data = await res.json();
    for (const item of data.items ?? []) {
      out.push(item);
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return out;
}

/**
 * Load all videos in a playlist via YouTube Data API v3.
 */
export async function fetchPlaylistVideos(youtubePlaylistId) {
  const key = apiKey();
  if (!key || !youtubePlaylistId) return null;

  const items = [];
  let pageToken = '';

  for (let i = 0; i < 20; i += 1) {
    const url = new URL(`${BASE}/playlistItems`);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('playlistId', youtubePlaylistId);
    url.searchParams.set('key', key);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `playlistItems.list ${res.status}`);
    }

    const data = await res.json();
    for (const row of data.items ?? []) {
      const sn = row.snippet;
      const vid = sn.resourceId?.videoId;
      if (!vid || sn.title === 'Deleted video' || sn.title === 'Private video') continue;
      items.push({
        id: vid,
        title: sn.title,
        thumb:
          sn.thumbnails?.high?.url ??
          sn.thumbnails?.medium?.url ??
          sn.thumbnails?.default?.url ??
          `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${vid}`,
      });
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return items;
}
