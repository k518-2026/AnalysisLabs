# データ分析ラボ（Analysis Labs）

公開ページ.
https://k518-2026.github.io/AnalysisLabs/

教育・心理・社会調査のデータを、インストール不要・データ送信なしで分析できるツール集です。論文の記述例と、同じ計算を再現する R コードも出力します。

- インストールもアカウント登録も要りません。ブラウザーでページを開けば使えます。
- 計算はブラウザーの中で行われ、入力したデータがサーバーに送られることはありません。
- 出力される記述例や R コードは下書きです。数値と解釈は、研究の文脈と照らし合わせて確かめてください。
- 統計の計算はどれも完璧ではありません。大事な分析では、R・JASP などほかのソフトでも結果を確かめてください。

## ツール一覧（34 本）

### 比べる

群や条件のあいだに差があるかを調べる。

| ツール | できること |
|---|---|
| [データ比較・自動分析](https://k518-2026.github.io/AnalysisLabs/tools/data-compare/) | 2群以上の比較で、正規性に応じた検定を自動で選び、記述統計・図・APA形式の記述まで出す。 |
| [カテゴリ分析](https://k518-2026.github.io/AnalysisLabs/tools/categorical/) | 人数・頻度のデータを、頻度論とベイズ統計の両方で読む。二項検定から対数線形モデルまで7種類。 |
| [カテゴリデータ検定](https://k518-2026.github.io/AnalysisLabs/tools/crosstab-2x2/) | 分割表を入れるだけで、カイ二乗・Fisher・McNemar・二項検定と、ベイズファクター・記述例を出す。 |
| [ノンパラメトリック検定](https://k518-2026.github.io/AnalysisLabs/tools/nonparametric/) | 順位にもとづく検定を、データ入力から論文の記述例・R コードまでひと続きで。 |

### 関係を見る

変数どうし、人どうしのつながりを数値と図にする。

| ツール | できること |
|---|---|
| [相関分析と散布図](https://k518-2026.github.io/AnalysisLabs/tools/correlation/) | 相関行列・散布図・解釈の文章を一度に。正規性に応じて Pearson と Spearman を使い分ける。 |
| [ネットワーク分析ラボ](https://k518-2026.github.io/AnalysisLabs/tools/network/) | 「誰と誰がつながっているか」を貼るだけで、中心性・コミュニティ・構造指標を図と表と解説に。 |

### 説明・予測する

結果を説明する要因を探し、予測や効果の推定を行う。

| ツール | できること |
|---|---|
| [回帰分析・自動判定](https://k518-2026.github.io/AnalysisLabs/tools/regression/) | 目的変数と説明変数の型から、重回帰・ロジスティック回帰・数量化I類／II類を自動で判定する。 |
| [数量化理論](https://k518-2026.github.io/AnalysisLabs/tools/quantification/) | 林知己夫の数量化I類〜IV類。カテゴリーデータで回帰・判別・対応分析・多次元尺度構成を行う。 |
| [質的比較分析（QCA / fsQCA）](https://k518-2026.github.io/AnalysisLabs/tools/qca/) | 少数事例の「条件の組み合わせ」と結果の関係を、真理表と論理式で示す。crisp・多値・ファジィ集合に対応。 |
| [決定木ラボ](https://k518-2026.github.io/AnalysisLabs/tools/decision-tree/) | 分類と回帰の決定木を育て、あたり具合・変数の重要度・ルールを確かめる。 |
| [混合モデルラボ](https://k518-2026.github.io/AnalysisLabs/tools/mixed-model/) | 生徒が学級に、測定が個人に入れ子になったデータを、固定効果とランダム効果に分けて推定する。 |
| [傾向スコアマッチング](https://k518-2026.github.io/AnalysisLabs/tools/propensity-score/) | 観察データで、処置を受けやすさが近い者どうしを組にして、処置の効果を推定する。 |

### 構造と測定

多くの変数の背後にあるまとまりや、測定の精度を調べる。

| ツール | できること |
|---|---|
| [クラスター分析ラボ](https://k518-2026.github.io/AnalysisLabs/tools/cluster/) | 階層的クラスター分析と k-means 法で、似たものどうしをまとめる。樹形図の切断線はドラッグで動く。 |
| [主成分分析ラボ](https://k518-2026.github.io/AnalysisLabs/tools/pca/) | たくさんの変数を少ない軸にまとめ直す。固有値からバイプロット、記述例まで。 |
| [因子分析ラボ](https://k518-2026.github.io/AnalysisLabs/tools/factor/) | 前提の確認、因子数の決定、探索的因子分析、確認的因子分析、記述例と R コードまで。 |
| [構造方程式モデリング・ラボ](https://k518-2026.github.io/AnalysisLabs/tools/sem/) | lavaan と同じ書き方でモデルを組み、推定・パス図・診断・群の比較まで。 |
| [一般化可能性理論ラボ](https://k518-2026.github.io/AnalysisLabs/tools/g-theory/) | 得点のばらつきを人・条件・誤差に分け（G研究）、項目数や評価者数を変えた信頼性を試算する（D研究）。 |
| [項目反応理論ラボ](https://k518-2026.github.io/AnalysisLabs/tools/irt/) | 回答データから、項目の性質と受験者の特性値を同じ物差しで推定する。1PL・2PL・3PL・段階反応モデル。 |

### 質的・テキスト

自由記述・逐語録・インタビューを整理し、語の関係を見る。

| ツール | できること |
|---|---|
| [共起ネットワーク比較ラボ](https://k518-2026.github.io/AnalysisLabs/tools/cooccurrence/) | 2つのテキストの共起ネットワークを描き、共通の語・固有の語を色分けして比べる。 |
| [対応テキストマイニング](https://k518-2026.github.io/AnalysisLabs/tools/paired-text/) | 同じ人の事前・事後の自由記述を ID で突き合わせ、消えた語・現れた語と共起ネットワークを示す。 |
| [授業発話分析ラボ](https://k518-2026.github.io/AnalysisLabs/tools/classroom-talk/) | 授業の逐語録から、フランダース相互作用分析・発問の分類・IRF 連鎖・語彙を数えて見せる。 |
| [QDA ワークベンチ](https://k518-2026.github.io/AnalysisLabs/tools/qda/) | インタビューや自由記述のコーディングから、カテゴリー化、行列、図、ストーリーラインまで。 |
| [SCAT分析ラボ](https://k518-2026.github.io/AnalysisLabs/tools/scat/) | 大谷尚の SCAT の分析フォームで、4ステップのコーディングからストーリー・ライン、理論記述までを進める。 |
| [QDA-Lite](https://k518-2026.github.io/AnalysisLabs/tools/qda-lite/) | テキストにコードを付けて、対象者ごとに集計する軽量版。感情辞書による抽出も。 |

### 推定を統合する

再標本化や複数研究の統合で、推定の確かさを見る。

| ツール | できること |
|---|---|
| [ブートストラップ解析](https://k518-2026.github.io/AnalysisLabs/tools/bootstrap/) | データを復元抽出で繰り返し、平均値・中央値・標準偏差・相関係数の信頼区間を経験的に求める。 |
| [メタ分析ラボ](https://k518-2026.github.io/AnalysisLabs/tools/meta-analysis/) | 複数の研究の効果量をそろえて統合し、森林プロット・異質性・出版バイアスを吟味する。 |

### データの準備

分析の前後に必要な、整形・前処理・ファイル操作・調査票づくり。

| ツール | できること |
|---|---|
| [フォーム回答整形ラボ](https://k518-2026.github.io/AnalysisLabs/tools/form-cleaner/) | Google フォーム・Microsoft Forms の回答 CSV を、分析用の CSV と対応表に整える。 |
| [データ前処理・クリーニングラボ](https://k518-2026.github.io/AnalysisLabs/tools/data-cleaning/) | 横持ち⇄縦持ち、逆転項目と合成得点、外れ値、再コード、データの結合までを1画面で。 |
| [欠測データラボ](https://k518-2026.github.io/AnalysisLabs/tools/missing-data/) | 欠測の地図とパターン、MCAR の検討、多重代入と Rubin の規則による統合まで。 |
| [ファイル統合](https://k518-2026.github.io/AnalysisLabs/tools/file-merge/) | PDF・Excel・Word・テキストを種類ごとに自動で振り分けて、1つのファイルに結合する。 |
| [ファイル分割](https://k518-2026.github.io/AnalysisLabs/tools/file-split/) | Excel はシートごと、PDF はページごとに分けて、ZIP でまとめて保存する。 |
| [Markdown Studio](https://k518-2026.github.io/AnalysisLabs/tools/markdown/) | Markdown を書きながらプレビューし、HTML・Word・PDF に書き出す。 |
| [SQS ソースエディタ Web](https://k518-2026.github.io/AnalysisLabs/tools/sqs-editor/) | マークシート式の調査票を作り、印刷用の PDF を組む。SQS の編集ソフトのブラウザー版。 |
| [SQS マーク読み取り](https://k518-2026.github.io/AnalysisLabs/tools/sqs-reader/) | スキャンした調査票の画像からマークを読み取り、集計用の CSV を作る。 |

## フォルダーの構成

| パス | 中身 |
|---|---|
| `index.html` | トップページ（ツールの一覧） |
| `tools/<名前>/index.html` | ツールの説明ページ |
| `tools/<名前>/app.html` | ツール本体（1ファイルで動く HTML） |
| `tools/<名前>/manual.html` | マニュアル（あるツールのみ） |
| `assets/` | 共通の配色・書体（`tokens.css`）、ツール画面の上部バー（`app-bar.css`）、トップと説明ページの CSS（`site.css`） |
| `scripts/` | ページを作るスクリプト |

## ページの作り直し

Node.js が必要です（外部パッケージは使いません）。

```
node scripts/import.js <ツールの元フォルダー>   # ツール本体を取り込み、共通の配色とバーを付けて app.html にする
node scripts/build.js                        # トップページ・説明ページ・README を作る
```

- ツールの説明文とカテゴリは `scripts/site-data.js`、ツールごとの配色の割り当ては `scripts/theme-map.js` にあります。
- `import.js` はツールの計算処理には手を入れません。Google Apps Script 用のテンプレート（`<?!= include() ?>`）を展開し、共通の CSS とバーを足すだけです。

## 外部のライブラリ

一部のツールは、実行時に次のライブラリを CDN から読み込みます（データは送信されません）。
jStat、Plotly、D3.js、kuromoji.js（高精度の形態素解析を選んだときの辞書を含む）、marked、html2pdf.js、pdf-lib、SheetJS、JSZip、docx など。
書体は Google Fonts（Noto Sans JP、Noto Serif JP、JetBrains Mono）を使っています。

「SQS ソースエディタ Web」「SQS マーク読み取り」は、Apache License 2.0 で公開されている SQS（Shared Questionnaire System）の SourceEditor と MarkReader を、ブラウザーで動くように作り直したものです。

## ライセンス

MIT License（`LICENSE.txt`）。Copyright (c) 2026 K.Yamamoto
