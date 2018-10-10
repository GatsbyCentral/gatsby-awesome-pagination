import _ from "lodash";
import fp from "lodash/fp";
import { paginate, createPagePerItem } from "../src";

describe("paginate()", () => {
  it("creates pages and forwards context", () => {
    const createPage = jest.fn();
    paginate({
      createPage,
      items: Array(12).fill(),
      itemsPerPage: 3,
      itemsPerFirstPage: 5,
      pathPrefix: "/blog",
      component: "path/to/blog",
      context: { additionalContext: true }
    });
    expect(createPage).toMatchSnapshot();
  });

  it("allows fine-tuning pathPrefix with a function", () => {
    const createPage = jest.fn();
    paginate({
      createPage,
      items: Array(12).fill(),
      itemsPerPage: 3,
      pathPrefix: ({ pageNumber }) =>
        pageNumber === 0 ? "/blog" : "/blog/page",
      component: "path/to/blog"
    });
    expect(createPage).toMatchSnapshot();
  });
});

const blogPosts = _.map(Array(43), (item, index) => ({
  id: index,
  title: `Post number ${index.toString()}`,
  path: `/blog/post-${index + 1}`
}));

describe("createPagePerItem()", () => {
  it("Calls createPage() once per item", () => {
    const createPage = jest.fn();

    createPagePerItem({
      createPage,
      items: fp.cloneDeep(blogPosts),
      itemToPath: "path",
      itemToId: "id",
      component: "/path/to/some/template.js"
    });

    expect(createPage).toHaveBeenCalledTimes(blogPosts.length);
  });

  it("Calls createPage() with the correct params", () => {
    const createPage = jest.fn();

    createPagePerItem({
      createPage,
      items: fp.cloneDeep(blogPosts),
      itemToPath: "path",
      itemToId: "id",
      component: "/path/to/some/template.js"
    });

    expect(createPage).toMatchSnapshot();
  });
});
