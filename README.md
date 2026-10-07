# csp-issue-demo

**[Source article](https://blog.piotrnalepa.pl/2026/10/07/dlaczego-moje-tabele-skladaly-sie-w-jedna-kolumne-strict-csp-vs-inline-styles-w-react/)**

Why a strict Content Security Policy collapses a server-rendered grid table into
one column - only after a refresh - and four ways to fix it, measured.

Next.js 16 (App Router), React 19, the nonce-based policy from the
[Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy).

## Run it

```bash
npm install
npm run build
CSP_MODE=enforce npm run start    # or report-only, or off
npm run report                    # in a second terminal
npm test                          # Playwright, against a production build
```

The tests and the report use your installed Google Chrome (`channel: 'chrome'`),
so no browser download is needed.

## Pages

| Page | How the table gets its columns |
|---|---|
| `/broken` | A `style` prop, rendered by the server as a `style` attribute |
| `/fix-static` | An ordinary class in a stylesheet |
| `/fix-cssom` | A client component sets `element.style` after it mounts |
| `/fix-nonce-style` | The server renders a `<style>` element with the response's nonce |
| `/fix-stylesheet` | A route handler at `/css/grid` returns the rule as CSS; React loads it with `precedence` |
| `/experiment` | Seven ways to style an element, and what the policy lets through |

Open a page from the menu (client-side navigation), then refresh it (fresh load).
They take different paths through the policy.

## What `npm run report` printed (Chrome 154, CSP enforced)

| Page | Fresh load | Client navigation |
|---|---|---|
| Broken: style prop | 1 column, 1 CSP error | 4 columns |
| Fix 1: static class | 4 columns | 4 columns |
| Fix 2: CSSOM | 4 columns | 4 columns |
| Fix 3: style with nonce | 4 columns | 1 column, 1 CSP error |
| Fix 4: stylesheet route | 4 columns | 4 columns |

With `CSP_MODE=off` every page shows 4 columns everywhere, which is why this bug
survives local development.

## Files worth reading

- `proxy.ts` - the policy, and the `CSP_MODE` switch
- `app/css/grid/route.ts` - the stylesheet route, with input validation
- `lib/grid.ts` - the shared class-name hash and the track-list allowlist
- `tests/csp.spec.ts` - the CSP guard to copy into your own suite
