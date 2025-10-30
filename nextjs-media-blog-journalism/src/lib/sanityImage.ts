import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {client} from '@/sanity/client'

const builder = imageUrlBuilder(client)

/**
 * Повертає побудований url builder для зображень Sanity.
 * Завжди вмикає автоматичну оптимізацію формату.
 */
export function urlForImage(source?: SanityImageSource | null) {
  if (!source) {
    return null
  }

  return builder.image(source).auto('format')
}
