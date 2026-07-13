/** Computes the proper floor division.
 * `div(a, b)` returns `q` such that ∃`r`, (0 ≤ `r` < `b` and `b`·`q` + `r` = `a`).
 * If `b` is not positive, the behavior is undefined.
 */
export function div(a: number, b: number): number {
  return Math.floor(a / b)
}

/** Computes the proper floor modulo.
 * `mod(a, b)` returns `r` such that 0 ≤ `r` < `b` and ∃`q`, `b`·`q` + `r` = `a`.
 * If `b` is not positive, the behavior is undefined.
 */
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b
}
