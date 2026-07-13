const GLYPHS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?#%&*@$'

// Returns a same-length decoy string: spaces/newlines preserved so the
// overlay lines up with the real input, everything else replaced with a
// random glyph. The real value is never touched by this — display only.
export function scramble(value: string): string {
  let out = ''
  for (const ch of value) {
    if (ch === ' ' || ch === '\n' || ch === '\t') {
      out += ch
    } else {
      out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    }
  }
  return out
}
