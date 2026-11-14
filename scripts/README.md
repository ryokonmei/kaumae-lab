# iPad table publishing

After changing `public/ipad-os/table.js`, run:

```sh
node scripts/render-ipad-table.mjs
```

Commit the generated `public/ipad-os/index.html` together with the source changes.
The generated table is visible without JavaScript and uses the same renderer as the interactive page.
