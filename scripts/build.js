// トップページ（index.html）と各ツールの説明ページ（tools/<slug>/index.html）を作る。
//
//   node scripts/build.js
//
// 中身は scripts/site-data.js にある。ツール本体（app.html）は import.js が作る。

const fs = require('fs');
const path = require('path');
const { SITE, CATEGORIES, TOOLS } = require('./site-data');
const { MARK, FAVICON } = require('./brand');
const asset = require('./asset-version');

const ROOT = path.resolve(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COMMON_NOTES = [
  '計算はブラウザーの中で行われ、入力したデータがサーバーに送られることはありません。',
  '出力される記述例や R コードは下書きです。数値と解釈は、研究の文脈と照らし合わせて確かめてください。',
];

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
  + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap">';

function head({ title, description, base, cat }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
${FONTS}
<link rel="stylesheet" href="${base}assets/${asset('tokens.css')}">
<link rel="stylesheet" href="${base}assets/${asset('app-bar.css')}">
<link rel="stylesheet" href="${base}assets/${asset('site.css')}">
${cat ? `<style>:root{--al-cat:var(--al-c-${cat})}</style>\n` : ''}</head>`;
}

function siteBar({ base, tool }) {
  let crumbs = '', links = '';
  if (tool) {
    const cat = CATEGORIES.find(c => c.id === tool.cat);
    crumbs = `<span class="al-sep al-s1">/</span><a class="al-crumb" href="${base}#${cat.id}">${esc(cat.name)}</a>`
      + `<span class="al-sep">/</span><span class="al-here"><i class="al-dot"></i>${esc(tool.name)}</span>`;
    if (tool.manual) links += '<a class="al-link" href="manual.html">マニュアル</a>';
    links += '<a class="al-link al-primary" href="app.html">ツールを開く</a>';
  } else if (SITE.repo) {
    links = `<a class="al-link" href="${esc(SITE.repo)}">GitHub</a>`;
  }
  return `<div class="al-bar" role="navigation" aria-label="${esc(SITE.name)}">`
    + `<a class="al-brand" href="${base}">${MARK}<span>${esc(SITE.name)}</span></a>${crumbs}<span class="al-gap"></span>${links}</div>`;
}

function footer(base) {
  return `<footer class="site-foot">
  <div class="wrap">
    <div>
      <b>${esc(SITE.name)}</b>
      <p>${esc(SITE.tagline)}。どのツールもインストール不要で、計算はブラウザーの中で完結します。</p>
      <p><a href="${base}">ツールの一覧へ</a>${SITE.repo ? ` ・ <a href="${esc(SITE.repo)}">ソースコード（GitHub）</a>` : ''}</p>
    </div>
    <div>
      <p>© ${SITE.year} ${esc(SITE.author)} ・ MIT License</p>
      <p>「SQS ソースエディタ Web」「SQS マーク読み取り」は、Apache License 2.0 で公開されている SQS（Shared Questionnaire System）をもとに作り直したものです。</p>
    </div>
  </div>
</footer>`;
}

const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ------------------------------------------------------------------ トップ */
function buildIndex() {
  const catnav = CATEGORIES.map(c => {
    const n = TOOLS.filter(t => t.cat === c.id).length;
    return `<li><a href="#${c.id}" style="--c:var(--al-c-${c.id})"><i></i>${esc(c.name)}<small>${n}</small></a></li>`;
  }).join('\n      ');

  const sections = CATEGORIES.map((c, i) => {
    const cards = TOOLS.filter(t => t.cat === c.id).map(t => `
        <li class="card">
          <h3><a href="tools/${t.slug}/">${esc(t.name)}</a></h3>
          <p class="en">${esc(t.en)}</p>
          <p class="lead">${esc(t.lead)}</p>
          <div class="foot"><span class="tag">${t.manual ? 'マニュアルあり' : '&nbsp;'}</span><a class="open" href="tools/${t.slug}/app.html">ツールを開く →</a></div>
        </li>`).join('');
    return `
  <section class="cat" id="${c.id}" style="--c:var(--al-c-${c.id})">
    <div class="wrap">
      <div class="cat-head">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <h2>${esc(c.name)}<small>${esc(c.en)}</small></h2>
        <p>${esc(c.desc)}</p>
      </div>
      <ul class="cards">${cards}
      </ul>
    </div>
  </section>`;
  }).join('\n');

  const html = `${head({ title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description, base: '' })}
<body>
${siteBar({ base: '' })}
<main>
  <header class="hero">
    <div class="wrap">
      <p class="eyebrow">${esc(SITE.en)} · ${TOOLS.length} tools</p>
      <h1>${esc(SITE.name)}</h1>
      <p class="tagline">${esc(SITE.tagline)}</p>
      <p class="desc">${esc(SITE.description)}</p>
      <ul class="points">
        <li><b>ブラウザーだけで動く</b><span>インストールもアカウント登録も要りません。入力したデータは端末の外に送られません。</span></li>
        <li><b>論文にそのまま近づける</b><span>多くのツールが、結果の読み方・論文の記述例・同じ計算を再現する R コードを出します。</span></li>
        <li><b>同じ手順で使える</b><span>どのツールも「読み込む → 設定する → 実行する → 書き出す」の順に並んでいます。</span></li>
      </ul>
    </div>
  </header>
  <nav aria-label="カテゴリ">
    <ul class="catnav wrap">
      ${catnav}
    </ul>
  </nav>
${sections}
</main>
${footer('')}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf8');
}

/* ------------------------------------------------------------------ 説明ページ */
function buildTool(t) {
  const cat = CATEGORIES.find(c => c.id === t.cat);
  const base = '../../';
  const list = arr => arr.map(x => `<li>${esc(x)}</li>`).join('');
  const siblings = TOOLS.filter(x => x.cat === t.cat).map(x =>
    `<li${x.slug === t.slug ? ' aria-current="page"' : ''}><a href="../${x.slug}/">${esc(x.name)}</a></li>`).join('');

  let n = 0;
  const sec = (title, body) => `
      <section>
        <h2><span class="n">${String(++n).padStart(2, '0')}</span>${esc(title)}</h2>
        ${body}
      </section>`;

  const main = [
    sec('概要', `<p>${esc(t.about)}</p>`),
    sec('できること', `<ul>${list(t.features)}</ul>`),
    sec('使い方', `<ol class="steps">${list(t.steps)}</ol>${t.sample ? `<p class="note-box" style="margin-top:14px">${esc(t.sample)}${/サンプル|例/.test(t.sample) ? 'まずはそれで動きを確かめるのがおすすめです。' : ''}</p>` : ''}`),
    sec('読み込めるデータ', `<p>${esc(t.input)}</p>`),
    sec('書き出せるもの', `<ul>${list(t.outputs)}</ul>`),
    sec('注意', `<ul class="notes">${list([...t.notes, ...COMMON_NOTES])}</ul>`),
  ].join('');

  const html = `${head({ title: `${t.name} — ${SITE.name}`, description: t.lead, base, cat: t.cat })}
<body>
${siteBar({ base, tool: t })}
<main>
  <header class="tool-hero">
    <div class="wrap">
      <a class="chip" href="${base}#${cat.id}"><i></i>${esc(cat.name)}</a>
      <h1>${esc(t.name)}</h1>
      <p class="en">${esc(t.en)}</p>
      <p class="lead">${esc(t.lead)}</p>
      <div class="actions">
        <a class="btn primary" href="app.html">ツールを開く ${ARROW}</a>
        ${t.manual ? '<a class="btn" href="manual.html">マニュアルを読む</a>' : ''}
      </div>
    </div>
  </header>
  <div class="wrap doc">
    <article>${main}
    </article>
    <aside class="side">
      <div class="box">
        <h3>このツール</h3>
        <dl>
          <dt>カテゴリ</dt><dd>${esc(cat.name)}</dd>
          <dt>入力</dt><dd>${esc(t.input.split(/[。（]/)[0])}</dd>
          <dt>マニュアル</dt><dd>${t.manual ? '<a href="manual.html">あり</a>' : 'この説明ページのみ'}</dd>
        </dl>
      </div>
      <div class="box">
        <h3>${esc(cat.name)}のツール</h3>
        <ul>${siblings}</ul>
      </div>
    </aside>
  </div>
</main>
${footer(base)}
</body>
</html>
`;
  fs.mkdirSync(path.join(ROOT, 'tools', t.slug), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'tools', t.slug, 'index.html'), html, 'utf8');
}

