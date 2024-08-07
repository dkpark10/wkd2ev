---
title: zustands는 어떻게 root provider 없이 상태관리를 할 수 있을까(1)
date: "2024-05-19"
description: "useSyncExternalStore"
---

redux, recoil과는 다르게 zustand는 어떻게 root provider 없이 상태관리를 하는지 
궁금했다.

아래는 리덕스 공식문서 튜토리얼에서 가져온 예제이다.
[https://ko.redux.js.org/tutorials/fundamentals/part-5-ui-react/#passing-the-store-with-provider](https://ko.redux.js.org/tutorials/fundamentals/part-5-ui-react/#passing-the-store-with-provider)

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'

ReactDOM.render(
  // Render a `<Provider>` around the entire `<App>`,
  // and pass the Redux store to as a prop
  <React.StrictMode>
    <Provider store={store}> <-------------------------- provider
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

아래는 recoil 예제이다.
[https://recoiljs.org/ko/docs/introduction/getting-started](https://recoiljs.org/ko/docs/introduction/getting-started)

```javascript
import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

function App() {
  return (
    <RecoilRoot>      <-------------------------- provider
      <CharacterCounter />
    </RecoilRoot>
  );
}
```

이렇듯 전역상태 라이브러리는 앱의 최상단에 위치하여 상태를 관리한다.
[https://www.slash.page/ko/libraries/react/use-overlay/src/useOverlay.i18n](https://www.slash.page/ko/libraries/react/use-overlay/src/useOverlay.i18n)
toss에서 만든 modal을 선언적으로 관리하기 위한 훅도 최상단에서 모달을 관리한다. 아래는 useOverlay의 root provider 코드이다.

```javascript
/** @tossdocs-ignore */
import React, { createContext, PropsWithChildren, ReactNode, useCallback, useMemo, useState } from 'react';

export const OverlayContext = createContext<{
  mount(id: string, element: ReactNode): void;
  unmount(id: string): void;
} | null>(null);
if (process.env.NODE_ENV !== 'production') {
  OverlayContext.displayName = 'OverlayContext';
}

export function OverlayProvider({ children }: PropsWithChildren) {
  const [overlayById, setOverlayById] = useState<Map<string, ReactNode>>(new Map()); // <------- 여기서 모달 관리

  const mount = useCallback((id: string, element: ReactNode) => {
    setOverlayById(overlayById => {
      const cloned = new Map(overlayById);
      cloned.set(id, element);
      return cloned;
    });
  }, []);

  const unmount = useCallback((id: string) => {
    setOverlayById(overlayById => {
      const cloned = new Map(overlayById);
      cloned.delete(id);
      return cloned;
    });
  }, []);

  const context = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <OverlayContext.Provider value={context}>
      {children}
      {[...overlayById.entries()].map(([id, element]) => (
        <React.Fragment key={id}>{element}</React.Fragment>
      ))}
    </OverlayContext.Provider>
  );
}
```

이렇듯 전역으로 상태를 관리 하기 위해서는 최상단 루트 컴포넌트에 상태를 선언하고 이를 children으로 받아서 관리해주고 있다.
그러나 zustand는 root provider 없이 바로 컴포넌트에서 바로 사용할 수 있다. 이는 어떻게 가능한 것인가.

## zustand 코드 파헤쳐 보기

핵심 로직은 생각보다 간단했다. 코드라인도 길지 않았다. 먼저 사용법은 다음과 같다.

```javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))
```

아래는 zustand의 타입과 불필요한 코드를 제거한 가져온 핵심 코드들이다.

```javascript
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector'
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports

const createStore = (createState) => {
  let state
  const listeners = new Set()

  const setState = (partial, replace) => {
    // TODO: Remove type assertion once https://github.com/microsoft/TypeScript/issues/37663 is resolved
    // https://github.com/microsoft/TypeScript/issues/37663#issuecomment-759728342
    const nextState =
      typeof partial === 'function'
        ? partial(state)
        : partial
    if (!Object.is(nextState, state)) {
      const previousState = state
      state =
        replace ?? (typeof nextState !== 'object' || nextState === null)
          ? nextState
          : Object.assign({}, state, nextState)
      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState = () => state

  const getInitialState = () => initialState

  const subscribe = (listener) => {
    listeners.add(listener)
    // Unsubscribe
    return () => listeners.delete(listener)
  }

  const destroy = () => {
    listeners.clear()
  }

  const api = { setState, getState, getInitialState, subscribe, destroy }
  const initialState = (state = createState(setState, getState, api))
  return api;
}

export function useStore(
  api,
  selector,
  equalityFn?,
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn,
  )
  return slice
}

const createImpl = (createState) => {
  const api =
    typeof createState === 'function' ? createStore(createState) : createState

  const useBoundStore = (selector, equalityFn) =>
    useStore(api, selector, equalityFn)

  Object.assign(useBoundStore, api)

  return useBoundStore
}

export const create = ((createState) => createState ? createImpl(createState) : createImpl);
```

정말이지 이게 끝이다. 물론 기타 타입코드와 여러가지가 다른 코드가 존재하지만 핵심은 이것이다.
먼저 createStore의 코드를 살펴보자.

zustand는 **Observer Pattern**을 사용한다. 프론트엔드에서 빠질 수 없는 패턴이랴
여기서 listener 함수를 받는데 아래 *listener* 함수가 어디서 왔는지 서술하겠다.

```javascript
const setState = (partial, replace) => {
  const nextState = 생략;
  listeners.forEach((listener) => listener(state, previousState))
}

const getState = () => state

const getInitialState = () => initialState

const subscribe = (listener) => {
  listeners.add(listener)
  // Unsubscribe
  return () => listeners.delete(listener)
  }
```

처음 컴포넌트가 마운트 되었을 때 subscribe 함수가 호출된다. 그 이후에 상태를 업데이트 할 때 해당 파라미터가 콜백인지 아닌지
확인하고 다음 값을 갱신한 후에 리스너들을 순회하여 리스너 함수를 호출한다. 
이렇게 api 객체를 만들어 **useSyncExternalStoreWithSelector** 의 파라미터로 넘긴다.

## useSyncExternalStore

react 18이 릴리즈 되면서 나온 훅이다. 해당 게시글에서 **useSyncExternalStore** 를 자세히 설명할 것은 아니고
해당 훅은 외부 스토어의 tearing 현상을 막기 위해 리액트 내부와 싱크를 맞추는 훅이다.

[https://www.youtube.com/watch?v=KEDUqA9JeIo](https://www.youtube.com/watch?v=KEDUqA9JeIo)
위 영상에서 useSyncExternalStore를 사용하여 커스텀 상태관리를 만들고 있다.

**useSyncExternalStore** 은 첫번째 인자로 subscribe 함수를 받고 있다. 두번쨰 파라미터로는 해당 상태의 스냅샷을 받는 함수를 받고있다.
여기서 두번쨰 파라미터로 상태 객체를 전달하는게 아닌 함수 형태로 () => state 전달해야 하는데 이는 클로져의 특성을 활용하여
매번 변경되는 state를 반환하기 위함이다. 여기서 중요한 것은 저 listener 함수이다. 
listener 함수는 대체 어디서 넣어주는 것일까?

subscribe 함수에 console.log(listener.name) 를 출력해보면 다음과 같은 함수 이름이 나타난다.

> handleStoreChange

### handleStoreChange

[https://github.com/facebook/react/blob/f74c5ccf9469d3389ce3a1ee3b54988049e235f7/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js#L110](https://github.com/facebook/react/blob/f74c5ccf9469d3389ce3a1ee3b54988049e235f7/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js#L110)

**handleStoreChange** 해당 함수는 여기서 주입하고 있었다.
zustand는 react에서 제공하는 useState, useReducer 없이도 **useSyncExternalStore** 훅을 통하여 
subscribe 함수 의존성을 받아서 리액트에서 상태를 관리해주고 있었디.

아래는 **useSyncExternalStoreShimClient** 의 일부를 가져온 것이다.

```javascript
const [{inst}, forceUpdate] = useState({inst: {value, getSnapshot}});

useEffect(() => {
    // Check for changes right before subscribing. Subsequent changes will be
    // detected in the subscription handler.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({inst});
    }
    const handleStoreChange = () => {
      // TODO: Because there is no cross-renderer API for batching updates, it's
      // up to the consumer of this library to wrap their subscription event
      // with unstable_batchedUpdates. Should we try to detect when this isn't
      // the case and print a warning in development?

      // The store changed. Check if the snapshot changed since the last time we
      // read from the store.
      if (checkIfSnapshotChanged(inst)) {
        // Force a re-render.
        forceUpdate({inst}); <----------------------------------- 상태 업데이트 코드
      }
    };
    // Subscribe to the store and return a clean-up function.
    return subscribe(handleStoreChange);
  }, [subscribe]);
```


## 직접 구현해보기

이제 zustand를 참고하여 직접 커스텀 상태관리를 구현해보자. **useSyncExternalStore** 를 사용한다면 아주 간단한 상태관리를 구현할 수 있을 것이다.
상태 관리는 리액트에 위임하고 개발자는 그저 subscribe 함수와 상태 업데이트 시 리스너들을 호출해주면 될 것이다.

최종적으로 createStore 함수로 초기 상태값을 받고 반환받은 값을 컴포넌트의 훅형태로 쓸 수 있도록 할 것이다.

```javascript
import { useCallback, useSyncExternalStore } from 'react';

const createStore = (initialState) => {
  let state = initialState;

  const getState = () => state;

  const listeners = new Set();

  const setState = (fn) => {
    state = fn(state);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
};


const useStore = (store, selector) => {
  const slice = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector])
  );

  return [slice, store.setState];
};
```

정말이지 간단하게 만들었다. zustand 로직보다는 간단하지만 결국 핵심 패턴은 옵저버 패턴을 이용한 **useSyncExternalStore** 훅 사용에 있다.
여기서 **useSyncExternalStore** 두번쨰 인자로 상태의 스냅샷을 사용하는 쪽에서 selector로 select할 수 있도록 했다.
store와 selector를 의존성으로 받아 불필요한 리렌더링이 발생하지 않도록 **useCallback** 으로 감싸주었다.

잘 되는지 테스트를 작성해보자.

```javascript
test('형제간 상태 공유', () => {
  const store = createStore({ count: 0 });

  function Brother1() {
    const [count, setState] = useStore(store, (state) => state.count);

    return (
      <React.Fragment>
        <button
          onClick={() => {
            setState((prev) => ({ count: prev.count + 1 }));
          }}
        >
          inc
        </button>
        <button
          onClick={() => {
            setState((prev) => ({ count: prev.count - 1 }));
          }}
        >
          dec
        </button>
        <h1 data-testid="brother1">value: {count}</h1>
      </React.Fragment>
    );
  }

  function Brother2() {
    const [count] = useStore(store, (state) => state.count);

    return (
      <React.Fragment>
        <h1 data-testid="brother2">value: {count}</h1>
      </React.Fragment>
    );
  }

  function Parent() {
    return (
      <React.Fragment>
        <Brother1 />
        <Brother2 />
      </React.Fragment>
    );
  }

  const { getByText, getByTestId } = render(<Parent />);
  fireEvent.click(getByText('inc'));
  expect(getByTestId('brother1').textContent).toBe('value: 1');
  expect(getByTestId('brother2').textContent).toBe('value: 1');

  fireEvent.click(getByText('dec'));
  expect(getByTestId('brother1').textContent).toBe('value: 0');
  expect(getByTestId('brother2').textContent).toBe('value: 0');
});
```

잘 통과된다.

![test](./test.png)

다음 포스트는 **useSyncExternalStore** 훅 이전 zustand3 버전에서는 어떻게 상태 관리를 하는지 알아보겠다.