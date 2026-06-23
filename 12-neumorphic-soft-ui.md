# Style 12 — Neumorphic Soft UI

> Monochrome "soft UI". Surfaces extrude from a single gray background using twin light/dark shadows. Quiet, minimal, tactile — controls look pressed into or raised out of the page.

---

## 1. The feeling in one paragraph

One background color for *everything* — cards share the page's exact gray, so shape is read entirely from a **paired highlight + shadow** (light from top-left, dark from bottom-right). Raised elements cast outward; inputs and active toggles are carved *inward* with inset shadows. Almost no color: a single cool accent for the one action that matters. Low contrast, calm, architectural.

**Do:** identical bg for page and cards, dual soft shadows (`#FFFFFF` + `#BEC3CA`), inset for inputs/pressed, one accent only, generous padding.
**Don't:** borders, multiple bright colors, hard shadows, high-contrast text, busy layouts. (Mind accessibility — keep text contrast adequate.)

---

## 2. Design tokens

```css
:root {
  --bg:    #E0E5EC;   /* the single surface color */
  --ink:   #41485A;   /* primary text */
  --muted: #6B7280;   /* secondary text */

  --light: #FFFFFF;   /* top-left highlight */
  --dark:  #BEC3CA;   /* bottom-right shadow */
  --accent:#5B7CFA;   /* the one action color */

  --radius: 20px;
  --raise: 8px 8px 16px var(--dark), -8px -8px 16px var(--light);
  --press: inset 5px 5px 10px var(--dark), inset -5px -5px 10px var(--light);

  --font: "Poppins", system-ui, sans-serif;
}
```

**Alternate accents:** Teal `#15B8A6` · Coral `#FF7A6B` · Violet `#8B5CF6`

---

## 3. Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Role | Font | Notes |
|---|---|---|
| Headings | **Poppins** 600/700 | `letter-spacing:-0.01em` |
| Body | **Poppins** 400/500 | `line-height:1.6`, color `--muted` |
| Labels | **Poppins** 600 | ALL-CAPS, `letter-spacing:1px` |

Scale: h1 ~46px · h2 ~30 · body ~16 · label ~12.

---

## 4. Signature rules

1. **Everything is the same gray.** Page and cards share `--bg`; depth is shadow-only.
2. **Twin shadows.** Raised = `--raise`; inputs, toggles, pressed buttons = `--press`.
3. **No borders, ever.**
4. **One accent.** Color appears only on the primary button/active state.
5. **Soft radii.** Cards `20px`, controls `12–16px`, pills `999px`.

---

## 5. Component recipes

```css
.card { background:var(--bg); border-radius:var(--radius); box-shadow:var(--raise); padding:26px; }
.btn  { border:0; border-radius:14px; background:var(--accent); color:#fff; font-family:var(--font); font-weight:600; padding:14px 26px; box-shadow:var(--raise); cursor:pointer; }
.btn:active { box-shadow:var(--press); }
.btn--ghost { background:var(--bg); color:var(--ink); }
.chip { display:inline-flex; padding:8px 16px; border-radius:999px; background:var(--bg); color:var(--accent); box-shadow:var(--raise); font-family:var(--font); font-weight:600; }
.input { border:0; border-radius:14px; background:var(--bg); padding:14px 18px; box-shadow:var(--press); font-family:var(--font); color:var(--ink); }
```

**Layout:** wide padding, calm spacing; let shadows do the separating, not lines.

---

## 6. Composition cheat

- **Hero:** raised headline card; one accent button, one ghost button.
- **Sections:** raised `.card`s on the shared gray; never outline them.
- **Skills/tags:** raised pill `.chip`s.
- **Forms/CTA:** inset `.input`s; the single accent button anchors the action.

---

## 7. Prompt to hand the agent

> "Style this site per Neumorphic Soft UI: one gray (`#E0E5EC`) used for BOTH page and cards, with shape conveyed only by twin shadows — `8px 8px 16px #BEC3CA` + `-8px -8px 16px #FFFFFF` for raised, and the inset equivalents for inputs/pressed states. No borders. Exactly one accent color (`#5B7CFA`) reserved for the primary action. Poppins throughout, soft radii (20px cards, 14px controls). Keep contrast accessible despite the low-contrast aesthetic."
