import {
  getPreviousItem,
  getNextItem,
  paginatedPath,
  calculateSkip
} from "../src/utils";

describe("utils", () => {
  describe("getPreviousItem()", () => {
    it("Returns the second item", () => {
      const items = [{ name: "one" }, { name: "two" }, { name: "three" }];
      expect(getPreviousItem(items, 2)).toEqual(items[1]);
    });

    it("Returns undefined for index 0", () => {
      const items = [{ name: "one" }, { name: "two" }, { name: "three" }];
      expect(getPreviousItem(items, 0)).toBeUndefined();
    });
  });

  describe("getNextItem()", () => {
    it("Returns the third item", () => {
      const items = [{ name: "one" }, { name: "two" }, { name: "three" }];
      expect(getNextItem(items, 1)).toEqual(items[2]);
    });

    it("Returns undefined for index 2", () => {
      const items = [{ name: "one" }, { name: "two" }, { name: "three" }];
      expect(getNextItem(items, 2)).toBeUndefined();
    });
  });

  describe("paginatedPath()", () => {
    it("Returns only one slash for the index page", () => {
      expect(paginatedPath("/", 0, 3)).toEqual("/");
    });

    it("Returns /2 for the second index page", () => {
      expect(paginatedPath("/", 1, 3)).toEqual("/2");
    });

    it("Passes pageNumber and numberOfPages to pathPrefix()", () => {
      const pathPrefix = jest.fn(() => "/foo");
      expect(paginatedPath(pathPrefix, 0, 3)).toEqual("/foo");
      expect(pathPrefix).toHaveBeenCalledWith({
        pageNumber: 0,
        numberOfPages: 3
      });
    });

    it("Returns empty string for the last + 1 page", () => {
      expect(paginatedPath("/foo", 2, 2)).toEqual("");
    });

    it("Returns empty string for page -1", () => {
      expect(paginatedPath("/foo", -1, 2)).toEqual("");
    });
  });

  describe("calculateSkip()", () => {
    it("Returns zero for the first page", () => {
      expect(calculateSkip(0, 3, 10)).toEqual(0);
    });

    it("Returns firstPageCount for the second page", () => {
      expect(calculateSkip(1, 3, 10)).toEqual(3);
    });

    it("Returns firstPageCount + itemsPerPage for the third page", () => {
      expect(calculateSkip(2, 3, 10)).toEqual(13);
    });

    it("Returns firstPageCount + (3 x itemsPerPage) for the fifth page", () => {
      expect(calculateSkip(4, 3, 10)).toEqual(33);
    });
  });
});
