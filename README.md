Awesome Pagination for Gatsby
---

This plugin is under active development, all feedback / comments welcome via
GitHub issues.

## Contents

* [QuickStart](#quick-start)
* [Introduction](#introduction)
* [Philosophy](#philosophy)
* [Notes](#notes)

## Quick start

Open `gatsby-node.js` and import:

```javascript
import { paginate } from 'gatsby-awesome-pagination';
```

Then, use `paginate()` like so:

```javascript
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  // Fetch your items (blog posts, categories, etc).
  const blogPosts = doSomeMagic();

  // Create your paginated pages
  paginate({
    createPage, // The Gatsby `createPage` function
    items: blogPosts, // An array of objects
    itemsPerPage: 10, // How many items you want per page
    pathPrefix: '/blog', // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve('...'), // Just like `createPage()`
  })
}
```

Now in your page query you can use the pagination context like so:

```javascript
export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip // This was added by the plugin
      limit: $limit // This was added by the plugin
    ) {
      ...
    }
  }
`
```

Then inside your component, you can link to next / previous pages, and so on:

```javascript
const BlogIndex = (props) => {
  return (
    <div>
      {data.allMarkdownRemark.edges.map(edge => <PostItem item={edge.node}/>)}
      <div>
        {/* previousPageLink and nextPageLink were added by the plugin */ }
        <Link to={props.pageContext.previousPagePath}>Previous</Link>
        <Link to={props.pageContext.nextPagePath}>Next</Link>
      </div>
    </div>
  )
}
```

For a more detailed example, see [docs/examples.md](docs/examples.md)

## Introduction

Love Gatsby, wanna paginate. Sweet, that's exactly what this package is for.

We differ from other pagination options as follows:

* Don't abuse `context` to pass data into components
* Pass only pagination context via `context`
* Provide helpers for next / previous links

There are 2 types of pagination. You have 80 blog posts and you want to show
them 15 at a time on pages like `/blog`, `/blog/2`, `/blog/3`, etc. You do this
with `paginate()`. Then on each blog post, you want to link to the previous and
next blog posts. You do this with `createPagePerItem()`.

## Philosophy

Why did we create this plugin? We felt that the other Gatsby pagination plugins
were using an approach that goes against the principles of GraphQL. One of the
advantages of GraphQL is to be able to decide what data you need right where you
use that data. That's how Gatsby works with page queries.

By putting all the data into `context`, the other pagination plugins break this.
Now you need to decide what data you require for each page inside
`gatsby-node.js` and not inside your page query.

We also felt that there were some helpers missing. Generating links to the next
and previous pages.

This plugin aims to make it easy to paginate in Gatsby **properly**. No
compromises.

## API

Both `paginate()` and `createPagePerItem()` take a single argument, an object.
They share the following keys (* = required):

* `createPage`* - The `createPage` function from `exports.createPages`
* `component`* - The value you would pass to `createPage()` as `component` [Gatsby docs here](https://www.gatsbyjs.org/docs/bound-action-creators/#createPage)
* `items`* - An array of objects, the items you want to paginate over

### `paginate()`

In addition to the arguments above, `paginate()` also supports:

* `itemsPerPage`* - An integer, how many items should be displayed on each page
* `itemsPerFirstPage` - An integer, how many items should be displayed on the **first** page
* `pathPrefix`* - A string, the path like `/blog` (or string returning function), to which `/2`, `/3`, etc will be added
* `context` - A base context object which is extended with the pagination context values

Example:

```javascript
paginate({
  createPage: boundActionCreators.createPage,
  component: path.resolve('./src/templates/blog-index.js'),
  items: blogPosts,
  itemsPerPage: 15,
  itemsPerFirstPage: 3,
  pathPrefix: '/blog'
})
```

Each page's `context` automatically receives the following values:

* `pageNumber` - The page number (starting from 0)
* `humanPageNumber` - The page number (starting from 1) for human consumption
* `skip` - The $skip you can use in a GraphQL query
* `limit` - The $limit you can use in a GraphQL query
* `numberOfPages` - The total number of pages
* `previousPagePath` - The path to the previous page or `undefined`
* `nextPagePath` - The path to the next page or `undefined`

#### pathPrefix()

For more advanced use cases, you can supply a function to `pathPrefix`. This
function will receive a single object as its only argument, that object will
contain `pageNumber` and `numberOfPages`, both integers.

A simple example implementation could be:

```javascript
const pathPrefix = ({ pageNumber, numberOfPages }) =>
  pageNumber === 0 ? '/blog' : '/blog/page'
```

This example produces pages like `/blog`, `/blog/page/2`, `/blog/page/3`, etc.

### `createPagePerItem()`

WARNING: This API is under active development and will probably change. USE WITH
CAUTION.

In addition to the arguments above, `createPagePerItem()` also accepts:

* `itemToPath`* - A function that takes one object from `items` and returns the
  `path` for this `item`
* `itemToId`* - A function that takes one object from `items` and returns the
  item's ID

**NOTE**: Both `itemToPath` and `itemToId` also accept a string with the path to
the value, for example `node.frontmatter.permalink` or `node.id`.

**NOTE**: If an individual `item` has a property called `context`, and that
property is an object, then it's own properties will be added to the page's
`context` for that item.

Example:

```javascript
createPagePerItem({
  createPage: boundActionCreators.createPage,
  component: path.resolve('./src/templates/blog-post.js'),
  items: blogPosts,
  itemToPath: 'node.frontmatter.permalink',
  itemToId: 'node.id'
})
```

Each page's `context` automatically receives the following values:

* `previousPagePath` - The path to the previous page or `undefined`
* `previousItem` - A copy of the previous element from `items`
* `previousPageId` - The ID of the previous page
* `nextPagePath` - The path to the next page or `undefined`
* `nextItem` - A copy of the next element from `items`
* `nextPageId` - The ID of the next page

## Notes

### Flow

This plugin is written using [flow](https://flow.org/). There are some
limitations when using flow and [lodash](https://lodash.com/). Specifically
[this issue](https://github.com/facebook/flow/issues/34). In many cases we use
`$FlowExpectError` and explicitly define the type of something to workaround. A
more elegant solution does not currently seem to exist. Any input on improving
the typing is greatly appreciated in the plugin's issues.

### Contributors

Thanks to the following for their contributions:

* https://github.com/Pyrax
* https://github.com/JesseSingleton
* https://github.com/silvenon
