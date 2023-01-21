# redash-gas
GASでRedashのクエリを読み込むサンプル
## Summary
- GAS（Google Apps Script）を使ってRedashのクエリよりJSONを取得
- サンプルは、GASをClaspで構築し、Typescriptで作成
- そのままGASで使いたい場合は、redash.tsのソースコードをコピーし、Typescriptの型定義を削除して使用可能

## 注意点
- RedashのHOST名、APIキーは、GASのプロパティスクリプトなどを使ってください
- ハードコートしてしまうと、Github上に公開してしまうリスクがあります

## 使用方法
- GASの設定、[Google Apps Script API](https://script.google.com/home/usersettings)をオンにする
- クローンしたあと、node_modulesをインストール
- root直下に`.clasp.json`を作成と
- 下記のフォーマットで、GASのスクリプトIDとSpreadSheetのIDを入力
```
{"scriptId":"GASのスクリプトIDを入力","rootDir":"./apps-script","parentId":[["SpreadSheetのIDを入力"]]}
```
- RedashのHOST名、APIキーは、GASのスクリプトプロパティなどを使い、サンプルをインスタンス化した際に呼び出す
- 下記サンプルは、スクリプトプロパティにHOSTという名前でRedashのhost、API_KEYという名前でRedashのAPIキーを設定した例
```
const HOST = PropertiesService.getScriptProperties().getProperty("HOST"); // スクリプトプロパティからHOSTを呼び出し
const API_KEY = PropertiesService.getScriptProperties().getProperty("API_KEY"); // スクリプトプロパティからAPIキーを呼び出し
const redash = new Redash(HOST,API_KEY) // Redashのクエリの結果をJSONで受け取るclassをインスタンス化
const getRedash = redash.getRedashJson() // インスタンス化のあと、getRedashJson()で結果をJSONで受け取る
```

## 環境構築（※クローンする場合は、下記は必要ありません。）
前途のとおり、SpreadSheetに紐づくGASでデプロイしていますが、ClaspとTypeScriptで開発しています。
ClaspとTypeScriptの開発環境構築手順は下記となります。

コマンドでnpmパッケージをインストールします。

```
npm init -y
npm install -D @google/clasp
npm install -D @types/google-apps-script
```
下記コマンドを実行すると、ブラウザが起動します。
GASを使いたいGoogleにログインし、その後にGoogleの認証画面が表示されるので許可をします。
```
clasp login
```

続いて、rootパスで下記名前でディレクトリを生成し、このディレクトリ内に開発用のファイルを作成していきます。
```
mkdir apps-script
```
npm initした際にpackege.jsonができているので開きます。
scriptのところを下記のclaspコマンドが使えるようにしておきます。
例えば、ログインした場合のコマンドは、`npm run glogin`というように`npm run`を先頭につけます。
```
  "scripts": {
    "glogin": "clasp login",                                           // googleへのログイン（ログインが切れた場合もこのコマンド）
    "glogout": "clasp logout",　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　// ログアウト
    "gcreate": "clasp create --title 'title' --rootDir ./apps-script", // 最初のファイルを作成するコマンド
    "gclone": "clasp clone xxxxxxx --rootDir ./apps-script",           // 既存のGASをcloneするコマンド xxxxxxのところにscript IDを貼る
    "gpull": "clasp pull",　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　// 紐づくGASからlocalにpullする
    "gpush": "clasp push",                                             // 紐づくGASにpushする
    "gstart": "clasp push --watch"                                     // localファイルが保存されたら、自動で紐づくGASもpushする
  },
 ```
ファイルを最初につくる場合、下記のコマンドを打ちます。2つ目以降はtouchやエディターからで構いません。
```
npm run gcrete
```
選択肢が表示れるので、目的に応じたものをカーソルで選択します。
例えば、SpreadSheetに紐づくGASを作成したい場合は`sheet`を選択、ReactなどでWebアプリを作成した場合は`webapp`を選択します。
```
standalone
docs
sheets
slides
forms
webapp
api
```
`apps-script`ディレクトリの中に`.clasp.json`が作成されているので、root直下に移動します。
これで構築は完了です。

