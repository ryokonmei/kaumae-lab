# 買う前ラボ

Cloudflare Pagesで公開する静的サイトです。公開URLは https://kaumae-lab.pages.dev/ です。

## 現在の公開ファイルと検証

**公開対象は `public/` だけです。** ルート直下の `index.html`・`styles.css`・`script.js` は初期の試作で、現在の公開ファイルではありません。

- `public/index.html`: ページ一覧・Google所有権確認タグ
- `public/signature-m750/index.html`: M750
- `public/iphone-se3/index.html`: iPhone SE3
- `public/daily-nuts-cranberry/index.html`: ナッツ
- `public/ipad-os/index.html`: iPad対応表
- `public/404.html`: 不明なURLを404として返すために必要
- `public/sitemap.xml`: 公開5ページの正規URL
- `public/robots.txt`: クロール許可・サイトマップの場所

変更前後に、次を実行してください。Node.js以外の依存はありません。

```sh
node --test scripts/audit-site.test.mjs
node scripts/audit-site.mjs
```

GitHubへpushし、Cloudflareのデプロイ後に公開内容も検査します。

```sh
node scripts/audit-site.mjs --live
```

この検査は、正規URL・検索除外設定・サイトマップとの一致・トップからの到達性・ローカル参照先・公開内容との一致・404・転送を確認します。Googlebot名のアクセスは本物のGooglebotの接続を再現するものではありません。Googleの通常クロール、検索登録、Search Consoleの割り当て量は、この検査では確認・解除できません。

iPad表のデータを編集した場合は、先に `node scripts/render-ipad-table.mjs` を実行します。

以下は初期試作時のメモです。現在の公開ファイルは上記を参照してください。

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
