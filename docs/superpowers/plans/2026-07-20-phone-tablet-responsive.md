# Phone and Tablet Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the BIG COACH landing page comfortable, readable, and fully usable on phones and tablets without changing the desktop design or conversion journey.

**Architecture:** Use a hybrid responsive system rather than device-specific styling. Fluid `clamp()` sizing handles intermediate widths, `max-width:860px` remains the main stacked-layout breakpoint, `861px–1180px` becomes a dedicated tablet band, and coarse-pointer queries disable interactions that are unsuitable for touch. Keep the Next.js preview and the production `site/index.html` version behaviorally identical.

**Tech Stack:** CSS media queries, CSS environment safe-area variables, React 19/Next.js 15 preview, vanilla HTML/CSS/JavaScript production site, Node.js built-in test runner.

## Global Constraints

- Preserve RTL Hebrew layout and the current black, white, and red visual identity.
- Preserve the section order and all existing copy.
- Do not add dependencies.
- Keep `app/globals.css` and the `<style>` block in `site/index.html` synchronized.
- Keep `components/Programs.tsx` and the corresponding program logic in `site/index.html` synchronized.
- Keep all interactive touch targets at least `44px × 44px`.
- Respect `prefers-reduced-motion: reduce`.
- Do not introduce horizontal page scrolling at any tested viewport.
- Production remains the standalone `site/index.html`; the Next.js app remains the live development preview.

---

## Chosen Responsive Strategy

Three approaches were considered:

1. **Keep one `860px` breakpoint:** smallest change, but tablets continue to fall awkwardly between desktop and mobile sizing.
2. **Create separate rules for named devices:** precise for known iPads and phones, but brittle when screen sizes and browser chrome change.
3. **Hybrid fluid and capability-based layout:** recommended. Use fluid sizes, one tablet width band, the existing stacked-layout breakpoint, and `(pointer: coarse)` for touch-heavy interaction changes.

The third approach gives the fewest special cases and directly addresses the current gap: portrait tablets need more room than phones, while touch tablets should not use the desktop program scroll scrub.

## Target Viewport Matrix

| Class | Viewport | Expected layout |
|---|---:|---|
| Small phone | `360 × 800` | Single column, compact typography, safe-area padding |
| Standard phone | `390 × 844` | Single column, primary CTA visible above the fold |
| Large phone | `430 × 932` | Single column with slightly wider cards |
| Small tablet portrait | `768 × 1024` | Stacked touch layout with tablet spacing |
| Tablet portrait | `820 × 1180` | Stacked touch layout, wider content and cards |
| Tablet landscape | `1024 × 768` | Two-column sections where appropriate; no scroll scrub on touch |
| Laptop regression | `1280 × 800` | Existing desktop layout and scroll effects preserved |

---

### Task 1: Add a Responsive Contract Test and Shared Foundation

**Files:**
- Create: `tests/responsive-contract.test.mjs`
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `site/index.html`

**Interfaces:**
- Consumes: the current CSS selectors and mirrored Next/static site structure.
- Produces: `npm run test:responsive` and a shared breakpoint contract used by every later task.

- [ ] **Step 1: Write the failing responsive contract test**

Create `tests/responsive-contract.test.mjs`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const nextCss = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
const staticHtml = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8')

const contracts = [
  '@media (min-width:861px) and (max-width:1180px)',
  'env(safe-area-inset-left)',
  'env(safe-area-inset-right)',
  'min-height:44px',
]

for (const contract of contracts) {
  test(`Next and static CSS include ${contract}`, () => {
    assert.ok(nextCss.includes(contract), `app/globals.css is missing ${contract}`)
    assert.ok(staticHtml.includes(contract), `site/index.html is missing ${contract}`)
  })
}
```

- [ ] **Step 2: Add and run the test command**

Add this script to `package.json`:

```json
"test:responsive": "node --test tests/responsive-contract.test.mjs"
```

Run:

```bash
npm run test:responsive
```

Expected: FAIL because the tablet band, safe-area rules, and minimum touch size have not been added yet.

- [ ] **Step 3: Add the responsive foundation to both CSS copies**

Add the following after the base responsive comment in `app/globals.css` and in the `<style>` block of `site/index.html`:

```css
html,body{max-width:100%;overflow-x:clip}

