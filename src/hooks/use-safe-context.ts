import { useContext } from 'react';

export function useSafeContext(context) {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(`컨텍스트 provider 외부에서 호출.`);
  }
  return ctx;
}
