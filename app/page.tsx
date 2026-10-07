export default function Home() {
  return (
    <>
      <h1>Strict CSP and inline styles</h1>
      <p>
        Each page renders the same grid table. Open a page from the menu, then refresh it: a client-side navigation
        and a fresh load take different paths through the Content Security Policy.
      </p>
      <p>
        Run the same build with <code>CSP_MODE=enforce</code>, <code>report-only</code> or <code>off</code> to compare.
      </p>
    </>
  )
}
