# Research brief: Medhansh portfolio rebuild

Brief: creative individual who thinks (graphic design, posters, brand content, video editing). Global. Look, loader, scroll and cursor motion all open to change. Studied 17 Nov 2026.

## Sites studied

| Site | Type | What stood out | Fit |
|---|---|---|---|
| tomdekoning.work | Designer portfolio (GSAP 3.15, ScrollTrigger, Lenis) | Name set huge, roman and italic letters mixed, one orange accent, portrait cutout behind the type, facts list that fades in line by line on scroll, playful "click here" button, floating menu pill | Primary (type and scroll rhythm) |
| sweet-tape.com (Awwwards SOTD, 15 Nov 2026) | Brand site (Lenis) | Torn paper, masking tape, sticky notes, lime and deep green, hand-made collage feel, giant condensed type that assembles itself on load, a "pull me" tab | Primary (sticker and tape language) |
| crl-2026.webflow.io (Creative Reference Library) | Awwwards winner | Logo is a loader: black letter fragments, scroll breaks them apart and rotates them to fill the screen. One idea, done big | Primary (scroll as a loader or reveal) |
| brandonyasin.com (Awwwards SOTD) | Creative director portfolio | Endless horizontal strip of work, tiny caps labels, local time in the header, quiet warm taupe background, nothing competes with the work | Primary (work strip) |
| reactbits.dev | Component library | 215+ effects: Blob Cursor, Splash Cursor, Pixel Trail, Orbit Images, Metallic Paint, Magnet Lines, text effects, Ballpit, Aurora | Idea bank (cursor, text effects) |
| motionsites.ai | Website prompt gallery | Portfolio concepts named Sticker Type, Ink Reveal, Hover Ink, Eye Loader, Video Ribbon, VHS Archive, Ink Comic, Sphere Gallery, Dot Portrait | Idea (mood, naming of effects) |
| threeui.com/browse | 3D and WebGL component library | Holo card, orbit and floating 3D objects, shader backgrounds. Heavy, mostly paid | Mood only (3D not needed here) |
| awwwards.com loader collection (542 items) | Loader gallery | Patterns: counter 0 to 100, text-based loaders, loader that becomes the cursor, grid or slat reveals, preloader that morphs into the hero | Idea (loader patterns) |
| awwwards.com Sites of the Day list | Gallery | Recent winners: bikebear, Bulletproof, The First The Last, Dylan Brouwer, Sam Dallyn, Obys, Active Theory | Skimmed |
| Bulletproof, Dylan Brouwer, Guillaume Colombel | Agency and portfolios | Browser refused or blocked access | Not studied visually |

## Recurring patterns

1. One big typographic idea per screen, small mono or caps labels around it.
2. The loader is part of the concept, not a spinner. It hands over to the hero.
3. Scroll does the storytelling: scrub, pin, horizontal strips, colour inversion.
4. One accent colour and one neutral. Texture (paper, grain) gives warmth.
5. Libraries seen in the wild: GSAP + ScrollTrigger + Lenis on the primary references.

## Anti-patterns noted

- Popups or cookie walls on load.
- Template sameness: centred hero, three feature cards.
- Heavy WebGL with no payoff for a work-first portfolio.
- Pure black plus one orange (the v5 look, and also Tom de Koning's), too common.

## Why the primary references work (principles, not copies)

- Tom de Koning: personality lives in the type itself. Mixed roman and italic makes a name feel handled by a person.
- Sweet Tape: a physical metaphor (tape, paper) lets decoration double as structure. Stickers belong because the whole page is a surface.
- CRL: the best loader is the brand mark acting. It costs one asset and is remembered.
- Brandon Yasin: confidence means leaving the work alone. A strip with tiny labels lets images carry the page.

## Chosen direction

"Proof Sheet." The page is a designer's desk: bone paper, ink black, one proof-marker blue, taped and stuck elements, film-leader loader for the video side of the work.

Details in the build summary.

## Round 2: About page research (Buttermax)

| Site | What stood out | Used as |
|---|---|---|
| buttermax.net (Active Theory, Awwwards SOTD Jan 2024) | One flat colour plus black. Giant type with a 3D object floating in front of it. Cursor paints a solid smear over the letters with a thin RGB fringe. Scrolling adds a scanline RGB glitch to the 3D object and images. Manifesto paragraph in huge capitals with the first line indented under a small label. Words broken with a hyphen across lines (PROD / -UCTION). Small body copy offset to the right. | Primary. Liquid ink type, glitch on scroll speed, hyphen breaks, manifesto layout |
| buttermax.net/profile | Dark page, yellow and white words alternating, a glassy 3D slab scrolling behind huge type. | Chapter layout with the 3D form behind giant words |
| Awwwards "Reactive cursor" element | Confirms the smear is a mouse-driven WebGL trail, not CSS. | Trail texture drives the distortion in the shader |

Principles taken: one colour world per page, the 3D object sits in front of the type, the cursor changes the type itself, scroll speed changes the glitch, and copy is set in giant capitals with deliberate awkward breaks.

## Round 3: Re-theme (black, bone, red) and motion pass

Direction from the client: blue does not suit; black should dominate, with white and a deep red accent, texture on every background, and animation added almost everywhere, including unimportant places.

Decisions
- One accent only (deep red #C9132B, bright #FF5566 for small text on black). Bone #E7E4DA is type and occasional break sections.
- Texture is procedural (SVG turbulence tiles), so it costs no image weight: clouds on black, fibre on bone, dots on red.
- Motion is layered: ambient (grain, bobbing stickers), scroll (progress bar, skew, parallax, pinned chapters), cursor (spotlight, trail, proximity type, tilt, magnetism) and state (rolling text, scramble, ripples).
- Every effect is disabled for reduced motion and on touch devices where it needs a cursor.
