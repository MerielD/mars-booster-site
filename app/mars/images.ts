import manifest from './image-manifest.json';

// Relative URLs work both at the domain root and under the GitHub project path.
const images: Record<string, { file: string; width: number; height: number }[]> = manifest;
export function imageProps(name: string, prefix: string, sizes = '(max-width: 760px) 100vw, 60vw') {
  const variants = images[name];
  const largest = variants[variants.length - 1];
  return {
    src: `${prefix}assets/optimized/${largest.file}`,
    srcSet: variants.map(v => `${prefix}assets/optimized/${v.file} ${v.width}w`).join(', '),
    sizes,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}
export function imageUrl(name: string, prefix: string) {
  const variants = images[name];
  return `${prefix}assets/optimized/${variants[variants.length - 1].file}`;
}
