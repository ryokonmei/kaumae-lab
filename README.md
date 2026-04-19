# 買う前ラボ affiliate prototype

検証型の商品紹介・アフィリエイトサイトの最初の1ページです。

## ファイル

- `index.html`: スマホ縦スワイプ型の比較LP
- `styles.css`: デザイン
- `script.js`: 現在表示パネルの検知
- `CONTENT_PLAN.md`: サイト構成・運用・注意点
- `GENRE_DECISION.md`: ジャンル選定とドメイン方針

## ローカル確認

`index.html` をブラウザで開けば確認できます。

## 公開先のおすすめ

ジャンル未定でも長く育てるなら、汎用ブランド名の独自ドメインを取るのはありです。迷う場合は Cloudflare Pages の `*.pages.dev` で先に公開できます。

ドメインを取る場合の第一候補は `kaumae-lab.com` です。Cloudflare Registrarで空き状況を確認してください。

公開の流れ:

1. GitHubにこのフォルダをリポジトリとして置く。
2. Cloudflareのダッシュボードで Workers & Pages を開く。
3. Pages projectを作り、GitHubリポジトリを接続する。
4. Framework presetはNone、Build commandは空、Output directoryは `public` にする。
5. デプロイ後、`https://<project-name>.pages.dev` で確認する。
6. 独自ドメインを取った場合は、Pages projectのCustom domainsから追加する。

ReactやAPIを後から足したくなったら、Cloudflare Workers Static Assetsに移行して `*.workers.dev` で公開する方法もあります。

## 次にやること

- Cloudflare Registrarで `kaumae-lab.com` などの空き状況を確認する。
- 最初のジャンルは「小型ガジェット・充電まわり」から1テーマ選ぶ。
- 楽天アフィリエイトで実際の商品リンクを作成し、`index.html` の仮リンクを差し替える。
- 商品画像は楽天アフィリエイトのリンク作成ページで許可されている方法だけを使う。
- 実測していない情報には「公開情報ベース」と書く。
- 参考にした検証記事は、短い要約と出典リンクで扱う。
- ファーストビューの広告表記は消さない。
