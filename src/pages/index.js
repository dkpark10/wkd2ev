import * as React from "react"
import { Link, graphql } from "gatsby"

// import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

/**
 * @param {Object} props
 * @param {object} props.data
 * @param {object} props.data.site
 * @param {object} props.data.site.siteMetadata
 * @param {string} props.data.site.siteMetadata.title
 * @param {object} props.data.allMarkdownRemark
 * @param {object[]} props.data.allMarkdownRemark.nodes
 * @param {string} props.data.allMarkdownRemark.nodes.excerpt
 * @param {object} props.data.allMarkdownRemark.nodes.fields
 * @param {string} props.data.allMarkdownRemark.nodes.fields.slug
 * @param {object} props.data.allMarkdownRemark.nodes.frontmatter
 * @param {string} props.data.allMarkdownRemark.nodes.frontmatter.date
 * @param {string} props.data.allMarkdownRemark.nodes.frontmatter.title
 * @param {string|null} data.allMarkdownRemark.nodes.frontmatter.description
 */
export default function Home({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout location={location} title={siteTitle}>
      <ol className="post-list">
        {posts.map((post) => (
          <li key={post.fields.slug}>
            <article className="post-list-item" itemScope itemType="http://schema.org/Article">
              <h2>
                <Link to={post.fields.slug} itemProp="url">
                  <span itemProp="headline">{post.frontmatter.title || post.fields.slug}</span>
                </Link>
              </h2>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: post.frontmatter.description || post.excerpt,
                  }}
                  itemProp="description"
                />
              </section>
              <small>{post.frontmatter.date}</small>
            </article>
          </li>
        ))}
      </ol>
    </Layout>
  );
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          description
        }
      }
    }
  }
`;