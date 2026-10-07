'use client'

import { useLayoutEffect, useRef } from 'react'
import { PackageTable } from '@/components/PackageTable'

// Setting a property on element.style goes through the CSSOM, which CSP does
// not police. The catch: it can only happen once JavaScript runs, so the table
// stays hidden until then.
export function CssomPackageTable({ columns }: { columns: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    element.style.gridTemplateColumns = columns
    element.classList.remove('cssom-pending')
  }, [columns])

  return <PackageTable ref={ref} className="cssom-pending" />
}
