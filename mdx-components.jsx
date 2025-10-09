import '@/styles/mdx-components.scss';
import { PrismLight } from 'react-syntax-highlighter';
import SubTitleAnchor from '@/components/sub-title-anchor';
import nightOwl from 'react-syntax-highlighter/dist/esm/styles/prism/night-owl';

const components = {
  code: ({ children }) => (
    <PrismLight language='javascript' style={nightOwl}>
      {children}
    </PrismLight>
  ),

  a: ({ children }) => (
    <a href={children} className='mdx-a'>
      {children}
    </a>
  ),

  img: ({ src, alt }) => (
    <img src={process.env.NODE_ENV === 'production' ? `/wkd2ev${src}` : src} alt={alt} />
  ),

  h2: ({ children }) => (
    <SubTitleAnchor subTitle={children} />
  ),
};

export function useMDXComponents() {
  return components
}
