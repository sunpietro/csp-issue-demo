import { expect, test, type Page } from '@playwright/test'

// The guard to copy into your own suite: collect every CSP message the browser
// logs, and fail when there are any. Run it against a production build with the
// policy enforced, because that is the combination local development skips.
function collectCspViolations(page: Page): string[] {
  const violations: string[] = []

  page.on('console', message => {
    if (message.text().includes('Content Security Policy')) {
      violations.push(message.text())
    }
  })

  return violations
}

async function columnCount(page: Page): Promise<number> {
  const table = page.getByTestId('table')
  await expect(table).toBeVisible()

  return table.evaluate(element => {
    const tracks = getComputedStyle(element).gridTemplateColumns

    return tracks === 'none' ? 1 : tracks.split(' ').length
  })
}

// What each page does under the enforced policy. The two `false` entries are
// the article's point: they pass every check that runs without the policy.
const PAGES = [
  { path: '/broken', freshLoadWorks: false, clientNavigationWorks: true },
  { path: '/fix-static', freshLoadWorks: true, clientNavigationWorks: true },
  { path: '/fix-cssom', freshLoadWorks: true, clientNavigationWorks: true },
  { path: '/fix-nonce-style', freshLoadWorks: true, clientNavigationWorks: false },
  { path: '/fix-stylesheet', freshLoadWorks: true, clientNavigationWorks: true },
]

for (const { path, freshLoadWorks, clientNavigationWorks } of PAGES) {
  test(`${path}: fresh load`, async ({ page }) => {
    const violations = collectCspViolations(page)
    await page.goto(path)

    await expect.poll(() => columnCount(page)).toBe(freshLoadWorks ? 4 : 1)
    expect(violations.length > 0).toBe(!freshLoadWorks)
  })

  test(`${path}: client-side navigation`, async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const violations = collectCspViolations(page)
    await page.click(`nav a[href="${path}"]`)
    await page.waitForURL(path)

    await expect.poll(() => columnCount(page)).toBe(clientNavigationWorks ? 4 : 1)
    expect(violations.length > 0).toBe(!clientNavigationWorks)
  })
}

test('the stylesheet route rejects anything that is not a track list', async ({ request }) => {
  const injected = await request.get('/css/grid?c=' + encodeURIComponent('1fr } body { display: none'))
  expect(injected.status()).toBe(400)

  const valid = await request.get('/css/grid?c=' + encodeURIComponent('minmax(12rem, 2fr) 7rem'))
  expect(valid.status()).toBe(200)
  expect(valid.headers()['content-type']).toContain('text/css')
})
