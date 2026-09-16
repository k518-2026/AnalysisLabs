// ツール本体を取り込み、GitHub Pages で動く tools/<slug>/app.html にする。
//
//   node scripts/import.js <元フォルダ> [slug,slug,...]
//
// 元フォルダは works\analysis（カテゴリ別フォルダの親）。
// 行うこと
//   1. GAS のテンプレート（<?!= include('x') ?>）を中身で置き換え、<base target="_top"> を外す
//   2. 共通の書体・配色（assets/tokens.css）と、上部のバー（assets/app-bar.css）を足す
//   3. ツールの CSS 変数を共通の配色に割り当てる（scripts/theme-map.js）
//   4. <title> を「ツール名 — サイト名」にそろえる
//   5. マニュアルがあれば manual.html として同じようにバーを付けて置く
// ツールの計算処理には手を入れない。

const fs = require('fs');
const path = require('path');
const { SITE, CATEGORIES, TOOLS } = require('./site-data');
const THEME = require('./theme-map');
const { MARK } = require('./brand');
const asset = require('./asset-version');

const SOURCES = {
  'data-compare': { src: '01Comparative/00データ比較・自動分析 Webアプリ/index.html' },
  'categorical': { src: '01Comparative/01カテゴリ分析/index.html' },
  'crosstab-2x2': { src: '01Comparative/02-2×2カテゴリデータ分析/index.html', includes: { javascript: '01Comparative/02-2×2カテゴリデータ分析/javascript.html' } },
  'nonparametric': { src: '01Comparative/03ノンパラメトリック検定/index.html' },
  'correlation': { src: '02Correlation/00相関分析＆散布図 自動作成ツール/index.html' },
  'network': { src: '02Correlation/01ネットワーク分析ラボ/index.html' },
  'regression': { src: '03Causality-Prediction/00回帰分析・自動判定ツール/index.html' },
  'quantification': { src: '03Causality-Prediction/01数量化理論 解析ツール/index.html', includes: { script: '03Causality-Prediction/01数量化理論 解析ツール/script.html' } },
  'qca': { src: '03Causality-Prediction/02質的比較分析（QCA  fsQCA）解析ツール/index.html' },
  'decision-tree': { src: '03Causality-Prediction/03決定木ラボ/index.html' },
  'mixed-model': { src: '03Causality-Prediction/99混合モデル/gemini混合モデル入門/claude混合モデルラボ.html' },
  'propensity-score': { src: '04Structure-Grouping/04傾向スコアマッチング/index.html' },
  'cluster': { src: '04Structure-Grouping/01クラスター分析ラボ/index.html' },
  'pca': { src: '04Structure-Grouping/02主成分分析ラボ/Index.html' },
  'factor': { src: '04Structure-Grouping/03因子分析/index.html', manual: '04Structure-Grouping/03因子分析/因子分析ラボ_マニュアル.html' },
  'sem': { src: '04Structure-Grouping/09構造方程式モデリング/構造方程式モデリング・ラボ.html', manual: '04Structure-Grouping/09構造方程式モデリング/構造方程式モデリング・ラボ_マニュアル.html' },
  'g-theory': { src: '04Structure-Grouping/07一般化可能性理論ラボ/一般化可能性理論ラボ.html', manual: '04Structure-Grouping/07一般化可能性理論ラボ/一般化可能性理論ラボ_マニュアル.html' },
  'irt': { src: '04Structure-Grouping/08項目反応理論ラボ/項目反応理論ラボ.html' },
  'cooccurrence': { src: '01Comparative/04共起ネットワーク比較ラボ/Index.html' },
  'paired-text': { src: '01Comparative/05対応テキストマイニング/Index.html' },
  'classroom-talk': { src: '02Correlation/02授業発話分析ラボ/index.html' },
  'qda': { src: '04Structure-Grouping/05QDA/index.html' },
  'qda-lite': { src: '04Structure-Grouping/06QDA-Lite (全体スクロール対応版)/index.html' },
  'bootstrap': { src: '05Others/01ブートストラップ解析装置/index.html' },
  'meta-analysis': { src: '05Others/02メタ分析ラボ/meta_analysis_lab.html' },
  'form-cleaner': { src: '06Tools/01フォーム整形/index.html', manual: '06Tools/01フォーム整形/フォーム回答整形ラボ_マニュアル.html' },
  'data-cleaning': { src: '06Tools/02データ前処理/データ前処理・クリーニングラボ.html' },
  'missing-data': { src: '06Tools/02データ前処理/欠測データラボ.html' },
  'file-merge': { src: '06Tools/03ファイル統合/index.html' },
  'file-split': { src: '06Tools/04ファイル分割/Index.html' },
  'markdown': { src: '06Tools/05マークダウンエディタ/index.html' },
  'sqs-editor': { src: '06Tools/06マークシート作成読取/SQS_HTML/sqs-source-editor.html' },
  'sqs-reader': { src: '06Tools/06マークシート作成読取/SQS_HTML/markreader.html' },
};

