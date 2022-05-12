# DEV_INIT

## NODEJS 설치

https://nodejs.org/ko/

## YARN 설치

- `npm install -g yarn`

## YARN BERRY 설정

(프로젝트 폴더 진입 후)

- `yarn set version berry`
- `yarn init`

## PM2 설치

- `yarn global add pm2`

## typescript 설정

- `yarn add @types/node`
- `yarn add dotenv`
- `yarn add @types/dotenv`
- `yarn add typescript`
- `yarn add axios`
- `yarn add node-kakao`
- 기타 등등 필요한 의존성 추가
- `yarn add -D ts-node`
- `yarn tsc --init --rootDir src --outDir ./bin --esModuleInterop --lib es2015 --module commonjs --noImplicitAny true`

> typescript 의존성 vscode 인식처리

- `yarn dlx @yarnpkg/sdks vscode`

## VSCODE 확장(Extentions) 설치

- ZipFS - a zip file system

## package.json

아래 내용 추가

```json
"scripts": {
    "build": "tsc",
    "start": "node ./bin/app.js",
    "dev": "ts-node ./src/app.ts"
  },
```

`yarn build` : 소스 컴파일
`yarn start` : 빌드 된 소스 실행
`yarn dev` : 컴파일 없이 ts 소스 바로 실행