/* ------------------------------------------------------------------ README */
function buildReadme() {
  const rows = CATEGORIES.map(c => {
    const list = TOOLS.filter(t => t.cat === c.id)
      .map(t => `| [${t.name}](${SITE.pages}tools/${t.slug}/) | ${t.lead} |`).join('\n');
    return `### ${c.name}\n\n${c.desc}\n\n| ツール | できること |\n|---|---|\n${list}\n`;
  }).join('\n');

  const md = `# ${SITE.name}（${SITE.en}）

公開ページ.
${SITE.pages}

${SITE.description}

- インストールもアカウント登録も要りません。ブラウザーでページを開けば使えます。
- 計算はブラウザーの中で行われ、入力したデータがサーバーに送られることはありません。
- 出力される記述例や R コードは下書きです。数値と解釈は、研究の文脈と照らし合わせて確かめてください。
- 統計の計算はどれも完璧ではありません。大事な分析では、R・JASP などほかのソフトでも結果を確かめてください。

## ツール一覧（${TOOLS.length} 本）

${rows}
## フォルダーの構成

| パス | 中身 |
|---|---|
| \`index.html\` | トップページ（ツールの一覧） |
| \`tools/<名前>/index.html\` | ツールの説明ページ |
| \`tools/<名前>/app.html\` | ツール本体（1ファイルで動く HTML） |
| \`tools/<名前>/manual.html\` | マニュアル（あるツールのみ） |
| \`assets/\` | 共通の配色・書体（\`tokens.css\`）、ツール画面の上部バー（\`app-bar.css\`）、トップと説明ページの CSS（\`site.css\`） |
| \`scripts/\` | ページを作るスクリプト |

## ページの作り直し

Node.js が必要です（外部パッケージは使いません）。

\`\`\`
node scripts/import.js <ツールの元フォルダー>   # ツール本体を取り込み、共通の配色とバーを付けて app.html にする
node scripts/build.js                        # トップページ・説明ページ・README を作る
\`\`\`

- ツールの説明文とカテゴリは \`scripts/site-data.js\`、ツールごとの配色の割り当ては \`scripts/theme-map.js\` にあります。
- \`import.js\` はツールの計算処理には手を入れません。Google Apps Script 用のテンプレート（\`<?!= include() ?>\`）を展開し、共通の CSS とバーを足すだけです。

## 外部のライブラリ

一部のツールは、実行時に次のライブラリを CDN から読み込みます（データは送信されません）。
jStat、Plotly、D3.js、kuromoji.js（高精度の形態素解析を選んだときの辞書を含む）、marked、html2pdf.js、pdf-lib、SheetJS、JSZip、docx など。
書体は Google Fonts（Noto Sans JP、Noto Serif JP、JetBrains Mono）を使っています。

「SQS ソースエディタ Web」「SQS マーク読み取り」は、Apache License 2.0 で公開されている SQS（Shared Questionnaire System）の SourceEditor と MarkReader を、ブラウザーで動くように作り直したものです。

## ライセンス

MIT License（\`LICENSE.txt\`）。Copyright (c) ${SITE.year} ${SITE.author}
`;
  fs.writeFileSync(path.join(ROOT, 'README.md'), md, 'utf8');
}

