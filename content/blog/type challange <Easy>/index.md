---
title: type challange <Easy>
date: "2022-11-13"
description: "easy라 재밌는 것 같습니다.."
---

타입 챌린지 easy를 풀어봅시다...
[https://github.com/type-challenges/type-challenges?tab=readme-ov-file](https://github.com/type-challenges/type-challenges?tab=readme-ov-file)

## Pick 
  
```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}
 
type TodoPreview = MyPick<Todo, 'title' | 'completed'>
 
const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

타입스크립트에서 기본적으로 제공해주는 유틸리티 타입인 Pick이다.
제너릭의 두번째 인자로 뽑고싶은 속성만 추출한다.

```typescript
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
}
```

K extends keyof T 는 K가 T 제너릭 타입이 가지고 있는 속성들의 서브타입임을 명시해준다.

## Readonly

```typescript
interface Todo {
  title: string
  description: string
}
 
const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}
 
todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

모든 속성을 읽기 속성으로 만들어야 한다.

```typescript
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key];
}
```

## FirstofArray

```typescript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]
 
type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
type head3 = First<[]> // expected to be never
```

원소[0] 을 반환하면 될 것 같지만 빈 배열일 경우에도 생각해야 한다.


```typescript
type First<T extends any[]> = T extends [] ? never : T[0];
```

조건부 연산을 사용하여 제너릭 T가 빈배열의 서브타입일 경우 never를 반환하고
아니라면 0번째 인덱스를 반환해준다.


## Length of Tuple

```typescript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']
 
type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5

type Length<T extends any[]> = T["length"];
```

length 프로퍼티를 이용하여 반환하면 되겠습니다. 다만 as const로 타입 단언이 선언되었을 경우
다음과 같이 작성해줘야 합니다.

```typescript
const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const;
type TeslaLen = Length<typeof tesla>; <---- ????

type Length<T extends readonly any[]> = T["length"];
```