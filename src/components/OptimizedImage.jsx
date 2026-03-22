import { useState, useEffect } from 'react';

/**
 * OptimizedImage component with blur-up placeholder and lazy loading
 * Supports srcSet for responsive images and automatically adds loading optimizations
 */
export default function OptimizedImage({
  src,
  alt,
  title,
  srcSet,
  sizes,
  width,
  height,
  className = '',
  placeholder = true,
  onLoad,
}) {
  const [imageSrc, setImageSrc] = useState(placeholder ? null : src);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate a tiny blur placeholder using Canvas API (data URL)
  const blurPlaceholder =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3C/svg%3E';

  useEffect(() => {
    if (!src) return;

    // Preload the image
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      setImageSrc(src); // Still show the image even if preload fails
      setIsLoaded(true);
    };
    img.src = src;
  }, [src, onLoad]);

  return (
    <img
      src={placeholder && !imageSrc ? blurPlaceholder : imageSrc || src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={`${className} ${
        isLoaded ? 'opacity-100' : 'opacity-75 blur-sm'
      } transition-all duration-500`}
      loading="lazy"
      decoding="async"
    />
  );
}
