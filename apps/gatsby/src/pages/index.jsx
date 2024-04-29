import * as React from "react";
import { headerStyle } from "../styles/styles.css";
import { Link } from "gatsby";
import { graphql } from "gatsby";

export default function Home({ data }) {
  console.log(data);
  return (
    <React.Fragment>
      <header className={headerStyle} />
      <div>123</div>
      <Link to="/post/1">게시글 1</Link>
      <footer></footer>
    </React.Fragment>
  );
}

export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
        }
      }
    }
  }
`;
