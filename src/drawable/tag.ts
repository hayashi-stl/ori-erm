import type { FaceID } from '@/design/design'

// Tags
type FaceTag = {
  type: 'face'
  faceID: FaceID
}

// A placeholder so we don't accidentally assume there's only 1 type of tag
type PlaceholderTag = {
  type: 'placeholder'
}

export type Tag = FaceTag | PlaceholderTag

// Creation functions. Please don't import these directly
export function face(faceID: FaceID): FaceTag {
  return { type: 'face', faceID: faceID }
}
