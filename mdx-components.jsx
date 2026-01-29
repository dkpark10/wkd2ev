import { PrismLight } from "react-syntax-highlighter";
import SubTitleAnchor from "@/components/sub-title-anchor";
import theme from "react-syntax-highlighter/dist/esm/styles/prism/gruvbox-dark";

const components = {
  code: ({ children }) => {
    const code = String(children).replace(/\n$/, "");
    const lines = code.split("\n");

    return (
      <PrismLight
        language="javascript"
        style={theme}
        wrapLines
        showLineNumbers
        lineProps={(lineNumber) => {
          const lineCode = lines[lineNumber - 1];
          const isDiffAdd = lineCode?.trimStart().startsWith("+");
          const isDiffRemove = lineCode?.trimStart().startsWith("-");

          return {
            style: {
              display: "block",
              backgroundColor: isDiffAdd
                ? "rgba(46, 160, 67, 0.4)"
                : isDiffRemove
                ? "rgba(248, 81, 73, 0.4)"
                : undefined,
            },
            className: isDiffAdd
              ? "[&_span]:!text-[#afffaf]"
              : isDiffRemove
              ? "[&_span]:!text-[#ffafaf]"
              : "",
          };
        }}
        codeTagProps={{
          style: {
            fontSize: "0.825rem",
            lineHeight: "1.2",
          },
        }}
      >
        {code}
      </PrismLight>
    );
  },

  /**
   * @param {{ children: string; href?: string }}
   */
  a: ({ children, href }) => (
    <a href={href || children} className="break-all text-primary">
      {children}
    </a>
  ),

  /** @param {{ src: string; alt: string }} */
  img: ({ src, alt }) => (
    <img
      src={process.env.NODE_ENV === "production" ? `/wkd2ev${src}` : src}
      alt={alt}
    />
  ),

  /** @param {{ children: string }} */
  h2: ({ children }) => <SubTitleAnchor as="h2" subTitle={children} />,

  /** @param {{ children: string }} */
  h3: ({ children }) => <SubTitleAnchor as="h3" subTitle={children} />,

  /** @param {{ children: string }} */
  h4: ({ children }) => <SubTitleAnchor as="h4" subTitle={children} />,
};

export function useMDXComponents() {
  return components;
}
