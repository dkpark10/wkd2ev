import { useCallback, useSyncExternalStore } from "react";

export const createStore = (initialState) => {
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

export const useStore = (store, selector) => {
  const slice = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector]),
  );

  return [slice, store.setState];
};

export const useValueStore = (store, selector) => {
  const slice = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector]),
  );

  return slice;
};

export const useSetStore = (store) => {
  return store.setState;
};
