// @flow

import isString from "lodash/fp/isString";
import get from "lodash/fp/get";
import times from "lodash/fp/times";
import cloneDeep from "lodash/fp/cloneDeep";
import isInteger from "lodash/fp/isInteger";

import {
  paginatedPath,
  getPreviousItem,
  getNextItem,
  calculateSkip
} from "./utils";

import type { PathPrefix } from "./utils";

type CreatePage = ({}) => void;

type PaginateOpts = {
  createPage: CreatePage,
  items: {}[],
  itemsPerPage: number,
  itemsPerFirstPage?: number,
  pathPrefix: PathPrefix,
  component: string,
  context?: {}
};
export const paginate = (opts: PaginateOpts): void => {
  const {
    createPage,
    items,
    itemsPerPage,
    itemsPerFirstPage,
    pathPrefix,
    component,
    context
  } = opts;

  // How many items do we have in total? We use `items.length` here. In fact, we
  // could just accept an integer in the API as the actual contents of `items`
  // is never used.
  const totalItems = items.length;
  // If `itemsPerFirstPage` is specified, use that value for the first page,
  // otherwise use `itemsPerPage`.
  // $FlowExpectError
  const firstPageCount: number = isInteger(itemsPerFirstPage)
    ? itemsPerFirstPage
    : itemsPerPage;

  // How many page should we have?
  const numberOfPages =
    // If there are less than `firstPageCount` items, we'll only have 1 page
    totalItems <= firstPageCount
      ? 1
      : Math.ceil((totalItems - firstPageCount) / itemsPerPage) + 1;

  // Iterate as many times as we need pages
  times((pageNumber: number) => {
    // Create the path for this page
    const path = paginatedPath(pathPrefix, pageNumber, numberOfPages);

    // Calculate the path for the previous and next pages
    const previousPagePath = paginatedPath(
      pathPrefix,
      pageNumber - 1,
      numberOfPages
    );
    const nextPagePath = paginatedPath(
      pathPrefix,
      pageNumber + 1,
      numberOfPages
    );

    // Call `createPage()` for this paginated page
    createPage({
      path,
      component,
      // Clone the passed `context` and extend our new pagination context values
      // on top of it.
      context: Object.assign({}, cloneDeep(context), {
        pageNumber,
        humanPageNumber: pageNumber + 1,
        skip: calculateSkip(pageNumber, firstPageCount, itemsPerPage),
        limit: pageNumber === 0 ? firstPageCount : itemsPerPage,
        numberOfPages,
        previousPagePath,
        nextPagePath
      })
    });
  })(numberOfPages);
};

type CreatePagePerItemOpts = {
  createPage: CreatePage,
  items: {}[],
  itemToPath: string | (({}) => string),
  itemToId: string | (({}) => string),
  component: string
};
export const createPagePerItem = (opts: CreatePagePerItemOpts): void => {
  const { createPage, items, itemToPath, itemToId, component } = opts;

  // $FlowExpectError
  const getPath: ({}) => string = isString(itemToPath)
    ? get(itemToPath)
    : itemToPath;
  // $FlowExpectError
  const getId: ({}) => string = isString(itemToId) ? get(itemToId) : itemToId;

  // We cannot use `forEach()` here because in the FP version of lodash, the
  // iteratee is capped to a single argument, the item itself. We cannot get the
  // item's index in the array. So instead we use `times()` and provide the
  // length of the array.
  times((index: number) => {
    const item = items[index];
    const path = getPath(item);
    const id = getId(item);

    // NOTE: If there is no previous / next item, we set an empty string as the
    // value for the next and previous path and ID. Gatsby ignores context
    // values which are undefined, so we need these to exist.
    const previousItem = getPreviousItem(items, index);
    const previousPath = getPath(previousItem) || "";
    const nextItem = getNextItem(items, index);
    const nextPath = getPath(nextItem) || "";

    // Does the item have a `context` field?
    const itemContext = get("context")(item) || {};
    const context = Object.assign({}, itemContext, {
      pageId: id,
      previousPagePath: previousPath,
      previousItem: previousItem,
      previousPageId: getId(previousItem) || "",
      nextPagePath: nextPath,
      nextItem: nextItem,
      nextPageId: getId(nextItem) || ""
    });

    // Call `createPage()` for this item
    createPage({
      path,
      component,
      context
    });
  })(items.length);
};