@media (min-width:861px) and (max-width:1180px){
  :root{--pad-x:clamp(1.8rem,4vw,3rem);--gap:.9rem}
  section{padding:clamp(5rem,8vw,7rem) var(--pad-x)}
}

@media (max-width:860px){
  nav:not(.menu-overlay),section{
    padding-right:max(1.4rem,env(safe-area-inset-right));
    padding-left:max(1.4rem,env(safe-area-inset-left));
  }
}

@media (pointer:coarse){
  .btn,.u-link,.menu-link,.qa button,.menu-fab,.wa-fab,.prog-plus,.golan-direct,.golan-lead-btn{
    min-height:44px;
  }
  .cursor-dot,.cursor-ring{display:none}
}
```

Do not remove the existing `@media (max-width:1024px)`, `@media (max-width:860px)`, or `@media (max-width:680px)` blocks. Later tasks refine them.

- [ ] **Step 4: Run the responsive test**

Run:

```bash
npm run test:responsive
```

Expected: all four tests PASS.

- [ ] **Step 5: Commit the responsive foundation**

```bash
git add tests/responsive-contract.test.mjs package.json app/globals.css site/index.html
git commit -m "test: define phone and tablet responsive contract"
```

---

### Task 2: Adapt Navigation, Hero, Menu, and Floating Controls

**Files:**
- Modify: `app/globals.css`
- Modify: `site/index.html`
- Test: `tests/responsive-contract.test.mjs`

**Interfaces:**
- Consumes: the tablet band and safe-area foundation from Task 1.
- Produces: an above-the-fold layout that remains readable at `360px–1180px` and safe floating controls.

- [ ] **Step 1: Extend the contract test for hero and menu behavior**

Add these strings to the `contracts` array:

```js
'min-height:100svh',
'max-height:100dvh',
'.hero-content{max-width:min(62vw,720px)}',
'bottom:max(1.2rem,env(safe-area-inset-bottom))',
```

Run `npm run test:responsive`.

Expected: FAIL because the new hero and safe-area behavior is not present.

- [ ] **Step 2: Add tablet hero sizing**

Inside `@media (min-width:861px) and (max-width:1180px)` in both CSS copies, add:

```css
nav:not(.menu-overlay){padding:1.6rem var(--pad-x) 0}
#hero{min-height:calc(100svh - 1.8rem);padding:clamp(5rem,8vh,7rem) var(--pad-x);margin:.9rem}
.hero-content{max-width:min(62vw,720px)}
#hero h1{font-size:clamp(3.8rem,7vw,5.4rem)}
.hero-sub{font-size:1.08rem;max-width:540px;margin-bottom:2rem}
.hero-cut{width:min(42vw,500px);height:82%;left:.5rem}
.hero-badge{font-size:.95rem;margin-bottom:1.4rem}
```

- [ ] **Step 3: Refine phone hero and menu rules**

Inside `@media (max-width:860px)` in both CSS copies, update or add:

```css
#hero{
  min-height:100svh;
  padding-top:6rem;
  padding-right:max(1.4rem,env(safe-area-inset-right));
  padding-bottom:max(6rem,calc(4.5rem + env(safe-area-inset-bottom)));
  padding-left:max(1.4rem,env(safe-area-inset-left));
}
.hero-content{width:100%;max-width:620px}
.menu-overlay{max-height:100dvh;overflow-y:auto}
.menu-card{
  padding-top:max(3rem,env(safe-area-inset-top));
  padding-right:max(2rem,env(safe-area-inset-right));
  padding-bottom:max(3rem,env(safe-area-inset-bottom));
  padding-left:max(2rem,env(safe-area-inset-left));
}
.wa-fab{
  bottom:max(1.2rem,env(safe-area-inset-bottom));
  left:max(1.2rem,env(safe-area-inset-left));
}
```

Inside `@media (max-width:680px)`, add:

```css
#hero h1{font-size:clamp(2.65rem,12vw,3.55rem);line-height:1.08}
.hero-cta-row{width:100%}
.hero-cta-row .btn-light{max-width:100%}
.hero-note{font-size:.86rem}
.menu-link{font-size:clamp(2rem,11vw,3.4rem)}
```

- [ ] **Step 4: Run structural and responsive tests**

Run:

```bash
npm run test:responsive
npm run typecheck
```

Expected: both commands PASS.

- [ ] **Step 5: Commit hero and navigation responsiveness**

```bash
git add tests/responsive-contract.test.mjs app/globals.css site/index.html
git commit -m "feat: adapt hero and navigation for touch screens"
```

---

### Task 3: Adapt Story, Reels, About, and Method Sections

**Files:**
- Modify: `app/globals.css`
- Modify: `site/index.html`
- Test: `tests/responsive-contract.test.mjs`

**Interfaces:**
- Consumes: shared width bands from Task 1.
- Produces: readable content density and predictable card layouts across phones and tablets.

- [ ] **Step 1: Add section layout assertions**

Add these strings to the `contracts` array:

```js
'.reel{flex-basis:clamp(300px,42vw,430px)}',
'.about-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}',
'.method-grid{grid-template-columns:repeat(2,minmax(0,1fr))}',
'.reel{flex-basis:min(76vw,330px)}',
```

Run `npm run test:responsive`.

Expected: FAIL until the tablet and phone rules are added.

- [ ] **Step 2: Add tablet layouts**

Inside `@media (min-width:861px) and (max-width:1180px)` in both CSS copies, add:

```css
.story-spacer{height:260vh}
#reels{padding-right:var(--pad-x);padding-left:var(--pad-x)}
.reel{flex-basis:clamp(300px,42vw,430px)}
.about-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2rem}
.about-text,.golan-card{padding:clamp(1.6rem,3vw,2.4rem)}
.about-h2{font-size:clamp(2.1rem,4vw,3rem)}
.about-stats{gap:.6rem}
.stat{padding-inline:.7rem}
.method-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.mcard{padding:2rem 1.6rem}
```

- [ ] **Step 3: Refine stacked layouts for phones and portrait tablets**

Inside `@media (max-width:860px)` in both CSS copies, add:

```css
.story-spacer{height:210vh}
.about-grid{width:100%;max-width:720px;margin-inline:auto}
.about-text,.golan-card{min-width:0}
.method-grid{width:100%;max-width:720px;margin-inline:auto}
```

Inside `@media (max-width:680px)`, add:

```css
.story-spacer{height:180vh}
.reel{flex-basis:min(76vw,330px)}
#about,#method{padding-right:1.1rem;padding-left:1.1rem}
.about-text{padding:1.5rem .8rem}
.golan-card{padding:1.7rem 1.2rem}
.golan-card p{font-size:.98rem;line-height:1.75}
.mcard{padding:1.8rem 1.3rem}
```

- [ ] **Step 4: Verify section CSS**

Run:

```bash
npm run test:responsive
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit content-section responsiveness**

