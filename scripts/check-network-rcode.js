// ネットワーク分析ラボ：画面の数値と、「Rコード」タブが出す R コードの数値が一致するかを確かめる。
//
//   node scripts/check-network-rcode.js
//
// やること：
//   1. tools/network/app.html の <script> を、ダミーの画面（何を呼んでも黙って受ける）の中で読み込み、
//      ツール自身の関数（buildGraph / analyze / renderR）で、画面の値と R コードを作る。
//   2. その R コードを Rscript で実行し、各行の値を取り出す。
//   3. 画面の値と比べる。
// 必要なもの：R と igraph。Rscript の場所は環境変数 RSCRIPT で指定できる（既定は JASP 同梱の R）。
// 注意：Louvain 法は実行ごとに変わりうるため、Q は「コード内の tool_membership で計算した値」を画面と比べる。

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'tools', 'network', 'app.html');
const RSCRIPT = process.env.RSCRIPT || 'C:\\Program Files\\JASP\\R\\bin\\x64\\Rscript.exe';
const RLIBS = process.env.R_LIBS || '';

// ---- 1. app.html の script を読み込む -----------------------------------------
const html = fs.readFileSync(APP, 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/);
if (!m) throw new Error('app.html の <script> が見つかりません');
let src = m[1];
// renderR が作った R コードを取り出す
const hook = '$("#copyR").addEventListener("click",()=>copyText(code));';
if (!src.includes(hook)) throw new Error('renderR の目印が見つかりません（app.html の書き方が変わった）');
src = src.replace(hook, 'globalThis.__CODE=code;');

const dummy = new Proxy(function () {}, {
  get: (t, p) => (p === Symbol.toPrimitive ? () => '' : dummy),
  apply: () => dummy,
  construct: () => dummy,
  set: () => true,
});
const ctx = vm.createContext({
  document: dummy, window: dummy, console, setTimeout: () => 0, clearTimeout: () => 0,
  requestAnimationFrame: () => 0, cancelAnimationFrame: () => 0, navigator: dummy, localStorage: dummy,
  URL: dummy, Blob: dummy, getComputedStyle: () => dummy, ResizeObserver: function () { return dummy; },
  Float64Array, Int32Array, Uint8Array, Math, Number, Map, Set, Array, Object, String, JSON, Infinity, parseFloat,
});
try { vm.runInContext(src, ctx); } catch (e) { /* 画面の初期化で止まっても、関数は読み込まれている */ }

function screenAndCode(text, opt, fmt) {
  const call = `
    (function(){
      const raw = ${fmt === 'matrix' ? 'parseMatrix' : 'parseEdgeList'}(${JSON.stringify(text)}, ${JSON.stringify(opt)});
      G = buildGraph(raw.edges, ${JSON.stringify(opt)}, raw.isolates);
      R = analyze(G);
      renderR();
      return {code: globalThis.__CODE, global: R.global, rows: R.rows.map(r => ({name:r.name, degree:r.degree, betweenness:r.betweenness,
        closeness:r.closeness, eigen:r.eigen, pagerank:r.pagerank, clustering:r.clustering, constraint:r.constraint, community:r.community}))};
    })()`;
  return vm.runInContext(call, ctx);
}

// ---- 2. 例データ ------------------------------------------------------------
const grab = name => {
  const mm = src.match(new RegExp('const ' + name + '=`([\\s\\S]*?)`;'));
  if (!mm) throw new Error(name + ' が見つかりません');
  return mm[1];
};
const SAMPLE_A = grab('SAMPLE_A');
const SAMPLE_B = grab('SAMPLE_B');
const CASES = [
  { name: '例A（有向・重みなし）', text: SAMPLE_A, opt: { directed: true, weighted: false, header: false } },
  { name: '例A（無向・重みなし）', text: SAMPLE_A, opt: { directed: false, weighted: false, header: false } },
  { name: '例B（無向・重み付き）', text: SAMPLE_B, opt: { directed: false, weighted: true, header: false } },
  { name: '例B（有向・重み付き）', text: SAMPLE_B, opt: { directed: true, weighted: true, header: false } },
  { name: '隣接行列（無向・重みなし）', fmt: 'matrix', opt: { directed: false, weighted: false, header: false },
    text: ',a,b,c,d,e\na,0,1,1,0,0\nb,1,0,1,0,0\nc,1,1,0,1,0\nd,0,0,1,0,1\ne,0,0,0,1,0\nf,0,0,0,0,0' },
];

