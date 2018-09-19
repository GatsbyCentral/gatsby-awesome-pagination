// @flow

import isString from "lodash/fp/isString";
import get from "lodash/fp/get";
import times from "lodash/fp/times";
import cloneDeep from "lodash/fp/cloneDeep";

import { paginatedPath, getPreviousItem, getNextItem } from "./utils";

type CreatePage = ({}) => void;

type PaginateOpts = {
  createPage: CreatePage,
  items: {}[],
  itemsPerPage: number,
  pathPrefix: string,
  component: string,
  context?: {}
};
export const paginate = (opts: PaginateOpts): void => {
  const {
    createPage,
    items,
    itemsPerPage,
    pathPrefix,
    component,
    context
  } = opts;

  const totalItems = items.length;

  // How many page should we have?
  const numberOfPages = Math.ceil(totalItems / itemsPerPage);

  // Iterate as many times as we need pages
  times((pageNumber: number) => {
    // Create the path for this page
    const path = paginatedPath(pathPrefix, pageNumber, numberOfPages);

    // Calculate the path for the previous page
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
        skip: itemsPerPage * pageNumber,
        limit: itemsPerPage,
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
      nextPagePath: nextPath,
      nextItem: nextItem
    });

    // Call `createPage()` for this item
    createPage({
      path,
      component,
      context
    });
  })(items.length);
};
