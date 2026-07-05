import { Grid } from './grid'

/** The structure of an ERM project: grid size, abstraction, layout, all the good stuff */
export class Project {
  grid: Grid

  constructor() {
    this.grid = new Grid(16, 16)
  }
}