function main() {
  const slugs = new Set();
  for (const t of TOOLS) {
    if (slugs.has(t.slug)) throw new Error(`slug の重複: ${t.slug}`);
    slugs.add(t.slug);
    if (!CATEGORIES.some(c => c.id === t.cat)) throw new Error(`${t.slug}: カテゴリ ${t.cat} が無い`);
    for (const k of ['name', 'en', 'lead', 'about', 'features', 'steps', 'input', 'outputs', 'notes']) {
      if (t[k] === undefined) throw new Error(`${t.slug}: ${k} が無い`);
    }
    if (!fs.existsSync(path.join(ROOT, 'tools', t.slug, 'app.html'))) console.warn(`! ${t.slug}: app.html がまだ無い（import.js を先に）`);
    if (t.manual && !fs.existsSync(path.join(ROOT, 'tools', t.slug, 'manual.html'))) console.warn(`! ${t.slug}: manual.html が無い`);
    buildTool(t);
  }
  buildIndex();
  buildReadme();
  fs.writeFileSync(path.join(ROOT, 'assets', 'favicon.svg'), FAVICON, 'utf8');
  fs.writeFileSync(path.join(ROOT, '.nojekyll'), '', 'utf8');
  console.log(`トップページと説明ページ ${TOOLS.length} 件を作りました`);
}

main();
