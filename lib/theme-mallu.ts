// "mallu" - the mallu Cloud Solutions design carried into the webmail.
//
// Same idea as the website (mal.lu): the arcs of the mallu mark are the only
// curves, everything else is square like the ends of the logo line. Blue
// #2563EB is the brand, ink #0E1420 the text, mist #EEF2F9 the quiet surface.
// Type: Instrument Sans for text, Schibsted Grotesk for headings, both
// self-hosted by the root layout (--font-mallu-body, --font-mallu-display).
//
// The component rules reuse the "Flat fields" skin (square panes, no blur,
// no gradients), only re-keyed to this theme's id. Colours come from the
// tokens below, so the skin needs no colour of its own.

import { flatFieldsSkin } from './theme-flat-fields';

export const MALLU_THEME_ID = 'builtin-mallu';

export const malluCSS = `
:root {
  --color-background: #ffffff;
  --color-foreground: #0e1420;
  --color-card: #ffffff;
  --color-card-foreground: #0e1420;
  --color-popover: #ffffff;
  --color-popover-foreground: #0e1420;
  --color-secondary: #eef2f9;
  --color-secondary-foreground: #0e1420;
  --color-muted: #eef2f9;
  --color-muted-foreground: #4c5668;
  --color-accent: #eef2f9;
  --color-accent-foreground: #0e1420;
  --color-sidebar: #ffffff;
  --color-sidebar-foreground: #0e1420;
  --color-sidebar-border: #dfe3ea;
  --color-sidebar-accent: #eef2f9;
  --color-sidebar-accent-foreground: #0e1420;
  --color-selection: #e8effd;
  --color-selection-foreground: #0e1420;
  --color-border: #dfe3ea;
  --color-input: #7a8496;
  --color-ring: #1a47b8;
  --color-primary: #2563eb;
  --color-primary-foreground: #ffffff;
  --color-unread: #2563eb;
  --color-unread-wash: color-mix(in srgb, #2563eb 6%, #ffffff);
  --color-destructive: #b42318;
  --color-destructive-foreground: #ffffff;
  --color-success: #15803d;
  --color-success-foreground: #ffffff;
  --color-warning: #8a5d00;
  --color-warning-foreground: #ffffff;
  --color-info: #1a47b8;
  --color-info-foreground: #ffffff;
  --color-chart-1: #2563eb;
  --color-chart-2: #15803d;
  --color-chart-3: #8a5d00;
  --color-chart-4: #e8590c;
  --color-chart-5: #6b5bb5;

  /* Square everywhere, like the website. Only the logo has curves. */
  --radius-xs: 0px;
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
  --radius-2xl: 0px;
  --radius-3xl: 0px;
  --radius-4xl: 0px;

  --blur-xs: 0px;
  --blur-sm: 0px;
  --blur-md: 0px;
  --blur-lg: 0px;
  --blur-xl: 0px;
  --blur-2xl: 0px;
  --blur-3xl: 0px;
}

.dark {
  --color-background: #161e2d;
  --color-foreground: #f1f4f9;
  --color-card: #1b2333;
  --color-card-foreground: #f1f4f9;
  --color-popover: #1b2333;
  --color-popover-foreground: #f1f4f9;
  --color-secondary: #1b2333;
  --color-secondary-foreground: #f1f4f9;
  --color-muted: #1b2333;
  --color-muted-foreground: #aab4c6;
  --color-accent: #243049;
  --color-accent-foreground: #f1f4f9;
  --color-sidebar: #0e1420;
  --color-sidebar-foreground: #f1f4f9;
  --color-sidebar-border: #2b3547;
  --color-sidebar-accent: #1c2b4a;
  --color-sidebar-accent-foreground: #f1f4f9;
  --color-selection: #1c2b4a;
  --color-selection-foreground: #f1f4f9;
  --color-border: #2b3547;
  --color-input: #6b778c;
  --color-ring: #8db2ff;
  --color-primary: #7aa5ff;
  --color-primary-foreground: #0e1420;
  --color-unread: #7aa5ff;
  --color-unread-wash: color-mix(in srgb, #7aa5ff 11%, #161e2d);
  --color-destructive: #ff8a7a;
  --color-destructive-foreground: #161e2d;
  --color-success: #4ade80;
  --color-success-foreground: #161e2d;
  --color-warning: #e2b341;
  --color-warning-foreground: #161e2d;
  --color-info: #8db2ff;
  --color-info-foreground: #161e2d;
  --color-chart-1: #7aa5ff;
  --color-chart-2: #4ade80;
  --color-chart-3: #e2b341;
  --color-chart-4: #ff9a5c;
  --color-chart-5: #a99bf0;
}
`;

const bodyStack = `var(--font-mallu-body, "Instrument Sans"), ui-sans-serif, system-ui,
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans", "Noto Sans Thai", "Leelawadee UI", sans-serif`;

export const malluSkin =
  flatFieldsSkin
    .replaceAll('builtin-flat-fields', MALLU_THEME_ID)
    .replace(/var\(--font-hanken, "Hanken Grotesk"\)[^;]*;/, `${bodyStack};`) +
  `
/* ── Headings in the website's display face ── */
body[data-theme-skin="${MALLU_THEME_ID}"] :is(h1, h2) {
  font-family: var(--font-mallu-display, "Schibsted Grotesk"), var(--font-mallu-body, "Instrument Sans"), ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.01em;
}

/* ── Code and addresses in the website's mono face ── */
body[data-theme-skin="${MALLU_THEME_ID}"] :is(.font-mono, code, kbd, pre) {
  font-family: var(--font-mallu-mono, "JetBrains Mono"), ui-monospace, Consolas, monospace;
}
`;
