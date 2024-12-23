---
title: 타입 세이프하게 api를 호출해보기
date: "2024-05-04"
description: "오버 엔지니어링인 감이 없지 않아 있다."
---

최근 사내에서 서비스 개발 시 type safe하게 api를 호출할 수 있어 좋았던 경험이 있다. 
이를 좀 더 개선하여 간략하게 개발할 수 있도록 작성해 보았다.

## URL 구조

```
https://example.com/content/1?start=0&end=10
```

URL 구조는 다음과 같이 분리할 수 있다.

|내용|설명|
|---|---|
|https|프로토콜|
|example.com|도메인|
|content/1|경로|
|?start=0&end=10|쿼리스트링|

아무래도 회사마다 개발자마다 다르겠지만 기본적으로
baseUrl은 프로토콜과 도메인 까지는 기본 설정으로 주입하고 사용될 것이다.

```typescript
import axios from 'axios';
import got from 'got';

const axiosInstance = axios.create({
  baseURL: 'https://example.com'
});

const gotClient = got.extend({
  url: 'https://example.com',
});
```

예를 들어 호출해야 하는 api 주소가 아래와 같다고 해보자.
해당 api는 유저가 입력한 키워드의 보여줄 게시글들을 반환하는데 키워드가 있고
정렬 타입이 있으며 pagination 이 적용되어 있다.

```
https://example.com/search/?keyword=맛집&order=desc&start=0&end=10
```

이를 호출한다면 다음과 같을 것이다.

```typescript
await axios.get(
    `https://example.com/search/?keyword=${keyword}&order=${order}&start=${start}&end=${end}`
  );
```

그렇지만 api엔드포인트의 수정사항이 들어왔을 때 해당 api를 사용하는 쪽에 일괄 수정이 필요할 것이다.
사실 이렇게 호출하는 방법이 좋지 않은 것을 알고 있을 것이다. 

변경에 취약하기에 한번 함수로 감싸주는 것만으로 원할한 해결이 가능하다. 함수로 감싼다면 수정해야할 
관리 포인트를 하나로 집중할 수 있으니까

```typescript
async function getKeywordContents(
  keyword: string, order: 'desc' | 'asec', start: number, end: number) {

  return await axios.get(
    `https://example.com/search/?keyword=${keyword}&order=${order}&start=${start}&end=${end}`
  );
}
```

사실 api 호출 코드는 처음 프로젝트를 작성할 때 말고는 수정사항이 빈번한 영역이라고 보기는 힘들다.
다만 처음 작성할 때 수정사항에 대응 하여 좀 더 수월하게 개발 할 수 있다면 더 좋을 것이다.

## 적용

*endpoint.ts*
```typescript
type UpperMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

type LowerMethod = Lowercase<UpperMethod>;

type Method = UpperMethod | LowerMethod;

type EndPoint = 'search';

type QueryParams = {
  [Key in EndPoint]: Key extends 'search'
    ? {
        keyword: string;
        start: number;
        end: number;
      }
    : {
        [key: string]: any;
      };
};
```

*index.ts*

```typescript
import { Client, type Response } from './client';
import type { Method, QueryParams, EndPoint } from '../endpoint';

export default class ApiClient<
  Url extends EndPoint,
  Data extends any = any,
  Body extends Record<string, any> = any,
> extends Client {
  private url: URL;

  private body: Body;

  private method: Method = 'get';
  
  private headers: Record<string, any> = {};

  constructor() {
    super();
  }

  public setUrl(url: Url) {
    try {
      this.url = new URL(`${this.baseURL}/${url}`);
      return this;
    } catch (error) {
      console.error('URL error', error);
    }
  }

  public setMethod<M extends Method = 'get'>(method: M) {
    this.method = method;
    return this;
  }

  public setQuery<K extends keyof QueryParams[Url]>(
    key: K,
    value: QueryParams[Url][typeof key]
  ) {
    if (!this.url) throw new Error('url이 설정되어 있지 않습니다.');

    this.url.searchParams.set(String(key), String(value));
    return this;
  }

  public setBody(body: Body) {
    this.body = body;
    return this;
  }

  public async retrieve(): Promise<Response<Data>> {
    const reqData = this.transform<Body>({
      url: this.url,
      method: this.method,
      body: this.body,
      headers: this.headers,
    });
    return await this.instance<Data>(reqData).then((res) => this.response(res));
  }
}
```

*client.ts*

```typescript
import axios, {
  AxiosResponse,
  type AxiosInstance,
  AxiosRequestConfig,
} from 'axios';
import type { Method } from '../types';

const baseURL = 'https://example.com';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

export interface Request<Body> {
  url: URL;
  method: Method;
  body?: Body;
  headers?: Record<string, any>;
}

export interface Response<D> {
  status: number;
  data: D;
}

export abstract class Client {
  protected baseURL = baseURL;

  protected instance: AxiosInstance;

  constructor() {
    this.instance = axiosInstance;
  }

  protected response<Data>(response: AxiosResponse<Data>): Response<Data> {
    const { status, data } = response;
    return { status, data };
  }

  protected transform<Body>({ url, method, body }: Request<Body>): AxiosRequestConfig {
    return {
      url: url.href,
      method,
      data: body,
    };
  }
}
```


굳이 이렇게 까지 작성해야 하나 싶지만 처음 신경써서 작성한다면 클러이언트 호출 시 type safe하게 호출하여
DX가 좋았다. 사용하는 쪽에서 자동완성으로 편하게 호출할 수 있다.

![type-safe한 api 호출](./type-safe.png)

타입을 잘못 지정할 경우 에러를 뱉을 수 있다.

![type-unsafe한 api 호출](./type-unsafe.png)
