import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const nextCss = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
const staticHtml = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8')

const contracts = [
  '@media (min-width:861px) and (max-width:1180px)',
  'env(safe-area-inset-left)',
  'env(safe-area-inset-right)',
  'min-height:44px',
  'min-height:100svh',
  'max-height:100dvh',
  '.hero-content{max-width:min(62vw,720px)}',
  'bottom:max(1.2rem,env(safe-area-inset-bottom))',
  '.reel{flex-basis:clamp(300px,42vw,430px)}',
  '.about-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}',
  '.method-grid{grid-template-columns:repeat(2,minmax(0,1fr))}',
  '.reel{flex-basis:min(76vw,330px)}',
  'max-height:calc(100dvh - 2rem)',
  '.tcard{width:min(42vw,360px)}',
  '.tcard{width:min(84vw,340px)}',
  '.faq-wrap{max-width:760px}',
  '.nav-logo .ph{width:clamp(150px,18vw,280px)}',
  '.footer-grid ul a{min-height:44px}',
]

for (const contract of contracts) {
  test(`Next and static CSS include ${contract}`, () => {
    assert.ok(nextCss.includes(contract), `app/globals.css is missing ${contract}`)
    assert.ok(staticHtml.includes(contract), `site/index.html is missing ${contract}`)
  })
}

test('programs use the same compact interaction query in React and static JavaScript', () => {
  const reactPrograms = readFileSync(new URL('../components/Programs.tsx', import.meta.url), 'utf8')
  const compactQuery = '(max-width:1024px), (pointer:coarse)'
  assert.ok(reactPrograms.includes(compactQuery))
  assert.ok(staticHtml.includes(compactQuery))
})
