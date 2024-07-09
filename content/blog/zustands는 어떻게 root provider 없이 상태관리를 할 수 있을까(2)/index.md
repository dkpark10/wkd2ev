---
title: zustands는 어떻게 root provider 없이 상태관리를 할 수 있을까(2)
date: "2024-05-20"
description: "useReducer"
---

zustand4 버전은 **useSyncExternalStore** 로 상태관리를 리액트에 위임했다.
그렇다면 **useSyncExternalStore** 훅 이전 zustand3 버전은 어떻게 상태를 관리 했을까?

다음은 zustand3 버전 타입을 제거한 간략한 코드이다. 역시 이 또한 4버전과 크게 다르지 않는데 구독 발행 패턴을
이용하여 상태를 관리하고 있다. 크게 눈에 띄는 것은 상태는 ref로 관리하고
 **useReducer**를 활용한 forceUpdate이다.

```javascript
function createStore(createState) {
  let state;
  const listeners = new Set()

  const setState = (partial, replace) => {
    // TODO: Remove type assertion once https://github.com/microsoft/TypeScript/issues/37663 is resolved
    // https://github.com/microsoft/TypeScript/issues/37663#issuecomment-759728342
    const nextState =
      typeof partial === 'function'
        ? partial(state)
        : partial
    if (nextState !== state) {
      const previousState = state
      state = replace
        ? nextState
        : Object.assign({}, state, nextState)
      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState = () => state

  const subscribeWithSelector = (
    listener,
    selector = getState,
    equalityFn = Object.is
  ) => {
    console.warn('[DEPRECATED] Please use `subscribeWithSelector` middleware')
    let currentSlice = selector(state)
    function listenerToAdd() {
      const nextSlice = selector(state)
      if (!equalityFn(currentSlice, nextSlice)) {
        const previousSlice = currentSlice
        listener((currentSlice = nextSlice), previousSlice)
      }
    }
    listeners.add(listenerToAdd)
    // Unsubscribe
    return () => listeners.delete(listenerToAdd)
  }

  const subscribe = (
    listener,
    selector,
    equalityFn
  ) => {
    if (selector || equalityFn) {
      return subscribeWithSelector(
        listener,
        selector,
        equalityFn
      )
    }
    listeners.add(listener)
    // Unsubscribe
    return () => listeners.delete(listener)
  }

  const destroy = () => listeners.clear()
  const api = { setState, getState, subscribe, destroy }
  state = createState(
    setState,
    getState,
    api,
  )
  return api;
}

function create(createState) {
  const api = typeof createState === 'function' ? createStore(createState) : createState;

  const useStore = (
    selector = api.getState,
    equalityFn = Object.is
  ) => {
    const [, forceUpdate] = useReducer((c) => c + 1, 0); <------------------ forceUpdate

    const state = api.getState()
    const stateRef = useRef(state)
    const selectorRef = useRef(selector)
    const equalityFnRef = useRef(equalityFn)
    const erroredRef = useRef(false)

    const currentSliceRef = useRef()
    if (currentSliceRef.current === undefined) {
      currentSliceRef.current = selector(state)
    }

    let newStateSlice;
    let hasNewStateSlice = false

    // The selector or equalityFn need to be called during the render phase if
    // they change. We also want legitimate errors to be visible so we re-run
    // them if they errored in the subscriber.
    if (
      stateRef.current !== state ||
      selectorRef.current !== selector ||
      equalityFnRef.current !== equalityFn ||
      erroredRef.current
    ) {
      // Using local variables to avoid mutations in the render phase.
      newStateSlice = selector(state)
      hasNewStateSlice = !equalityFn(
        currentSliceRef.current ,
        newStateSlice
      )
    }

    // Syncing changes in useEffect.
    useIsomorphicLayoutEffect(() => {
      if (hasNewStateSlice) {
        currentSliceRef.current = newStateSlice;
      }
      stateRef.current = state
      selectorRef.current = selector
      equalityFnRef.current = equalityFn
      erroredRef.current = false
    })

    const stateBeforeSubscriptionRef = useRef(state)
    useIsomorphicLayoutEffect(() => {
      const listener = () => {
        try {
          const nextState = api.getState()
          const nextStateSlice = selectorRef.current(nextState)
          if (
            !equalityFnRef.current(
              currentSliceRef.current,
              nextStateSlice
            )
          ) {
            stateRef.current = nextState
            currentSliceRef.current = nextStateSlice
            forceUpdate()
          }
        } catch (error) {
          erroredRef.current = true
          forceUpdate()
        }
      }
      const unsubscribe = api.subscribe(listener)
      if (api.getState() !== stateBeforeSubscriptionRef.current) {
        listener() // state has changed before subscription
      }
      return unsubscribe
    }, [])

    const sliceToReturn = hasNewStateSlice
      ? newStateSlice
      : currentSliceRef.current
    return sliceToReturn
  }

  Object.assign(useStore, api)
  return useStore
}
```

먼저 각 컴포넌트가 첫 마운트 되고 구독할 리스너 함수는 다음과 같다.
해당 리스너 함수는 상태 변경 시 옵저버 패턴으로 구독되어 있는 함수이다.

```javascript
useIsomorphicLayoutEffect(() => {
  const listener = () => {
    try {
      const nextState = api.getState();
      const nextStateSlice = selectorRef.current(nextState);
      if (!equalityFnRef.current(currentSliceRef.current, nextStateSlice)) {
        stateRef.current = nextState;
        currentSliceRef.current = nextStateSlice;
        forceUpdate();
      }
    } catch (error) {
      erroredRef.current = true;
      forceUpdate();
    }
  };
  const unsubscribe = api.subscribe(listener);
  if (api.getState() !== stateBeforeSubscriptionRef.current) {
    listener(); // state has changed before subscription
  }
  return unsubscribe;
}, []);
```

1. 먼저 createStore 함수로 생성하고 반환된 setter, getter, 구독함수, 클리어 함수를 이용하여 상태를 얻는다. selector함수가 있다면 
selector함수를 이용해 값을 얻는다.

2. 