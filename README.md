Awesome Pagination for Gatsby
---

## Contents

* [QuickStart](#quick-start)
* [Intro](#intro)
* [Philosophy](#philosophy)

## Quick start

```javascript
import { paginate } from 'gatsby-plugin-awesome-pagination';
```

Then, use `paginate()` like so:

```javascript
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  // Fetch your items (blog posts, categories, whatever).
  // NOTE: Only fetch fields you need in `context`
  const blogPosts = doSomeMagic();

  // Create your paginated pages like so
  paginate({
    createPage,
    items: blogPosts,
    perPage: 10,
    pathPrefix: '/posts',
    component: '',
  })
}
```

Now in your component you can use the pagination context like so:

```javascript
export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
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
* `previousPagePath` - The path to the previous page or `undefined`
* `nextPagePath` - The path to the next page or `undefined`

## Intro

Love Gatsby, wanna paginate. Sweet, that's exactly what this package is for.

We differ from other pagination options as follows:

* Don't abuse `context` to pass data into components
* Pass only pagination context via `context`
* Provide helpers for next / previous links

## Philosophy

Why did we create this plugin? We felt that the other Gatsby pagination plugins
were using an approach that goes against the principles of GraphQL. One of the
biggest advantages of GraphQL is to be able to decide what data you need right
where you use that data. That's how Gatsby works with page queries.

By putting all the data into `context`, the other pagination plugins break this.
Now you need to decide what data you require for each page inside
`gatsby-node.js` and not inside your page query.

We also felt that there were some helpers missing. Generating links to the next
and previous pages.

This plugin aims to make it easy to paginate in Gatsby **properly**. No
compromises.
