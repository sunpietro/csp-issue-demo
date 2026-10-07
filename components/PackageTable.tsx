import type { CSSProperties, Ref } from 'react'

const packages = [
  { name: 'tiny-router', version: '4.2.1', downloads: '1,204,331', license: 'MIT' },
  { name: 'date-kit', version: '2.0.0', downloads: '893,120', license: 'MIT' },
  { name: 'color-utils', version: '1.9.4', downloads: '402,876', license: 'ISC' },
  { name: 'form-guard', version: '0.14.2', downloads: '88,410', license: 'MIT' },
  { name: 'virtual-list', version: '3.1.0', downloads: '61,005', license: 'Apache-2.0' },
]

type PackageTableProps = {
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
}

// Purely presentational, so server and client components can both render it.
export function PackageTable({ className = '', style, ref }: PackageTableProps) {
  return (
    <div ref={ref} role="table" aria-label="Packages" data-testid="table" className={`grid ${className}`} style={style}>
      <div role="row" className="row head">
        <span role="columnheader">Package</span>
        <span role="columnheader">Version</span>
        <span role="columnheader">Weekly downloads</span>
        <span role="columnheader">License</span>
      </div>
      {packages.map(pkg => (
        <div role="row" className="row" key={pkg.name}>
          <span role="cell">{pkg.name}</span>
          <span role="cell">{pkg.version}</span>
          <span role="cell">{pkg.downloads}</span>
          <span role="cell">{pkg.license}</span>
        </div>
      ))}
    </div>
  )
}
