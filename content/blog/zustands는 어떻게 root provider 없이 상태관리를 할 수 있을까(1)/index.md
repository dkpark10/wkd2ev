---
title: zustands는 어떻게 root provider 없이 상태관리를 할 수 있을까(1)
date: "2024-05-19"
description: "useSyncExternalStore, dai-shi 천재같다."
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

zustand는 observer pattern을 사용한다. 프론트엔드에서 빠질 수 없는 패턴이랴
여기서 listener 함수를 받는데 아래 listener함수가 어디서 왔는지 서술하겠다.

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

처음 컴포넌트가 마운트 되었을 때 subscribe 함수가 호출된다. 그 이후에 상태를 업데이트 할 때 마다 리스너들을 순회하여
리스너 함수를 호출한다. 이렇게 api 객체를 만들어 useSyncExternalStoreWithSelector의 파라미터로 넘긴다.

## useSyncExternalStore

react 18이 릴리즈 되면서 나온 훅이다. 해당 게시글에서 useSyncExternalStore를 깊게 설명할 것은 아니고
어쨌든 해당 훅은 외부 스토어와의 tearing 현상을 막기 위해 리액트 내부와 싱크를 맞추는 훅이다.

[https://www.youtube.com/watch?v=KEDUqA9JeIo](https://www.youtube.com/watch?v=KEDUqA9JeIo)
위 영상에서 useSyncExternalStore를 사용하여 커스텀 상태관리를 만들고 있다.

useSyncExternalStore은 첫번째 인자로 subscribe 함수를 받고 있다. 두번쨰 파라미터로는 해당 상태의 스냅샷을 받는 함수를 받고있다.
여기서 두번쨰 파라미터로 상태 객체를 전달하는게 아닌 함수 형태로 () => state 전달해야 하는데 이는 클로져의 특성을 활용하여
매번 변경되는 state를 반환하기 위함이다. 여기서 중요한 것은 저 listener 함수이다. 
listener 함수는 대체 어디서 넣어주는 것일까?

subscribe 함수에 console.log(listener.name) 를 출력해보면 다음과 같은 함수 이름이 나타난다.

```
handleStoreChange
```

### handleStoreChange

[https://github.com/facebook/react/blob/f74c5ccf9469d3389ce3a1ee3b54988049e235f7/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js#L110](https://github.com/facebook/react/blob/f74c5ccf9469d3389ce3a1ee3b54988049e235f7/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js#L110)

handleStoreChange 해당 함수는 여기서 주입하고 있었다.
zustand는 react에서 제공하는 useState, useReducer 없이도 useSyncExternalStore 훅을 통하여 
subscribe 함수 의존성을 받아서 리액트에서 상태를 관리해주고 있었디.

아래는 useSyncExternalStoreShimClient의 일부를 가져온 것이다.

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

다음 포스트는 필자도 useSyncExternalStore 훅을 통해 커스텀 상태 관리를 구현하는 법을 게시 해보겠다.
또한 useSyncExternalStore훅 이전 zustand3 버전에서는 어떻게 상태 관리를 하는지 알아보겠다.