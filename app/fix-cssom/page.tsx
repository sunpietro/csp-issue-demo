import { PACKAGE_COLUMNS } from '@/lib/grid'
import { CssomPackageTable } from './CssomPackageTable'

export default function CssomPage() {
  return (
    <>
      <h1>Fix 2: set the value through the CSSOM</h1>
      <p>A client component writes the layout to element.style after it mounts.</p>
      <CssomPackageTable columns={PACKAGE_COLUMNS} />
    </>
  )
}
