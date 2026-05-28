/**
 * Helper para servir assets crudos (frames, videos, iconos) desde
 * Cloudinary cuando PUBLIC_CLOUDINARY_CLOUD_NAME esta definido,
 * y desde /public en caso contrario.
 *
 * Las imagenes que pasan por astro:assets (Image component) NO usan
 * este helper: Astro las optimiza y hashea por su cuenta.
 */
const CLOUD = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME as string | undefined;
const FOLDER = (import.meta.env.PUBLIC_CLOUDINARY_FOLDER as string | undefined) ?? '';
const DEFAULT_IMAGE_TX = 'f_auto,q_auto';
const DEFAULT_VIDEO_TX = 'f_auto,q_auto';

export type CdnAssetType = 'image' | 'video';

export interface CdnOpts {
  type?: CdnAssetType;
  transform?: string;
}

export function cdn(path: string, opts: CdnOpts = {}): string {
  const clean = path.replace(/^\/+/, '');
  if (!CLOUD) return '/' + clean;

  const type = opts.type ?? 'image';
  const transform =
    opts.transform ?? (type === 'video' ? DEFAULT_VIDEO_TX : DEFAULT_IMAGE_TX);
  const folder = FOLDER ? FOLDER.replace(/^\/+|\/+$/g, '') + '/' : '';

  return `https://res.cloudinary.com/${CLOUD}/${type}/upload/${transform}/${folder}${clean}`;
}
