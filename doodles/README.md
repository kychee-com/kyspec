# doodles/

Hand-drawn SVGs for kyspec.com, in the same hand as kygit.com's: every stroke is
composed, then run through a small pencil-wobble pass (jittered paths, a second
fainter pass, hatching instead of fills), so nothing is ruler-straight on purpose.
Where kygit's drawings decorate, these explain: each one sits beside the prose
that says the same thing, with a Caveat caption, and is `aria-hidden`.

Inks, in both schemes (each file carries its own `<style>`, so a drawing reads
on the paper and on the dark ground alike): ink for the drawing, graphite for
pencil marks and arrows, fountain-pen blue for the spec and its D-ids, green for
the verifier, and the reviewer's red pencil for the one strike.

| file | drawing | what it says |
|---|---|---|
| `rails.svg` | a 2025 scaffold, intact on the left, taken down on the right; a round-headed model walks out of the bay | the rails were built for a weaker model |
| `tiers.svg` | a plank of numbered principles, three spec sheets (one with `D-3`), three idea scraps, and a dashed change sheet with seven lines between ideas and specs | three tiers; a change is the unit between an idea and the spec |
| `chain.svg` | five numbered knots on a line; the fourth lifted into a dashed green box labelled "fresh thread" | the chain, with verify stepping out |
| `life.svg` | a timeline: a seed, the dashed change, spec and code meeting at one commit, a flag, a green magnifier, then the change struck through in red while a blue spec sheet carries `D-3` | a change's life, ending with the change deleted |
| `files.svg` | four files fanned out: METHOD.md, a folder of five skills, check-layout.mjs with a tick, AGENTS.md with its `##` | what you copy |
| `divider.svg` | the git log as one pencil line with knots; above one knot, a dashed sheet struck through | footer divider: the change was there once |
| `knot.svg` | a dashed sheet with a question mark on a short thread | the 404 page; draws itself in without script |
| `underline.svg`, `underline2.svg` | two pen swipes | masks for the pencil underline beneath each `h2` |

Also in this hand: `/logo.svg` (a sheet with a struck line in a wobbly frame)
and `/favicon.svg` (the sheet in paper ink on the dark ground), and `/og.png`,
the share card.

Motion: every path carries `pathLength="1"` and a `--i` draw-order stamp, so
the landing page can inline a drawing and replay its strokes in the order the
hand made them as it scrolls into view. Without JS the static images show as
they are; `prefers-reduced-motion` turns every animation off. They are static
artifacts: no generator ships with the site; to redraw one, redraw it with the
same inks and the same manners (wobble, overshoot, hatch, never a perfect circle).
