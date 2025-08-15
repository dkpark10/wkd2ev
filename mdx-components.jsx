import '@/styles/mdx-components.scss';
import { PrismLight } from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/esm/styles/prism/night-owl';

const components = {
  code: ({ children }) => (
    <PrismLight language="javascript" style={nightOwl}>
      {children}
    </PrismLight>
  ),

};

export function useMDXComponents() {
  return components
}
