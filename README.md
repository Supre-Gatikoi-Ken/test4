# SkyWay Peer Authentication & JavaScript SDK Sample

## Overview

SkyWayの [JavaScript SDK チュートリアル](https://webrtc.ecl.ntt.com/js-tutorial.html) と [skyway-peer-authentication-samples](https://github.com/skyway/skyway-peer-authentication-samples) を、単純につなげたサンプルです。

## Setup

### 1. SkyWayでアプリケーションを作成

- 一部を除いて [JavaScript SDK チュートリアル](https://webrtc.ecl.ntt.com/js-tutorial.html) に従って作成
  - 変更箇所: `権限(APIキー認証を利用する) = ON`

### 2. key の書き換え

- client/script.js
  - apiKey: SkyWayダッシュボード.アプリケーション一覧 で確認できます。
- auth_server/sample.rb
  - SECRET_KEY: SkyWayダッシュボード.アプリケーション一覧 -> 設定変更 で確認できます。

### 3. auth serverのsetup

```bash
cd auth_server
bundle install --path vendor/bundle
```

## Run

### 1. auth server 起動

```bash
# terminal1
cd auth_server
bundle exec ruby sample.rb
```

### 2. client 起動

```bash
# terminal2
cd client
python -m http.server 8000
```

### 3. clientにアクセス

`http://localhost:8000`
