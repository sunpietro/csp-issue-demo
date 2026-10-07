import { headers } from 'next/headers'
import { PackageTable } from '@/components/PackageTable'
import { PACKAGE_COLUMNS, gridClassName } from '@/lib/grid'

export default async function NonceStylePage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  const className = gridClassName(PACKAGE_COLUMNS)

  return (
    <>
      <h1>Fix 3: a style element with the nonce</h1>
      <p>The server writes the rule into a style element that carries this response&apos;s nonce.</p>
      <style nonce={nonce}>{`.${className} { grid-template-columns: ${PACKAGE_COLUMNS}; }`}</style>
      <PackageTable className={className} />
    </>
  )
}
