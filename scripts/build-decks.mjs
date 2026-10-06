// リポジトリ直下のデッキ(<名前>.md)をすべてビルドして、dist/<名前>/ に出力し、一覧ページ dist/index.html を作る。
// README.md と、名前が _ で始まるファイル(_template.md など)は対象外。
// components / layouts / global-top.vue などの共有部品は、Slidev がエントリーのあるフォルダ(= リポジトリ直下)
// から読むため、デッキはリポジトリ直下に置く。デッキ固有のファイルは好きなフォルダに置いてよい。
//
//   node scripts/build-decks.mjs [--base /リポジトリ名/]
//
// GitHub Pages のようにサブディレクトリで公開する場合、各デッキの base は <base><名前>/ になる。
// ルーターは hash モードにするので、リロードや URL の直打ちでも 404 にならない。
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
// シェルを通さず(空白を含むパスや OS 差で壊れないよう)、Slidev の CLI を node で直接実行する
const slidevBin = join(dirname(createRequire(import.meta.url).resolve('@slidev/cli/package.json')), 'bin', 'slidev.mjs')
const dist = join(root, 'dist')

const args = process.argv.slice(2)
const baseIndex = args.indexOf('--base')
let base = baseIndex >= 0 ? args[baseIndex + 1] : '/'
if (!base.startsWith('/')) base = `/${base}`
if (!base.endsWith('/')) base = `${base}/`

const names = readdirSync(root, { withFileTypes: true })
  .filter(f => f.isFile() && f.name.endsWith('.md') && f.name !== 'README.md' && !f.name.startsWith('_'))
  .map(f => f.name.slice(0, -'.md'.length))
  .sort()

if (!names.length) {
  console.error('リポジトリ直下に <名前>.md のデッキが見つかりません')
  process.exit(1)
}

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

/** 冒頭の frontmatter から title / genre を読む(なければ名前) */
function readMeta(name) {
  const text = readFileSync(join(root, `${name}.md`), 'utf8')
  const head = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const pick = key => head.match(new RegExp(`^${key}:\s*(.+?)\s*$`, 'm'))?.[1]
  return { title: pick('title') ?? name, genre: pick('genre') ?? '' }
}

const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

for (const name of names) {
  console.log(`\n=== ${name} ===`)
  const result = spawnSync(process.execPath, [
    slidevBin, 'build', `${name}.md`,
    '--base', `${base}${name}/`,
    '--out', join(dist, name),
    '--router-mode', 'hash',
  ], { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const items = names.map((name) => {
  const { title, genre } = readMeta(name)
  return `      <li><a href="./${name}/"><span class="t">${escapeHtml(title)}</span>${genre ? `<span class="g">${escapeHtml(genre)}</span>` : ''}</a></li>`
}).join('\n')

writeFileSync(join(dist, 'index.html'), `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Slides</title>
    <style>
      :root { color-scheme: light dark; }
      body { max-width: 40rem; margin: 3rem auto; padding: 0 1rem; font-family: system-ui, sans-serif; }
      h1 { font-size: 1.4rem; }
      ul { list-style: none; padding: 0; }
      li + li { margin-top: .5rem; }
      a { display: flex; justify-content: space-between; gap: 1rem; padding: .75rem 1rem; border: 1px solid #8884; border-radius: 6px; color: inherit; text-decoration: none; }
      a:hover { background: #8882; }
      .g { opacity: .6; }
    </style>
  </head>
  <body>
    <h1>Slides</h1>
    <ul>
${items}
    </ul>
  </body>
</html>
`)
console.log(`\n${names.length} 件のデッキを dist/ に出力しました: ${names.join(', ')}`)
