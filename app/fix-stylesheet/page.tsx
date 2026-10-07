import { PackageTable } from '@/components/PackageTable'
import { PACKAGE_COLUMNS, gridClassName } from '@/lib/grid'

export default function StylesheetPage() {
  return (
    <>
      <h1>Fix 4: a stylesheet from your own origin</h1>
      <p>
        A route handler returns the rule as CSS. With <code>precedence</code>, React treats the link as a stylesheet
        resource: it is hoisted into the head, deduplicated, and the page waits for it.
      </p>
      <link rel="stylesheet" href={`/css/grid?c=${encodeURIComponent(PACKAGE_COLUMNS)}`} precedence="grid" />
      <PackageTable className={gridClassName(PACKAGE_COLUMNS)} />
    </>
  )
}
