import { headers } from 'next/headers'
import { ClientCases, Results } from './cases'

export default async function ExperimentPage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <>
      <h1>What a strict CSP lets through</h1>
      <p>Each box tries to turn its background green a different way. The table reads back what the browser applied.</p>
      <link rel="stylesheet" href="/experiment.css" />
      <style nonce={nonce}>{'#nonce-style { background-color: green; }'}</style>
      <style>{'#plain-style { background-color: green; }'}</style>
      <div className="cases">
        <div id="attr" style={{ backgroundColor: 'green' }}>
          attr
        </div>
        <div id="nonce-style">nonce-style</div>
        <div id="plain-style">plain-style</div>
        <div id="link">link</div>
        <ClientCases />
      </div>
      <Results />
    </>
  )
}