// ツールごとの文字列の置き換え（GAS 向けの文言など）
const PATCHES = {
  'network': [['<span>GASでそのまま公開可</span>', '']],
};

const ROOT = path.resolve(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TOKEN = name => {
  if (/^(bg|surface|surface-2|ink|ink-2|ink-3|line|line-2|line-strong|sans|serif|mono|cat|cat-deep|cat-soft|cat-mid)$/.test(name)) return `var(--al-${name})`;
  return name;
};

function headBlock(tool, withTheme) {
  const theme = THEME[tool.slug] || { vars: {} };
  const vars = Object.entries(theme.vars).map(([k, v]) => `${k}:${TOKEN(v)};`).join('');
  const body = theme.body ? 'body{font-family:var(--al-sans)}' : '';
  const lines = [
    '<!-- データ分析ラボ：共通の書体・配色・バー（scripts/import.js が追加） -->',
    '<link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">',
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap">',
    `<link rel="stylesheet" href="../../assets/${asset('tokens.css')}">`,
    `<link rel="stylesheet" href="../../assets/${asset('app-bar.css')}">`,
    `<style id="al-theme">:root{--al-cat:var(--al-c-${tool.cat});${withTheme ? vars : ''}}${withTheme ? body + (theme.css || '') : ''}</style>`,
  ];
  return lines.join('\n') + '\n';
}

function bar(tool, page) {
  const cat = CATEGORIES.find(c => c.id === tool.cat);
  const links = [];
  if (page !== 'app') links.push('<a class="al-link" href="app.html">ツールを開く</a>');
  links.push('<a class="al-link" href="./">説明</a>');
  if (tool.manual && page !== 'manual') links.push('<a class="al-link" href="manual.html">マニュアル</a>');
  return `<div class="al-bar" role="navigation" aria-label="データ分析ラボ">`
    + `<a class="al-brand" href="../../">${MARK}<span>${esc(SITE.name)}</span></a>`
    + `<span class="al-sep al-s1">/</span><a class="al-crumb" href="../../#${cat.id}">${esc(cat.name)}</a>`
    + `<span class="al-sep">/</span><span class="al-here"><i class="al-dot"></i>${esc(tool.name)}${page === 'manual' ? ' マニュアル' : ''}</span>`
    + `<span class="al-gap"></span>${links.join('')}</div>\n`;
}

function transform(html, tool, page, srcRoot, spec) {
  const warn = [];
  html = html.replace(/^﻿/, '');

  // GAS のテンプレート
  html = html.replace(/<\?!=\s*include\(\s*['"]([^'"]+)['"]\s*\)\s*;?\s*\?>/g, (m, name) => {
    const inc = spec.includes && spec.includes[name];
    if (!inc) { warn.push(`include('${name}') の中身が指定されていない`); return m; }
    return fs.readFileSync(path.join(srcRoot, inc), 'utf8').replace(/^﻿/, '');
  });
  html = html.replace(/<base\s+target=["']_top["']\s*\/?>\s*/gi, '');
  for (const [a, b] of PATCHES[tool.slug] || []) {
    if (page !== 'app') break;
    if (!html.includes(a)) warn.push(`置き換え対象が見つからない: ${a}`);
    html = html.split(a).join(b);
  }
  const left = html.match(/<\?(?!xml)[\s\S]{0,40}/g);
  if (left) warn.push(`GAS のテンプレートが残っている: ${left.join(' | ')}`);

  // <title>
  const title = `${tool.name}${page === 'manual' ? ' マニュアル' : ''} — ${SITE.name}`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  else warn.push('<title> が無い');

  // <head> の末尾に共通の CSS
  const headEnd = html.search(/<\/head>/i);
  if (headEnd < 0) throw new Error(`${tool.slug}: </head> が見つからない`);
  if (!/<meta[^>]+name=["']viewport/i.test(html)) html = html.slice(0, headEnd) + '<meta name="viewport" content="width=device-width, initial-scale=1">\n' + html.slice(headEnd);
  const he = html.search(/<\/head>/i);
  html = html.slice(0, he) + headBlock(tool, page === 'app') + html.slice(he);

  // <head> より後ろで :root を定義していると上書きされるので知らせる
  const afterHead = html.slice(html.search(/<\/head>/i));
  if (page === 'app' && /<style[^>]*>[^<]*:root\s*\{/i.test(afterHead)) warn.push('</head> より後ろの <style> に :root がある');

  // <body> の直後にバー
  const bodyTag = html.match(/<body[^>]*>/i);
  if (!bodyTag) throw new Error(`${tool.slug}: <body> が見つからない`);
  const bi = bodyTag.index + bodyTag[0].length;
  html = html.slice(0, bi) + '\n' + bar(tool, page) + html.slice(bi);

  if (!/^<!doctype html>/i.test(html.trimStart())) warn.push('<!DOCTYPE html> で始まっていない');
  return { html, warn };
}

function main() {
  const [srcRoot, only] = process.argv.slice(2);
  if (!srcRoot) { console.error('使い方: node scripts/import.js <元フォルダ> [slug,...]'); process.exit(1); }
  const pick = only ? new Set(only.split(',')) : null;
  let n = 0;
  for (const tool of TOOLS) {
    if (pick && !pick.has(tool.slug)) continue;
    const spec = SOURCES[tool.slug];
    if (!spec) throw new Error(`${tool.slug}: SOURCES に無い`);
    const dir = path.join(ROOT, 'tools', tool.slug);
    fs.mkdirSync(dir, { recursive: true });

    const app = transform(fs.readFileSync(path.join(srcRoot, spec.src), 'utf8'), tool, 'app', srcRoot, spec);
    fs.writeFileSync(path.join(dir, 'app.html'), app.html, 'utf8');
    let msg = `${tool.slug.padEnd(18)} app ${Math.round(app.html.length / 1024)}KB`;

    if (!!spec.manual !== !!tool.manual) app.warn.push('site-data.js の manual と SOURCES の manual が食い違う');
    if (spec.manual) {
      const man = transform(fs.readFileSync(path.join(srcRoot, spec.manual), 'utf8'), tool, 'manual', srcRoot, spec);
      fs.writeFileSync(path.join(dir, 'manual.html'), man.html, 'utf8');
      msg += `  manual ${Math.round(man.html.length / 1024)}KB`;
      app.warn.push(...man.warn.map(w => 'manual: ' + w));
    }
    console.log(msg);
    for (const w of app.warn) console.log('    ! ' + w);
    n++;
  }
  console.log(`${n} 本を取り込みました`);
}

main();
