---
title: type challange <Easy>
date: "2022-11-13"
description: "easy"
---

타입 챌린지 easy를 풀어봅시다...
[https://github.com/type-challenges/type-challenges?tab=readme-ov-file](https://github.com/type-challenges/type-challenges?tab=readme-ov-file)

### Pick 
  
```typescript
// Q
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

// A
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
}
```

타입스크립트에서 기본적으로 제공해주는 유틸리티 타입인 Pick이다.
제너릭의 두번째 인자로 뽑고싶은 속성만 추출한다.
K extends keyof T 는 K가 T 제너릭 타입이 가지고 있는 속성들의 서브타입임을 명시해준다.

### Readonly

```typescript
// Q
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

// A
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key];
}
```

모든 속성을 읽기 속성으로 만들어야 한다.

### FirstofArray

```typescript
// Q
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]
 
type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
type head3 = First<[]> // expected to be never

// A
type First<T extends any[]> = T extends [] ? never : T[0];
```

원소[0] 을 반환하면 될 것 같지만 빈 배열일 경우에도 생각해야 한다.

조건부 연산을 사용하여 제너릭 T가 빈배열의 서브타입일 경우 never를 반환하고
아니라면 0번째 인덱스를 반환해준다.


### Length of Tuple

```typescript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']
 
type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5

type Length<T extends any[]> = T["length"];
```

length 프로퍼티를 이용하여 반환하면 된다. 다만 as const로 타입 단언이 선언되었을 경우
다음과 같이 작성해줘야 한다.

```typescript
const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const;
type TeslaLen = Length<typeof tesla>; <---- ????

type Length<T extends readonly any[]> = T["length"];
```


### Exclude 

```typescript
// Q
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'

// A
type MyExclude<T, U> = T extends U ? never : T;
```

첫 제너릭 속성에는 유니온 타입을 두번쨰 제너릭 인자로 제외하고 싶은 타입을 넣어 
제외시키는 타입이다.

T가 U의 서브타입이라면 never를 반환 

'a' | 'b' | 'c' 중 'a'는 두번째 제너릭으로 들어온 타입 'a'의 서브타입이므로 never를 반환하고 아님 T를 반환한다.

 

### Awaited 

```typescript
// Q
type X = Promise<string>
type Y = Promise<{ field: number }>

// A
type MyAwaited<T> = T extends Promise<infer R> ? R : never;
```

프로미스의 타입을 뽑아내는 문제이다.
infer 키워드를 사용하여 타입을 추출할 수 있다.

하지만 다음과 같이 프로미스가 프로미스를 반환한다면 프로미스가 프로미스를 반환하고 
재귀적으로 프로미스를 반환해줄 경우 재귀적으로 타입을 작성해준다.

```typescript
type Z = MyAwaited<Promise<string | number>>
type Z1 = MyAwaited<Promise<Promise<string | boolean>>>

type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer R> 
  ? R extends Promise<unknown>		// R이 프로미스의의 서브타입이라면
    ? MyAwaited<R>			// 재귀적으로 R을 던짐으로 호출
    : R		// R이 프로미스의 서브타입이 아니라면 R을 반환
  : never; // 모든 케이스에 대응하지 않은 경우 never 반환
```

### IF

```typescript
type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'

type If<C extends boolean, T, F> = C extends true ? T : F;
```

 
### Concat

```typescript
// Q
type Result1 = MyConcat<[], []>
type Result2 = MyConcat<[], [1]>
type Result3 = MyConcat<[1, 2], [3, 4]>
type Result4 = MyConcat<['1', 2, '3'], [false, boolean, '4']>

// A
type MyConcat<T extends any[], U extends any[]> = [...T, ...U];
```

스프레드 연산자로 합쳐주면 된다.

 
### Equal

해당 타입은 문제에 없지만 후에 나올 Include 타입 문제에 쓰이기 때문에 한번 알아본다.
타입이 동등한지를 비교하는 타입이다.

```typescript
interface Person {
  name: string;
  age: number;
}
 
interface Person2 {
  name: string;
  age: number;
}
 
interface OtherType {
  name:string;
  money: number;
}
 
type Result1 = Equals<Person, Person>;  // expected true
type Result2 = Equals<Person, Person2>;  // expected true
type Result3 = Equals<Person2, OtherType>;  // expected false

type Equals<X, Y> = 
  (<T>() => T extends X ? "A" : "B") extends (<T>() => T extends Y ? "A" : "B")
  ? true
  : false;
```

꽤나 신기한 타입이다.
제너릭 T를 받아 해당 타입이 Equals타입의 두 제너릭 타입의 서브 타입인지를 비교하고 또 서로 비교하는 과정을 
통해 true, false를 반환한다. 
 

 
### Include

배열 원소에 타입이 포함되어 있는지를 묻는 문제이다.

```typescript
// Q
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`

// A
type Equal<X, Y> =
  (<T>() => T extends X ? "A" : "B") extends (<T>() => T extends Y ? "A" : "B")
  ? true
  : false;
 
type Includes<T extends readonly any[], U> = T extends [infer First, ...infer Rest] // 제너릭 T 타입은 infer로 타입을 추출 처음 원소와 나머지 원소로 분리한다.
  ? Equal<First, U> extends true	// Equal 타입으로 첫번째 원소와 U를 비교를 하고 true의 서브타입인지 판별한다.
    ? true				// 조건이 맞다면 true를 반환
    : Includes<Rest, U>			// 1에서 판별한 조건이 아니라면 재귀적으로 나머지 배열 원소의 타입들을 넣어주어 재귀적으로 호출한다.
  : false;				// 모든 케이스에 대응 안하는 경우 false를 반환
```


### Push

```typescript
// Q
type Result = Push<[1, 2], '3'> // [1, 2, '3']

// A
type Push<T extends any[], U> = [...T, U];

```

 

### Unshift

```typescript
// Q
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]

// A
type Unshift<T extends any[], U> = [U, ...T];
```
 

### Parameters 

함수의 파라미터를 추출하는 문제다.

```typescript
// Q
const foo = (arg1: string, arg2: number): void => {}
 
type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]

// A
type MyParameters<T extends (...args: any[]) => any> = 
  T extends (...args: infer R) => any
  ? R
  : never;
```

함수의 파라미터 타입을 infer로 추론한다.
제너릭으로 받은 T타입이 함수 형태가 아니라면 never를 반환한다.