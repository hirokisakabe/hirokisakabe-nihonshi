# hirokisakabe-nihonshi

個人用の日本史年表 Web サイト。`data/events.yml` を編集して、古代〜現代のイベントを時系列で俯瞰する。

## 基本フロー

イベントを増やすときは、以下のループを回す。

1. **追加 / 編集**: `data/events.yml` にイベントを追記、または既存のイベントを編集する。
2. **検証**: `npm run validate` で zod スキーマを通す。
3. **commit**: 検証が通ったら git commit する。
4. **デプロイ**: `main` ブランチに push すると Vercel が自動的に再ビルドして公開する。

ローカルで見た目を確認したいときは `npm run dev` を起動して http://localhost:5173/ を開く。

## ローカル開発コマンド

| コマンド            | 役割                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| `npm install`       | 依存をインストール                                                   |
| `npm run dev`       | Vite dev server を起動して年表を表示                                 |
| `npm run validate`  | `data/events.yml` を zod スキーマで検証 (不正データがあれば exit 1) |
| `npm run lint`      | ESLint で TypeScript / React コードを検査                            |
| `npm run build`     | `validate` (zod 検証) → `tsc --noEmit` の型チェック → Vite のプロダクションビルドを順に実行 |
| `npm run preview`   | `dist/` の中身をローカルで確認                                       |

## イベントのフィールド

`data/events.yml` は次の構造を持つ。

```yaml
events:
  - id: taika-reform        # kebab-case の一意識別子
    date: "0645"             # YYYY / YYYY-MM / YYYY-MM-DD のいずれか (文字列で記述)
    title: 大化の改新        # タイトル
    category: 政治           # 政治 / 文化 / 経済 / 戦乱 / 外交 / 災害
    importance: 5            # 1〜5 の整数 (大きいほど重要)
    description: ...         # 説明 (任意)
```

- `date` は YAML が数値として解釈しないよう **クオートで括る**。`0645` のように先頭が 0 の場合は特に注意する。
- `id` は他のイベントと重複してはならない。`npm run validate` が重複を検出する。
- `category` は固定の 6 種類。新しいカテゴリを足したい場合は `src/schema.ts` の `Categories` も更新する。

## 技術スタック

- [Vite](https://vitejs.dev/) + React + TypeScript
- [zod](https://github.com/colinhacks/zod) による YAML データの型検証
- [js-yaml](https://github.com/nodeca/js-yaml) で YAML をパース
- [Vercel](https://vercel.com/) で `main` ブランチを自動デプロイ

## デプロイ (Vercel)

GitHub リポジトリを Vercel プロジェクトに接続するだけで、`main` への push が自動的に本番デプロイになる。Vercel は Vite を自動検出するため、`vercel.json` は不要。Build Command が `npm run build`、Output Directory が `dist` になっていることだけ確認する。
