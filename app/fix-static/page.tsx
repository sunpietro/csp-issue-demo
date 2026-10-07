import { PackageTable } from '@/components/PackageTable'

export default function StaticClassPage() {
  return (
    <>
      <h1>Fix 1: a static class</h1>
      <p>The layout is known in advance, so it is an ordinary class in a stylesheet.</p>
      <PackageTable className="cols-packages" />
    </>
  )
}
