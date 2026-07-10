import { Matrix, type Polygon } from 'pixi.js'

/** A face in an abstraction. Usually a rectangle. */
export class Face {
  polygon: Polygon
  back: boolean

  constructor(polygon: Polygon, back: boolean) {
    this.polygon = polygon
    this.back = back
  }

  /** Checks if a face is valid. It must be convex and have no length-0 edges.
   * (Technically you can use ERM with concave faces, but the paper
   * needs to be concave, and it's annoying to specify the validity
   * condition for concave faces, so we pretend they don't exist.)
   * Note that area-0 faces are allowed. The path must go back and forth only once.
   */
  valid(): boolean {
    ;``
  }
}

/** An entry storing more data relevant to the abstraction than just the face, such as
 * position and connections.
 */
class AbstractionEntry {
  transform: Matrix = Matrix.IDENTITY
  /** Target face, followed by the source-edge-index and target-edge-index that connect. */
  targets: { target: Face; edges: [number, number] }[] = []
}

/** An abstraction: the object you want to represent */
export class Abstraction {
  faces: Map<Face, AbstractionEntry> = new Map()
}
