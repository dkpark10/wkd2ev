---
title: qa 과정에서 깃헙페이지에 멀티 페이지 배포 워크 플로우 작성해보기
date: "2024-11-20"
description: "with react"
---

회사마다 다르겠지만 사내에서 신규 기능이나 버그를 수정하고 다시 피드백을 받는 과정은 간략하게 다음과 같다.

![배포과정](./deploy-before.png)

ci/cd 에서 빌드 후 eks에 태그를 푸시하는 과정이 반드시 소요된다.

1px 수정이나 개발자가 놓친것이 있어 빠르게 확인해야 할 때 또는 ssr이나 서버의 실행이 필요없는 정적 기능일 때 
eks 푸시 과정을 생략하여 깃헙페이지로 정적 배포 빠르게 피드백을 받아 아래와 같이 효율성을 개선하고 싶었다.

![배포과정](./deploy-after.png)

실제로 사내에서 배포되고 있는 브랜치의 폴더 구조이다. pr 별로 구별하여 정적페이지를 확인하도록 했다.

![real](./real.png)

하나의 서비스에 여러 개발자가 따로 작업하고 있을 수 있기에 Pr 단위로 멀티 페이지를 배포 스크립트를 작성했다. 

예제는 spa 라이브러리 react를 이용했다.

## 링크
[https://github.com/dkpark10/action-test/tree/master/apps/react](https://github.com/dkpark10/action-test/tree/master/apps/react)

[https://github.com/dkpark10/action-test/blob/master/.github/workflows/page-deploy.yaml](https://github.com/dkpark10/action-test/blob/master/.github/workflows/page-deploy.yaml)

[https://dkpark10.github.io/action-test/pr-3/ 에제 페이지](https://dkpark10.github.io/action-test/pr-3/)

## 배포 스크립트
```shell
name: 'deploy-github-page'

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize

  workflow_dispatch:

jobs:
  deploy-page:
    concurrency: ci-${{ github.ref }} #https://github.com/JamesIves/github-pages-deploy-action

    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm i --frozen-lockfile

      - name: Build
        run: pnpm --filter=github-action-test-react build
        env:
          PUBLIC_PATH: /${{ github.event.repository.name }}/pr-${{ github.event.number }}/

      - name: Move Pr Folder
        run: |
          mkdir -p pr-${{ github.event.number }}
          mv page/* pr-${{ github.event.number }}
          cp -r pr-${{ github.event.number }} page

      - name: Deploy page
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: page
          clean: false

      - name: Show Page Info
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          message: |
            > :rocket: Deployed page of ${{ github.event.pull_request.head.sha }}
              https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}/pr/${{ github.event.number }}
```

작업자의 pr단위로 페이지를 구성하려면 다음과 같은 설정이 필요하다.

```shell
- name: Build
  run: pnpm --filter=github-action-test-react build
  env:
    PUBLIC_PATH: /${{ github.event.repository.name }}/pr-${{ github.event.number }}/
```

빌드 스크립트는 프로젝트 마다 다를 것이므로 여기서 봐야 할것은 PUBLIC_PATH의 환경변수 설정이다.

깃헙 페이지 url 세그먼트는 커스텀 도메인을 사용하지 않는다면 아래와 같은 구조를 띄울 것이다.

```shell
https://{userId}.github.io/{repository-name}/**
```

레포지터리 이름의 마지막 path parameter에 작업자들의 pr단위를 github context에서 제공하는 변수로 생성한다.
여기서 임시로 pr의 넘버링을 붙혔지만 다른 경로로 생성해도 된다.

깃헙 페이지 배포 하기위해서는 해당 라이브러리를 사용 할 것이다. 
JamesIves/github-pages-deploy-action@v4 

[https://github.com/JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action)

```shell
- name: Move Pr Folder
  run: |
    mkdir -p pr-${{ github.event.number }}  // 배포될 폴더를 생성
    mv page/* pr-${{ github.event.number }}   // 빌드 에셋이 들어 있는 page폴더를 이전 생성한 폴더로 이동
    cp -r pr-${{ github.event.number }} page  // 복사

- name: Deploy page
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    folder: page
    clean: false
```

빌드된 에셋이 들어있는 폴더는 page로 설정 배포시 브랜치의 파일들을 보존하기 위해 clean을 비활성화한다.
이렇게 된다면 깃헙페이지 배포 브랜치에 폴더 구조 설정은 다 끝났다.

## SPA 설정

이제 빌드타임에 호출할 에셋들의 prefix 경로와 런타임 때 경로도 설정해야 한다.
그렇지 않다면 깃헙 페이지는 리소스를 찾지 못해 404를 반환한다.

여기서 base에 변수를 설정했으면 vite는 알아서 import.meta.env.BASE_URL 변수도 자동으로 변경해준다.

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],

    base: process.env.PUBLIC_PATH, // base 속성에는 앞서 ci/cd에서 설정한 환경 변수의 경로를 넣어준다.

    build: {
      outDir: path.resolve(__dirname, '../../page'),
    },
  });
};
```

이제 이를 실제로 확인하기 위해서는 런타임때 라우터 경로를 해당 페이지 구조에 맞게 변경해줘야 한다.
react-router-dom 의 createBrowserRouter api를 사용해서 라우터를 생성했다.

```javascript
const router = createBrowserRouter([
  {
    path: import.meta.env.BASE_URL,
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'sample',
        element: <Sample />,
      },
    ],
  },
]);
```

서비스가 단일페이지가 아닐경우 링크를 클릭 시 링크의 주소도 prefix를 설정해줘야 하는데. 아래와 같이 커스텀 링크를 만들어서 해결했다.

```javascript
import { Link } from 'react-router-dom';

export default function PrefixLink({
  prefix = import.meta.env.BASE_URL || '',
  to,
  children,
}) {
  return <Link to={prefix + to}>{children}</Link>;
}
```

위 예제는 간략하게 작성된 배포 스크립트이다 실제 실무에서는 서버의 api를 받아 호출할 수 없으므로 msw로 브라우저 api를 모킹하여
배포하여야 한다.