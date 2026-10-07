'use client'

import { useEffect, useRef, useState } from 'react'

const GREEN = 'rgb(0, 128, 0)'

export const CASES = [
  ['attr', 'A style attribute in the HTML the server sent'],
  ['nonce-style', 'A <style> element with the nonce'],
  ['plain-style', 'A <style> element without a nonce'],
  ['link', 'A <link rel="stylesheet"> to a file on the same origin'],
  ['cssom', 'A trusted script sets element.style.backgroundColor'],
  ['setattr', "A trusted script calls setAttribute('style', ...)"],
  ['react-client', 'A React style prop on an element created in the browser'],
] as const

// The cases a browser script has to create.
export function ClientCases() {
  const cssomRef = useRef<HTMLDivElement>(null)
  const setAttributeRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (cssomRef.current) {
      cssomRef.current.style.backgroundColor = 'green'
    }

    setAttributeRef.current?.setAttribute('style', 'background-color: green')
    setMounted(true)
  }, [])

  return (
    <>
      <div id="cssom" ref={cssomRef}>
        cssom
      </div>
      <div id="setattr" ref={setAttributeRef}>
        setattr
      </div>
      {mounted && (
        <div id="react-client" style={{ backgroundColor: 'green' }}>
          react-client
        </div>
      )}
    </>
  )
}

// Reads back what the browser actually applied.
export function Results() {
  const [results, setResults] = useState<boolean[] | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(
        CASES.map(([id]) => {
          const element = document.getElementById(id)

          return element ? getComputedStyle(element).backgroundColor === GREEN : false
        }),
      )
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <table className="results" data-testid="results">
      <thead>
        <tr>
          <th>How the style reaches the element</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {CASES.map(([id, label], index) => (
          <tr key={id} data-case={id}>
            <td>{label}</td>
            <td data-result={results ? String(results[index]) : 'pending'}>
              {results ? (results[index] ? 'Applied' : 'Blocked') : '...'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
