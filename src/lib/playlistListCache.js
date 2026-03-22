import { fetchChannelIdByHandle, fetchPlaylistsForChannel } from './youtube';

const STORAGE_KEY = 'fqb_youtube_playlists_v1';

/** Default: 15 minutes — within this window, list is served from localStorage only (no API). */
export function playlistListTtlMs() {
  const raw = import.meta.env.VITE_PLAYLIST_CACHE_TTL_MS;
  const n = raw != null && raw !== '' ? Number(raw) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : 15 * 60 * 1000;
}

export function channelHandle() {
  return (
    import.meta.env.VITE_YOUTUBE_CHANNEL_HANDLE?.replace(/^@/, '').trim() || 'FurqanQureshiBlogs'
  );
}

function slugifyTitle(title) {
  return (title || 'playlist')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 42);
}

/**
 * Stable URL slug: title slug + tail of playlist id (avoids collisions).
 */
export function normalizeYoutubePlaylist(apiItem) {
  const id = apiItem.id;
  const sn = apiItem.snippet;
  const cd = apiItem.contentDetails;
  const count = Number(cd?.itemCount);
  const title = sn?.title ?? 'Playlist';
  const desc = (sn?.description || '').trim();
  const subtitle =
    desc.length > 160 ? `${desc.slice(0, 157)}…` : desc || (Number.isFinite(count) ? `${count} videos` : 'YouTube playlist');

  const thumb =
    sn?.thumbnails?.high?.url ??
    sn?.thumbnails?.medium?.url ??
    sn?.thumbnails?.default?.url ??
    null;

  const tail = id.replace(/^PL/, '').slice(-10);
  const slug = `${slugifyTitle(title)}-${tail}`.replace(/-+/g, '-');

  const tags = ['YouTube'];
  if (Number.isFinite(count) && count > 0) tags.push(`${count} videos`);

  return {
    slug,
    youtubePlaylistId: id,
    title,
    subtitle,
    thumbnailUrl: thumb,
    tags,
  };
}

function readStorage() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.updatedAt !== 'number' || !Array.isArray(data.playlists)) return null;
    return data;
  } catch {
    return null;
  }
}

function writeStorage(handle, playlists) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        handle,
        updatedAt: Date.now(),
        playlists,
      }),
    );
  } catch {
    /* quota / private mode */
  }
}

let inFlight = null;

async function fetchFreshPlaylists() {
  const key = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
  if (!key) {
    throw new Error('Missing VITE_YOUTUBE_API_KEY');
  }
  const handle = channelHandle();
  const channelId = await fetchChannelIdByHandle(handle);
  if (!channelId) {
    throw new Error(`Channel not found for handle @${handle}`);
  }
  const raw = await fetchPlaylistsForChannel(channelId);
  if (!raw?.length) return [];
  return raw.map(normalizeYoutubePlaylist);
}

/**
 * Returns cached entry synchronously (for SSR-safe initial state).
 */
export function readPlaylistListCache() {
  const handle = channelHandle();
  const cached = readStorage();
  if (!cached || cached.handle !== handle) return null;
  return {
    playlists: cached.playlists,
    updatedAt: cached.updatedAt,
    ageMs: Date.now() - cached.updatedAt,
    isFresh: Date.now() - cached.updatedAt < playlistListTtlMs(),
  };
}

/**
 * - Fresh cache (age &lt; TTL): return cache, no network.
 * - Stale or missing: return cache immediately if present, refresh in background; if no cache, await network.
 * Calls `onUpdate` when new data is written (background or foreground).
 */
export async function loadChannelPlaylistsWithCache({ onUpdate } = {}) {
  const handle = channelHandle();
  const ttl = playlistListTtlMs();
  const cached = readStorage();
  const sameHandle = cached?.handle === handle;
  const playlists = sameHandle ? cached.playlists : [];
  const updatedAt = sameHandle ? cached.updatedAt : 0;
  const age = Date.now() - updatedAt;
  const isFresh = sameHandle && playlists.length > 0 && age < ttl;

  if (isFresh) {
    return { playlists, fromCache: true, revalidated: false };
  }

  if (inFlight) {
    const next = await inFlight;
    return next;
  }

  const run = (async () => {
    try {
      if (playlists.length > 0) {
        fetchFreshPlaylists()
          .then((nextPlaylists) => {
            writeStorage(handle, nextPlaylists);
            onUpdate?.(nextPlaylists);
          })
          .catch(() => {
            /* keep stale UI */
          });
        return { playlists, fromCache: true, revalidated: false, stale: true };
      }

      const nextPlaylists = await fetchFreshPlaylists();
      writeStorage(handle, nextPlaylists);
      onUpdate?.(nextPlaylists);
      return { playlists: nextPlaylists, fromCache: false, revalidated: true };
    } catch (e) {
      return {
        playlists,
        fromCache: playlists.length > 0,
        revalidated: false,
        error: e instanceof Error ? e.message : 'Failed to load playlists',
      };
    } finally {
      inFlight = null;
    }
  })();

  inFlight = run;
  return run;
}
