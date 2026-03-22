/**
 * Utility to generate responsive image URLs for thumbnails
 * Assumes images are served with query params for size optimization
 */
export function getImageUrl(src, width = null) {
  if (!src || typeof src !== 'string') return src;
  // Remove query params if any
  const baseUrl = src.split('?')[0];
  if (width) {
    return `${baseUrl}?w=${width}&q=75`;
  }
  return baseUrl;
}

/**
 * Generate srcSet for responsive images
 * @param {string} src - Base image source
 * @param {array} widths - Array of widths to generate (e.g., [200, 400, 800])
 * @returns {string} srcSet format
 */
export function generateSrcSet(src, widths = [200, 400, 800]) {
  return widths.map((w) => `${getImageUrl(src, w)} ${w}w`).join(', ');
}

/**
 * Get sizes attribute value for responsive images
 * @returns {string} sizes attribute
 */
export function getImageSizes() {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
}
