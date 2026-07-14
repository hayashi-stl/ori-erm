import { Abstraction } from './abstraction'
import { Grid } from './grid'

/** The structure of an ERM project: grid size, abstraction, layout, all the good stuff */
export class Design {
  grid: Grid = new Grid(16, 16)
  abstraction: Abstraction = Abstraction.new()

  private constructor() {}

  /** Initialization by fields for convenience. TODO: Error checking. */
  static from(init?: Partial<Design>): Design {
    const result = new Design()
    Object.assign(result, init)
    return result
  }
}
