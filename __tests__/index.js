import { paginate, createPagePerItem } from "../src";

describe("paginate", () => {
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
