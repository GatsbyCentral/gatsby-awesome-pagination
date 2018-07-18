## Awesome Pagination for Gatsby

Love Gatsby, wanna paginate. Sweet, that's exactly what this package is for.

We differ from other pagination options as follows:

* Don't abuse `context` to pass data into components
* Pass only pagination context via `context`
* Provide helpers for next / previous links

## Quick start

This plugin provides a very simple API which you use like so.

First, the import:

```javascript
import { paginate } from 'gatsby-plugin-awesome-pagination';
```

Then, use `paginate()` like so:

```javascript
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  // Fetch your blog posts, etc, etc
  const blogPosts = doSomeMagic();

  // Create your paginated pages like so
  paginate(createPage, {
    items: blogPosts,
    perPage: 10,
    pathPrefix: '/posts',
    component: '',
  })
}
```

Now in your component you can use the `pagination*` context like so:

```javascript
export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip,
      limit: $limit
    ) {
      ...
    }
  }
`
```

Your page's `context` automatically receives the following values:

* `pageNumber` - The page number (starting from 0)
* `humanPageNumber` - The page number (starting from 1) for human consumption
* `skip` - The $skip you can use in a GraphQL query
* `limit` - The $limit you can use in a GraphQL query
* `numberOfPages` - The total number of pages
* `previousPagePath` - The path to the previous page or undefined
* `nextPagePath` - The path to the next page or undefined