```bash
git add tests/responsive-contract.test.mjs app/globals.css site/index.html
git commit -m "feat: improve responsive content sections"
```

---

### Task 4: Replace Touch-Device Program Scrubbing with Stacked Cards

**Files:**
- Modify: `components/Programs.tsx`
- Modify: `app/globals.css`
- Modify: `site/index.html`
- Test: `tests/responsive-contract.test.mjs`

**Interfaces:**
- Consumes: the existing five program definitions and `open`/`aria-expanded` state.
- Produces: desktop scroll scrub for fine pointers and stacked program cards for tablets and phones.

- [ ] **Step 1: Add a failing source contract for the shared compact query**

Add this test:

```js
test('programs use the same compact interaction query in React and static JavaScript', () => {
  const reactPrograms = readFileSync(new URL('../components/Programs.tsx', import.meta.url), 'utf8')
  const compactQuery = '(max-width:1024px), (pointer:coarse)'
  assert.ok(reactPrograms.includes(compactQuery))
  assert.ok(staticHtml.includes(compactQuery))
})
```

Run `npm run test:responsive`.

Expected: FAIL because both implementations currently use only `max-width:860px`.

- [ ] **Step 2: Change the React scrub guard**

In `components/Programs.tsx`, define the media query next to the `PROGS` data:

