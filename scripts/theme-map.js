// 各ツールがもともと持っている CSS 変数を、共通の配色（assets/tokens.css）に割り当てる表。
// 紙面・カード・文字・罫線・書体と、画面の主なアクセント色だけを置き換える。
// グラフの系列色など意味を持つ色（頻度論／ベイズ、処置群／対照群など）はツールのまま残す。
//
// 値の書き方
//   'bg' 'surface' 'surface-2' 'ink' 'ink-2' 'ink-3' 'line' 'line-2' 'line-strong'
//   'sans' 'serif' 'mono'  'cat' 'cat-deep' 'cat-soft' 'cat-mid'
//   それ以外の文字列は CSS の値としてそのまま使う

const T = {
  'data-compare': { vars: { '--bg': 'bg', '--surface': 'surface', '--text-main': 'ink', '--text-muted': 'ink-2', '--border': 'line', '--primary': 'cat', '--primary-hover': 'cat-deep' }, body: true },
  'categorical': { vars: { '--paper': 'bg', '--paper-raised': 'surface', '--ink': 'ink', '--ink-soft': 'ink-2', '--line': 'line', '--line-soft': 'line-2' }, body: true },
  'crosstab-2x2': { vars: { '--bg': 'bg', '--paper': 'surface', '--text': 'ink', '--text-light': 'ink-3', '--border': 'line', '--primary': 'cat-deep', '--accent': 'cat' }, body: true },
  'nonparametric': { vars: { '--bg': 'bg', '--panel': 'surface', '--ink': 'ink', '--ink-soft': 'ink-2', '--line': 'line', '--teal': 'cat', '--teal-soft': 'cat-soft', '--sans': 'sans', '--mono': 'mono' } },
  'correlation': { vars: { '--bg-color': 'bg', '--card-bg': 'surface', '--text-main': 'ink', '--text-muted': 'ink-2', '--border': 'line', '--primary': 'cat', '--primary-hover': 'cat-deep' }, body: true },
  'network': { vars: { '--paper': 'bg', '--card': 'surface', '--ink': 'ink', '--ink-soft': 'ink-2', '--ink-faint': 'ink-3', '--rule': 'line', '--teal': 'cat', '--teal-deep': 'cat-deep', '--teal-wash': 'cat-soft', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'regression': { vars: { '--bg': 'bg', '--card-bg': 'surface', '--primary': 'ink', '--secondary': 'ink-2', '--accent': 'cat', '--accent-hover': 'cat-deep' }, body: true },
  'quantification': { vars: { '--paper': 'bg', '--panel': 'surface', '--ink': 'ink', '--sub': 'ink-2', '--line': 'line-2', '--line-strong': 'line', '--sans': 'sans', '--serif': 'serif', '--mono': 'mono' } },
  'qca': { vars: { '--paper': 'bg', '--panel': 'surface', '--ink': 'ink', '--ink-soft': 'ink-2', '--line': 'line', '--accent': 'cat', '--accent-soft': 'cat-soft', '--sans': 'sans', '--disp': 'sans', '--mono': 'mono' } },
  'decision-tree': { vars: { '--paper': 'bg', '--paper2': 'surface-2', '--card': 'surface', '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--line': 'line', '--line2': 'line-2', '--moss': 'cat', '--moss-d': 'cat-deep', '--moss-l': 'cat-soft', '--display': 'serif', '--body': 'sans', '--mono': 'mono' } },
  'mixed-model': { vars: { '--paper': 'bg', '--card': 'surface', '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--rule': 'line', '--grid': 'line-2', '--sans': 'sans', '--mono': 'mono' } },
  'propensity-score': { vars: { '--paper': 'bg', '--surface': 'surface', '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--ink4': 'line-strong', '--rule': 'line', '--hair': 'line-2', '--gothic': 'sans', '--mincho': 'serif', '--serif': 'serif', '--mono': 'mono' } },
  'cluster': { vars: { '--paper': 'bg', '--panel': 'surface', '--ink': 'ink', '--muted': 'ink-2', '--rule': 'line', '--rule-soft': 'line-2', '--teal': 'cat', '--teal-soft': 'cat-soft', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'pca': { vars: { '--paper': 'bg', '--card': 'surface', '--sel': 'surface-2', '--ink': 'ink', '--ink-2': 'ink-2', '--mute': 'ink-3', '--rule': 'line', '--rule-2': 'line-2', '--font-disp': 'serif', '--font-ui': 'sans', '--font-num': 'mono' } },
  'factor': { vars: { '--bg': 'bg', '--paper': 'surface', '--paper-2': 'surface-2', '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--line': 'line', '--line2': 'line-2', '--deep': 'cat', '--deep2': 'cat-mid', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'sem': { vars: { '--paper': 'bg', '--panel': 'surface', '--panel2': 'surface-2', '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--line': 'line', '--line2': 'line-2', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'g-theory': { vars: { '--paper': 'bg', '--card': 'surface', '--ink': 'ink', '--soft': 'ink-2', '--faint': 'ink-3', '--line': 'line', '--line2': 'line-2', '--ac': 'cat', '--disp': 'sans', '--body': 'sans', '--mono': 'mono' }, css: 'body{background:var(--al-bg)}' },
  'irt': { vars: { '--paper': 'bg', '--surface': 'surface', '--surface-2': 'surface-2', '--ink': 'ink', '--ink-2': 'ink-2', '--ink-3': 'ink-3', '--line': 'line', '--line-2': 'line-strong', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'cooccurrence': { vars: { '--paper': 'bg', '--paper-deep': 'surface-2', '--panel': 'surface', '--ink': 'ink', '--ink-soft': 'ink-2', '--line': 'line-2', '--display': 'sans', '--body': 'sans', '--mono': 'mono' } },
  'paired-text': { vars: { '--paper': 'bg', '--surface': 'surface', '--ink': 'ink', '--muted': 'ink-2', '--line': 'line' }, body: true },
  'classroom-talk': { vars: { '--paper': 'bg', '--card': 'surface', '--ink': 'ink', '--ink-soft': 'ink-2', '--muted': 'ink-3', '--rule': 'line', '--rule-2': 'line-2', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'qda': { vars: { '--paper': 'bg', '--card': 'surface', '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--rule': 'line', '--rule2': 'line-2', '--indigo': 'cat', '--indigo-d': 'cat-deep', '--indigo-l': 'cat-soft', '--serif': 'serif', '--sans': 'sans', '--mono': 'mono' } },
  'qda-lite': { vars: { '--primary': 'cat-deep', '--secondary': 'cat', '--accent': 'cat', '--bg-main': 'bg', '--bg-panel': 'surface', '--text-main': 'ink', '--text-muted': 'ink-2', '--border': 'line' }, body: true },
  'bootstrap': { vars: { '--paper': 'bg', '--paper-deep': 'surface-2', '--ink': 'ink', '--ink-soft': 'ink-2', '--ink-faint': 'ink-3', '--border': 'line', '--border-strong': 'line-strong', '--pine': 'cat', '--pine-deep': 'cat-deep', '--pine-soft': 'cat-soft', '--pine-soft2': 'cat-mid', '--serif': 'serif', '--sans': 'sans', '--mono': 'mono' } },
  'meta-analysis': { vars: { '--paper': 'bg', '--card': 'surface', '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--rule': 'line', '--rule2': 'line-2', '--green': 'cat-deep', '--green-l': 'cat', '--green-w': 'cat-soft', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' },
    // PDF の読み取りは Claude 上でしか動かないので、公開版では隠して案内を出す
    css: '.card:has(#drop){display:none} div:has(> #outcome){display:none}' },
  'form-cleaner': { vars: { '--paper': 'bg', '--paper-2': 'surface-2', '--card': 'surface', '--ink': 'ink', '--ink-2': 'ink-2', '--ink-3': 'ink-3', '--rule': 'line', '--gothic': 'sans', '--mono': 'mono' } },
  'data-cleaning': { vars: { '--bg': 'bg', '--paper': 'surface', '--ink': 'ink', '--ink-2': 'ink-2', '--muted': 'ink-3', '--accent': 'cat', '--accent-soft': 'cat-soft', '--line': 'line-2', '--line-2': 'line', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'missing-data': { vars: { '--bg': 'bg', '--paper': 'surface', '--ink': 'ink', '--ink-2': 'ink-2', '--muted': 'ink-3', '--line': 'line-2', '--line-2': 'line', '--mincho': 'serif', '--gothic': 'sans', '--mono': 'mono' } },
  'file-merge': { vars: {}, body: true },
  'file-split': { vars: { '--bg': 'bg', '--text': 'ink', '--border': 'line', '--primary': 'cat', '--primary-hover': 'cat-deep' }, body: true },
  // 画面いっぱいの高さで組んでいるツールは、上のバーの分だけ高さを減らす
  'markdown': { vars: { '--bg-app': 'bg', '--bg-panel': 'surface', '--border-color': 'line', '--text-main': 'ink', '--text-muted': 'ink-2', '--accent': 'cat', '--accent-hover': 'cat-deep' }, body: true,
    css: 'body{height:calc(100vh - var(--al-bar-h))}' },
  'sqs-editor': { vars: { '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--shell': 'bg', '--shell2': 'surface-2', '--line': 'line', '--line2': 'line-2', '--blue': 'cat', '--blue2': 'cat', '--blue3': 'cat-mid', '--blue4': 'cat-soft', '--sans': 'sans', '--mincho': 'serif', '--mono': 'mono' },
    css: 'html{box-sizing:border-box}' },
  'sqs-reader': { vars: { '--ink': 'ink', '--ink2': 'ink-2', '--ink3': 'ink-3', '--shell': 'bg', '--shell2': 'surface-2', '--line': 'line', '--line2': 'line-2', '--blue': 'cat', '--blue2': 'cat', '--blue3': 'cat-mid', '--blue4': 'cat-soft', '--sans': 'sans', '--mincho': 'serif', '--mono': 'mono' },
    css: 'html{box-sizing:border-box}' },
};

module.exports = T;
