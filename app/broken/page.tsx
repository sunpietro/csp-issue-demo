import { PackageTable } from '@/components/PackageTable'
import { PACKAGE_COLUMNS } from '@/lib/grid'

export default function BrokenPage() {
  return (
    <>
      <h1>Broken: a style prop</h1>
      <p>The column layout is passed as a style prop, which the server renders as a style attribute.</p>
      <PackageTable style={{ gridTemplateColumns: PACKAGE_COLUMNS }} />
    </>
  )
}