```ts
const COMPACT_PROGRAMS_QUERY = '(max-width:1024px), (pointer:coarse)'
```

Replace:

```ts
if (matchMedia('(max-width:860px)').matches) return
```

with:

```ts
if (matchMedia(COMPACT_PROGRAMS_QUERY).matches) return
```

- [ ] **Step 3: Change the static scrub guard**

In the program scroll function inside `site/index.html`, replace:

```js
if(matchMedia('(max-width:860px)').matches)return;
```

with:

```js
if(matchMedia('(max-width:1024px), (pointer:coarse)').matches)return;
```

- [ ] **Step 4: Move stacked program CSS to the compact query**

Move the complete block beginning with:

```css
/* programs mobile: stacked cards */
```

out of `@media (max-width:860px)` in both CSS copies. Wrap the unchanged block in:

```css
@media (max-width:1024px), (pointer:coarse){
  /* existing stacked program card rules */
}
```

Then add these tablet refinements inside that query:

```css
#programs{padding:0 clamp(1rem,3vw,2rem)}
.prog-stage{min-height:clamp(250px,42vw,420px)}
[data-prog].open{min-height:clamp(420px,66vw,560px)}
.prog-center{max-width:620px;margin:auto}
.prog-detail{max-width:680px;margin:auto}
```

Inside `@media (max-width:680px)`, retain the compact phone values:

```css
.prog-stage{min-height:230px}
[data-prog].open{min-height:400px}
.prog-detail{right:1.2rem;left:1.2rem}
```

- [ ] **Step 5: Verify touch and desktop behavior**

Run:

```bash
npm run test:responsive
npm run typecheck
```

Expected: PASS.

At `1024 × 768` with a coarse pointer, verify that all five program cards are stacked and each expands independently. At `1280 × 800` with a fine pointer, verify that the existing sticky scrub still changes from `01/05` through `05/05`.

- [ ] **Step 6: Commit program interaction changes**

```bash
git add tests/responsive-contract.test.mjs components/Programs.tsx app/globals.css site/index.html
git commit -m "feat: use touch-friendly program cards on tablets"
```

---

### Task 5: Adapt Testimonials, FAQ, Footer, Consent, and Lead Modal

**Files:**
- Modify: `app/globals.css`
- Modify: `site/index.html`
- Test: `tests/responsive-contract.test.mjs`

**Interfaces:**
- Consumes: existing sliders, FAQ buttons, footer grid, consent banner, and lead form.
- Produces: readable final sections and modals that fit within phone/tablet viewports.

- [ ] **Step 1: Add modal and card width assertions**

Add these strings to the `contracts` array:

```js
'max-height:calc(100dvh - 2rem)',
'.tcard{width:min(42vw,360px)}',
'.tcard{width:min(84vw,340px)}',
'.faq-wrap{max-width:760px}',
```

Run `npm run test:responsive`.

Expected: FAIL until the new rules exist.

- [ ] **Step 2: Add tablet final-section layouts**

Inside `@media (min-width:861px) and (max-width:1180px)` in both CSS copies, add:

```css
.tcard{width:min(42vw,360px)}
.ba-card{width:min(34vw,300px)}
.faq-wrap{max-width:760px}
.footer-grid{grid-template-columns:1.4fr 1fr 1fr;gap:2rem}
.final-inner{padding-right:var(--pad-x);padding-left:var(--pad-x)}
```

