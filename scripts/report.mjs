// Prints what actually happens on each page, for a fresh load and for a
// client-side navigation, against a server that is already running.
//
//   npm run build && CSP_MODE=enforce npm run start
//   npm run report

import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const PAGES = [
  ['/broken', 'Broken: style prop'],
  ['/fix-static', 'Fix 1: static class'],
  ['/fix-cssom', 'Fix 2: CSSOM'],
  ['/fix-nonce-style', 'Fix 3: style with nonce'],
  ['/fix-stylesheet', 'Fix 4: stylesheet route'],
]

const browser = await chromium.launch({ channel: 'chrome' })

async function openPage() {
  const context = await browser.newContext()
  const page = await context.newPage()
  const violations = []

  page.on('console', message => {
    if (message.text().includes('Content Security Policy')) {
      violations.push(message.text())
    }
  })

  return { page, violations, close: () => context.close() }
}

async function columnsOf(page) {
  const table = page.getByTestId('table')
  await table.waitFor({ state: 'attached' })
  await page.waitForTimeout(500)

  return table.evaluate(element => {
    const tracks = getComputedStyle(element).gridTemplateColumns

    return tracks === 'none' ? 1 : tracks.split(' ').length
  })
}

const rows = []

for (const [path, label] of PAGES) {
  const fresh = await openPage()
  await fresh.page.goto(BASE + path)
  const freshColumns = await columnsOf(fresh.page)
  const freshViolations = fresh.violations.length
  await fresh.close()

  const nav = await openPage()
  await nav.page.goto(BASE + '/')
  await nav.page.waitForLoadState('networkidle')
  nav.violations.length = 0
  await nav.page.click(`nav a[href="${path}"]`)
  await nav.page.waitForURL(BASE + path)
  const navColumns = await columnsOf(nav.page)
  const navViolations = nav.violations.length
  await nav.close()

  rows.push(`| ${label} | ${freshColumns} | ${freshViolations} | ${navColumns} | ${navViolations} |`)
}

console.log(`CSP mode of the running server: ${process.env.CSP_MODE ?? '(see server)'}\n`)
console.log('| Page | Fresh load: columns | Fresh load: CSP messages | Client navigation: columns | Client navigation: CSP messages |')
console.log('|---|---|---|---|---|')
console.log(rows.join('\n'))

const experiment = await openPage()
await experiment.page.goto(BASE + '/experiment')
await experiment.page.waitForSelector('[data-result="true"], [data-result="false"]')
const cases = await experiment.page.$$eval('[data-case]', rowElements =>
  rowElements.map(row => [row.children[0].textContent, row.children[1].textContent]),
)
console.log('\n| How the style reaches the element | Result |\n|---|---|')
console.log(cases.map(([label, result]) => `| ${label} | ${result} |`).join('\n'))
console.log('\nFirst CSP message on /experiment:\n' + (experiment.violations[0] ?? '(none)'))
await experiment.close()

await browser.close()
