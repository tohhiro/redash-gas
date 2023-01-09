# redash-gas
Redash APIを使って、GASで取得するサンプルコードです。
claspでTypeScriptで作成しています。IDEからGASにpushした際に自動で.gasにトランスパイルされるので、手元でtscコマンドなどのトランスパイルは不要です。

## claspを導入方法
npm パッケージを導入する

```bash
npm init -y
npm install -D @google/clasp
npm install -D @types/google-apps-script
```

clasp認証する

```bash
clasp login
```

rootにapps-scriptを作成する

```bash
mkdir apps-script
```

pacage.jsonに下記を入力する

```json
"scripts":{
	"glogin": "clasp login",
	"glogout": "clasp logout",
	"gcreate": "clasp create --title 'Your creating project name' --rootDir ./apps-script",
	"gclone": "clasp clone [You want to clone URL] --rootDir ./appps-script",
	"gpull": "clasp pull",
	"gpush": "clasp push",
	"gstart": "clasp push --watch",
	"start": "parcel src/index.html --dist-dir ./apps-script",
	"build": "parcel build src/index.html --dist-dir ./apps-script"
},
```

scriptコマンドで、任意のプラットフォームを選択

```bash
npm run gcreate

standalone ## reactなど
docs
sheets     ## SpreadSheet
slides
forms
webapp
api
```

もし、下記メッセージがターミナルに表示されている場合、Google Drive上にSpreadSheetは作成されていますが、GASの認識ができていません。
その場合、記載のURLにアクセスし、Google Apps Script APIのを有効（オン）にします。
有効にできたら、一度ご自身のGoogle Driveにアクセスし、作成されたSpreadSheetを削除して、再度`npm run gcreate`を実施します。
```bash
User has not enabled the Apps Script API. Enable it by visiting https://script.google.com/home/usersettings then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

apps-scriptの中に.clasp.jsonと、appscript.jsonができているので、.clasp.jsonだけをrootへ移動する。

.gitignoreを作成し、下記をgitの管轄外に設定する

```bash
node_modules
.env
.parcel-cache
```

開発するファイルは、apps-scriptの中に作成していきます。