// ---- 3. R で実行して、ラベル付きの値を取り出す -----------------------------------
const R_TAIL = `
.exprs <- parse(text = readLines(code_file, encoding = "UTF-8"))
.vals <- list()
for (.e in .exprs) {
  .w <- withVisible(eval(.e, globalenv()))
  .d <- paste(deparse(.e), collapse = " ")
  if (.w$visible) .vals[[length(.vals) + 1]] <- list(label = .d, value = .w$value)
}
.find <- function(pat) { for (.v in .vals) if (grepl(pat, .v$label, fixed = TRUE)) return(.v$value); NA }
.num <- function(x) if (is.numeric(x)) as.numeric(x)[1] else NA
out <- list(
  density = .num(.find("edge_density")),
  avgDeg = .num(.find("ecount(g)/vcount(g)")),
  avgDegUnd = .num(.find("mean(degree(g))")),
  components = .num(.find("components(g)$no")),
  avgPath = .num(.find("mean_distance")),
  diameter = .num(.find("diameter(g")),
  transitivity = .num(.find('transitivity(g, type = "global")')),
  centralization = .num(.find("centr_degree")),
  reciprocity = .num(.find("reciprocity(g)")),
  assortativity = .num(.find("cor(c(d_und")),
  assortativityUnd = .num(.find("assortativity_degree(g)")),
  modularityTool = .num(.find("modularity(u, tool_membership)"))
)
res <- get("res", globalenv())
cat("@@GLOBAL\\n")
for (k in names(out)) cat(k, format(out[[k]], digits = 10), "\\n")
cat("@@ROWS\\n")
write.table(res, sep = "\\t", quote = FALSE, row.names = FALSE)
`;

function runR(code, dir) {
  const codeFile = path.join(dir, 'gen.R');
  fs.writeFileSync(codeFile, code.replace(/^\s*plot\([\s\S]*$/m, '') + '\n', 'utf8'); // 描画は除く
  fs.writeFileSync(path.join(dir, 'run.R'), `code_file <- "${codeFile.replace(/\\/g, '/')}"\nsuppressMessages(library(igraph))\n` + R_TAIL, 'utf8');
  const env = { ...process.env };
  if (RLIBS) env.R_LIBS = RLIBS;
  const r = spawnSync(RSCRIPT, [path.join(dir, 'run.R')], { cwd: dir, encoding: 'utf8', env });
  if (r.status !== 0) throw new Error('R が失敗: ' + (r.stderr || '').slice(-600));
  return r.stdout;
}

function parseOut(stdout) {
  const [, g, rows] = stdout.split(/@@GLOBAL\r?\n|@@ROWS\r?\n/);
  const global = {};
  g.trim().split(/\r?\n/).forEach(l => { const [k, v] = l.trim().split(/\s+/); global[k] = parseFloat(v); });
  const lines = rows.trim().split(/\r?\n/);
  const head = lines[0].split('\t');
  const table = lines.slice(1).map(l => { const c = l.split('\t'); const o = {}; head.forEach((h, i) => { o[h] = c[i]; }); return o; });
  return { global, table };
}

// ---- 4. 比べる --------------------------------------------------------------
const TOL = 5e-4;
let bad = 0;
const near = (a, b) => (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) <= TOL * Math.max(1, Math.abs(b));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'netcheck-'));

for (const c of CASES) {
  const { code, global: sg, rows } = screenAndCode(c.text, c.opt, c.fmt);
  const out = parseOut(runR(code, dir));
  const rg = out.global;
  const directed = c.opt.directed;
  const pairs = [
    ['密度', sg.density, rg.density],
    ['平均次数', sg.avgDeg, directed ? rg.avgDeg : rg.avgDegUnd],
    ['連結成分', sg.components, rg.components],
    ['平均経路長', sg.avgPath, rg.avgPath],
    ['直径', sg.diameter, rg.diameter],
    ['推移性', sg.transitivity, rg.transitivity],
    ['次数中心化', sg.centralization, rg.centralization],
    ['次数の同類性', sg.assortativity === null ? NaN : sg.assortativity, directed ? rg.assortativity : rg.assortativityUnd],
    ['Q（tool_membership）', sg.modularity, rg.modularityTool],
  ];
  if (directed) pairs.push(['相互性', sg.reciprocity, rg.reciprocity]);
  const msgs = [];
  for (const [k, a, b] of pairs) if (!near(a, b)) msgs.push(`  × ${k}: 画面 ${a} / R ${b}`);
  const avgCC = rows.reduce((s, r) => s + r.clustering, 0) / rows.length;
  if (!near(avgCC, out.table.reduce((s, r) => s + parseFloat(r.clustering), 0) / out.table.length)) msgs.push('  × 平均クラスター係数');
  const byName = Object.fromEntries(out.table.map(r => [r.name, r]));
  const cols = [['betweenness', 'betweenness'], ['closeness', 'closeness'], ['eigen', 'eigen'], ['pagerank', 'pagerank'], ['clustering', 'clustering'], ['constraint', 'constraint']];
  for (const [sk, rk] of cols) {
    let worst = 0, who = '';
    for (const r of rows) {
      const a = r[sk], b = parseFloat(byName[r.name][rk]);
      if (Number.isNaN(a) && Number.isNaN(b)) continue;
      const d = Math.abs(a - b);
      if (d > worst) { worst = d; who = r.name; }
    }
    if (worst > TOL) msgs.push(`  × 個人の ${sk}: 最大差 ${worst.toFixed(4)}（${who}）`);
  }
  console.log((msgs.length ? '不一致  ' : '一致    ') + c.name);
  msgs.forEach(s => console.log(s));
  bad += msgs.length;
}
console.log(bad ? `\n不一致 ${bad} 件` : '\nすべて一致');
process.exit(bad ? 1 : 0);
