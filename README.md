# p-kakao-samabot

> 카카오톡 사마봇

서브 계정을 활용하여 카카오톡 봇을 작성

## 실행

> 기타 환경구성을 참조하여 [docs : DEV_INIT](./docs/DEV_INIT.md) 기본 환경을 구성하기 바랍니다.

- `vscode plugin 설치 : ZipFS`
- `yarn dlx @yarnpkg/sdks vscode`
- `cmd + shift + p` - `typescript ... 타입스크립트 버전선택` - `작업영역 버전 사용`
- `yarn` : 의존성 설치
- `yarn register` : 카카오 계정 등록
- `yarn dev` : 모니터링

## PM2로 실행

> 소스 빌드 후 `yarn node ./bin/app.js`로 실행 하면 됨
> 하지만 node 로 실행 시 pnp 모드를 반영해 줘야 되서 소스 진입점에
> `require("../.pnp.cjs").setup();` 구문을 추가하여 동작하도록 함.
>
> 참조링크 : https://yarnpkg.com/features/pnp#initializing-pnp

- `yarn build` 를 통해 소스 빌드
- 빌드된 `bin/app.js` 내 `"use strict";` 아래 라인에 `require("../.pnp.cjs").setup();` 추가
- `pm2 start`

## 설치 및 기본 환경구성

- [docs : DEV_INIT](./docs/DEV_INIT.md)

## 기타 문제 해결

- [docs : TROUBLE_SHOOTING](./docs/TROUBLE_SHOOTING.md)

## 참조 링크

- [docs : REFERENCE](./docs/REFERENCE.md)
