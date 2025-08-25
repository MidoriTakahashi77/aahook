# 🎯 aahook

![npm](https://img.shields.io/npm/dw/aahook)   <!-- 週ごとのDL数 -->
![npm](https://img.shields.io/npm/dm/aahook)   <!-- 月ごとのDL数 -->
![npm](https://img.shields.io/npm/dt/aahook)   <!-- 累計DL数 -->

コマンドの成功・失敗時にASCIIアートを表示！ターミナルをもっと楽しく、表現豊かに。

```bash
# npxやbunxでインストール不要で使用
npx aahook git push    # 成功時にドラゴンアートを表示 🐲
bunx aahook npm test   # 結果に応じて成功/エラーアートを表示 ✨
```

## ✨ 機能

- 🎨 コマンドの成功/失敗に応じてカスタムASCIIアートを表示
- 🌈 **新機能: カラーテーマ** - ASCIIアートに美しい色を適用
- 📥 コミュニティリポジトリからASCIIアートをブラウズ・インストール
- 🌐 GitHub経由でのアート共有 - Pull Requestで貢献
- ⚡ 依存関係ゼロ、軽量で高速
- 🔧 JSONによる簡単な設定
- 📦 シンプルなnpmインストール
- 🎯 カスタマイズ可能なアートファイル
- 🔍 インストール前のアートプレビュー

## 📦 インストール

### 🚀 インストール不要（推奨）
```bash
# npxを使用
npx aahook <command>

# bunxを使用
bunx aahook <command>
```

### オプション：グローバルインストール
<details>
<summary>グローバルインストールを希望する場合...</summary>

#### npmを使用
```bash
npm install -g aahook
```

#### Bunを使用
```bash
bun add -g aahook

# PATHに追加（初回のみ）
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```
</details>

## 🚀 クイックスタート

1. **aahookを初期化:**
```bash
npx aahook init
# または
bunx aahook init
```

2. **ASCIIアート付きでコマンドを実行:**
```bash
# npxを使用
npx aahook ls        # 成功時に猫アートを表示 🐱
npx aahook git push  # 成功時にドラゴンアートを表示 🐲
npx aahook npm test  # 成功/エラーアートを表示 ✨/💥

# bunxを使用（高速）
bunx aahook ls
bunx aahook git push
bunx aahook npm test
```

## 📝 使い方

### 基本コマンド

```bash
npx aahook <command>     # コマンドを実行してASCIIアートを表示
npx aahook init          # aahookの設定を初期化
npx aahook list          # 設定されたフックを一覧表示
npx aahook --help        # ヘルプメッセージを表示
npx aahook --version     # バージョンを表示
```

### ASCIIアート管理

```bash
# リポジトリ内の利用可能なアートをブラウズ
npx aahook browse

# インストール前にアートをプレビュー
npx aahook preview animals/cat --remote

# リポジトリからアートをインストール
npx aahook install animals/cat
npx aahook install celebrations/party --auto-config

# インストール済みアートを表示
npx aahook gallery
npx aahook gallery --category animals --limit 5

# インストール済みアートをプレビュー
npx aahook preview cat
```

### 🌈 カラーテーマ（新機能！）

```bash
# 利用可能なカラーテーマを一覧表示
npx aahook colorize --list-themes

# ASCIIアートにカラーテーマを適用
npx aahook colorize cat --theme rainbow
npx aahook colorize dragon --theme neon
npx aahook colorize party --theme fire

# カラー版を保存
npx aahook colorize cat --theme ocean --save

# カスタムテーマを使用
npx aahook colorize cat --custom ./my-theme.json

# 利用可能な組み込みテーマ:
# - rainbow: 各行にカラフルなグラデーション
# - neon: 明るいサイバーパンクカラー
# - ocean: クールな青色トーン
# - fire: 暖かい赤とオレンジ
# - retro: クラシックな緑色ターミナル
```

#### カスタムテーマの作成

独自のカラーテーマを作成できます！詳細は[テーマ作成ガイド](docs/CREATE_THEME.md)（英語）をご覧ください。

簡単な例 - `~/.aahook/themes/my-theme.json`を作成:
```json
{
  "name": "my-theme",
  "version": "1.0.0",
  "colors": {
    "mode": "line",
    "rules": [
      {
        "match": { "start": 0, "end": 0 },
        "color": { "fg": "#FF6B6B" }
      }
    ]
  }
}
```

使用方法:
```bash
npx aahook colorize cat --theme my-theme
```

**カラーモード**:
- `line`: 行単位で色付け（グラデーション向き）
- `pattern`: パターンマッチで色付け（正規表現対応）
- `character`: 特定文字を色付け
- `region`: 領域指定で色付け

### 実用例

```bash
# 開発ワークフロー
npx aahook npm test          # テストを視覚的フィードバック付きで実行
bunx aahook npm run build    # ビルドを成功アニメーション付きで実行
npx aahook git push          # コードをドラゴンの祝福と共にプッシュ

# ファイル操作
bunx aahook ls -la           # ファイル一覧を猫アート付きで表示
npx aahook rm temp.txt       # フィードバック付きで削除

# クイックエイリアス（.zshrc/.bashrcに追加）
alias aa="npx aahook"        # 使用例: aa npm test
alias aab="bunx aahook"      # 使用例: aab git push
```

## ⚙️ 設定

設定は `~/.aahook/config.json` に保存されます：

```json
{
  "version": "0.1.0",
  "hooks": {
    "git push": {
      "success": "dragon.txt",
      "error": "error.txt"
    },
    "ls": {
      "success": "cat.txt"
    },
    "npm test": {
      "success": "success.txt",
      "error": "error.txt"
    }
  }
}
```

## 🎯 カスタムアート

### 方法1：リポジトリからインストール

```bash
# 利用可能なアートをブラウズ
npx aahook browse

# 特定のアートをインストール
npx aahook install animals/cat
npx aahook install developer/deploy --auto-config
```

### 方法2：独自作成

1. `~/.aahook/arts/` にASCIIアートファイルを作成
2. `~/.aahook/config.json` を更新してアートを使用：

```json
{
  "hooks": {
    "your-command": {
      "success": "your-art.txt",
      "error": "your-error-art.txt"
    }
  }
}
```

### 方法3：リポジトリに貢献

1. [aahookリポジトリ](https://github.com/MidoriTakahashi77/aahook)をフォーク
2. `arts/<category>/<name>.txt` にアートを追加
3. `arts/<category>/META.json` にアートのメタデータを更新
4. Pull Requestを送信してコミュニティと共有！

## 🎨 利用可能なASCIIアート

### すべての利用可能なアートをブラウズ

```bash
npx aahook browse  # リポジトリ内のすべての利用可能なアートを表示
```

### カテゴリー

- 🐾 **動物 (Animals)**: 猫、犬など
- 🎉 **お祝い (Celebrations)**: 成功、パーティーテーマ
- 💻 **開発者 (Developer)**: ドラゴン、デプロイ、コーディングテーマ
- 😊 **感情 (Emotions)**: 喜び、驚き、エラー表現

### アート例

#### 猫 (animals/cat)
```
🐱 完了！ 🐱
   /\_/\  
  ( o.o ) 
   > ^ <
```

#### ドラゴン (developer/dragon)
```
🐲 プッシュ成功！ 🐲
     /|   /|  
    ( :v:  )
     |(_)|
  コードがリポジトリに飛んでいく！
```

#### パーティー (celebrations/party)
```
🎉 お祝いしよう！ 🎉
     \o/
      |
     / \
   *紙吹雪*
```

## 📁 ファイル構造

```
~/.aahook/
├── config.json       # フック設定
└── arts/            # ASCIIアートファイル
    ├── success.txt
    ├── error.txt
    ├── dragon.txt
    └── cat.txt
```

## 🧪 開発

```bash
# リポジトリをクローン
git clone https://github.com/MidoriTakahashi77/aahook.git
cd aahook

# 依存関係をインストール（いずれかを選択）
npm install
bun install

# TypeScriptをビルド
npm run build
bun run build

# テストを実行
npm test
bun test

# 公開せずにローカルでテスト
npm link          # その後: aahook <command>
# または直接テスト
node bin/aahook.js --version
```

## 🤝 貢献

貢献を歓迎します！以下の手順でお願いします：

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを開く

### ASCIIアートの貢献

新しいASCIIアートを追加するには：

1. `arts/<category>/<name>.txt` にアートファイルを作成
2. `arts/<category>/META.json` にメタデータを追加
3. `npm run generate-index` でインデックスを更新
4. Pull Requestを送信

## 📄 ライセンス

MITライセンス - プロジェクトで自由にお使いください！

## 🌟 サポート

このツールが便利だと思ったら、GitHubでスターをつけていただけると嬉しいです！

---

楽しいターミナルを愛する開発者のために ❤️ で作られました