- [ ] **Step 3: Add phone and portrait-tablet rules**

Inside `@media (max-width:860px)`, add:

```css
.tcard{width:min(84vw,340px)}
.ba-card{width:min(72vw,290px)}
.faq-wrap{width:100%;max-width:720px}
.lead-overlay{padding:1rem}
.lead-card{max-height:calc(100dvh - 2rem);overflow-y:auto}
.consent{padding-bottom:env(safe-area-inset-bottom)}
```

Inside `@media (max-width:680px)`, add:

```css
.faq-head{text-align:right;margin-bottom:2rem}
.qa button{min-height:56px}
.final-inner{padding-right:1.1rem;padding-left:1.1rem}
.footer-grid{gap:2rem}
.consent-btns{display:grid;grid-template-columns:1fr 1fr;width:100%}
.consent-btns button{min-height:44px}
```

- [ ] **Step 4: Run automated checks**

Run:

```bash
npm run test:responsive
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit final-section responsiveness**

```bash
git add tests/responsive-contract.test.mjs app/globals.css site/index.html
git commit -m "feat: adapt conversion sections for phones and tablets"
```

---

### Task 6: Run the Full Cross-Device Verification Matrix

**Files:**
- Modify only if a verified defect is found: `app/globals.css`, `components/Programs.tsx`, `site/index.html`
- Test: `tests/responsive-contract.test.mjs`

**Interfaces:**
- Consumes: all responsive work from Tasks 1–5.
- Produces: a verified responsive release candidate.

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm run test:responsive
npm run typecheck
git diff --check
```

Expected: all commands exit with code `0`.

- [ ] **Step 2: Run the required standalone HTML validation**

Run:

```bash
open_count=$(grep -c '<div' site/index.html)
close_count=$(grep -c '</div>' site/index.html)
test "$open_count" -eq "$close_count"
sed -n '/<script>/,/<\/script>/p' site/index.html | sed '1d;$d' | node --check -
```

Expected: the opening and closing `<div>` counts match, and `node --check` exits with code `0`.

- [ ] **Step 3: Check every target viewport**

For each viewport in the matrix, inspect the page from the hero through the footer and verify:

- No horizontal page scrollbar.
- No text or buttons are clipped.
- The hero heading and primary CTA are visible without overlapping the menu or WhatsApp controls.
- Phone and tablet touch targets are at least `44px` high.
- Story scrolling does not trap the user for an excessive distance.
- Reels remain draggable and do not extend past the viewport.
- About and method cards have readable line lengths.
- Programs stack on phones and touch tablets; scrub remains on fine-pointer desktop.
- Program details can scroll internally when their content exceeds the card.
- Testimonial cards expose enough of the next card to signal horizontal movement.
- Every FAQ item opens and closes without layout overlap.
- Lead modal, consent banner, and menu overlay fit inside `100dvh`.
- Footer links remain centered and tappable.

- [ ] **Step 4: Check orientation changes**

At `820 × 1180`, rotate to `1180 × 820` and back. Verify that:

- The layout changes without requiring a reload.
- An open program detail remains usable.
- No stale transform from desktop scrubbing is left on a stacked program card.
- Floating controls remain inside safe areas.

- [ ] **Step 5: Check browser errors**

Reload once at `390 × 844`, `820 × 1180`, and `1280 × 800`. Confirm there are no console errors at any size.

- [ ] **Step 6: Commit any final verified corrections**

```bash
git add tests/responsive-contract.test.mjs package.json app/globals.css components/Programs.tsx site/index.html
git commit -m "fix: complete responsive viewport verification"
```

---

## Completion Criteria

The responsive work is complete only when:

- All automated responsive, TypeScript, HTML-tag, and inline-JavaScript checks pass.
- All seven target viewports pass the manual checklist.
- Phone and touch-tablet program cards do not use the desktop scroll scrub.
- Desktop layout and program scrub remain unchanged at `1280px` and wider with a fine pointer.
- The Next.js preview and standalone production page remain synchronized.
