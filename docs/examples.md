## Exammples

## `gatsby-node.js`

```javascript
import { paginate } from "gatsby-plugin-awesome-pagination";
```

```javascript
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  // We return a promise immediately
  return new Promise((resolve, reject) => {
    // Start by creating all the blog pages
    const blogPost = path.resolve("./src/templates/blog-post.js");
    const blogIndex = path.resolve("./src/templates/blog-index.js");
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              edges {
                node {
                  id
                  frontmatter {
                    permalink
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Get an array of posts from the query result
        const posts = _.get(result, "data.allMarkdownRemark.edges");

        // Create the blog index pages like `/blog`, `/blog/2`, `/blog/3`, etc.
        // Each page will have 10 blog posts and a link to the next and previous
        // pages.
        paginate({
          createPage,
          items: blogPosts,
          component: blogIndex,
          perPage: 10,
          pathPrefix: "/blog"
        });

        // Create one page per blog post, with a link to the previous and next
        // blog posts.
        createPagePerItem({
          createPage,
          items: blogPosts,
          component: blogPost,
          itemToPath: "node.frontmatter.permalink",
          itemToId: "node.id"
        });
      })
    );
  });
};
```

## Blog index component

Retrieve posts via the `$skip` and `$limit` parameters like so:

```javascript
export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          excerpt(pruneLength: 280)
          fields {
            permalink
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`;
```

Render posts like so:

```javascript
const BlogIndex = props => {
  const { pathContext } = props;
  const { previousPageLink, nextPageLink } = pathContext;

  return (
    <div>
      {props.data.posts.edges.map(edge => <Item post={edge.node} />)}
      <div>
        {previousPageLink ? <Link to={previousPageLink}>Previous</Link> : null}
        {nextPageLink ? <Link to={nextPageLink}>Next</Link> : null}
      </div>
    </div>
  );
};
```

## Blog post component

First, you can retrieve any data you need like so:

```javascript
export const pageQuery = graphql`
  query($id: ID!, $previousPageId: ID!, $nextPageId: ID!) {
    post: markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
```

Then inside your component you can render links to the previous and next posts.

```javascript
const BlogPost = props => {
  const { pathContext, data } = props;
  const { previousPagePath, nextPagePath, previousPageItem, nextPageItem } = pathContext;
  const { post } = data;

  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <div>
        {previousPagePath ? (
          <Link to={pathContext.previousPagePath}>
            {previousPageItem.frontmatter.title}
          </Link>
        ) : null}
        {nextPagePath ? (
          <Link to={pathContext.nextPagePath}>
            {nextPageItem.frontmatter.title}
          </Link>
        ) : null}
      </div>
    </div>
  );
};
```
