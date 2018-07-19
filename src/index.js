// @flow

import isString from "lodash/fp/isString";
import get from "lodash/fp/get";
import times from "lodash/fp/times";

import { paginatedPath, getPreviousItem, getNextItem } from "./utils";

type CreatePage = ({}) => void;

type PaginateOpts = {
  createPage: CreatePage,
  items: {}[],
  itemsPerPage: number,
  pathPrefix: string,
  component: string
};
export const paginate = (opts: PaginateOpts): void => {
  const { createPage, items, itemsPerPage, pathPrefix, component } = opts;

  const totalItems = items.length;

  // How many page should we have?
  const numberOfPages = Math.ceil(totalItems / itemsPerPage);

  // Iterate as many times as we need pages
  times((pageNumber: number) => {
    // Create the path for this page
    const path = paginatedPath(pathPrefix, pageNumber);

    // Calculate teh path for the previous page
    const previousPagePath = paginatedPath(pathPrefix, pageNumber - 1);
    const nextPagePath = paginatedPath(pathPrefix, pageNumber + 1);

    // Call `createPage()` for this paginated page
    createPage({
      path,
      component,
      context: {
        pageNumber,
        humanPageNumber: pageNumber + 1,
        skip: itemsPerPage * pageNumber,
        limit: itemsPerPage,
        numberOfPages,
        previousPagePath,
        nextPagePath
      }
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
  const { createPage, items, itemToPath, component } = opts;

  // This produces a flow error because it is possible to return a `string` from
  // `itemToPath`. Flow does not know that we test for a `string` and in that
  // case, return a function. $FlowExpectError
  const getPath: ({}) => string = isString(itemToPath)
    ? get(itemToPath)
    : itemToPath;
  // Same as above. $FlowExpectError
  const getId: ({}) => string = isString(itemToId) ? get(itemToId) : itemToId;

  // We cannot use `forEach()` here because in the FP version of lodash, the
  // iteratee is capped to a single argument, the item itself. We cannot get the
  // item's index in the array. So instead we use `times()` and provide the
  // length of the array.
  times((index: number) => {
    const item = items[index];
    const path = getPath(item);

    const previousItem = getPreviousItem(items, index);
    const previousPath = getPath(previousItem);
    const previousId = getId(previousItem);
    const nextItem = getNextItem(items, index);
    const nextPath = getPath(nextItem);
    const nextId = getId(nextItem);

    // TODO Create the `context` for this page by adding pagination fields onto
    // the `item`

    // Call `createPage()` for this item
    createPage({
      path,
      component,
      context: {
        previousPagePath: previousPath,
        previousPageId: previousId,
        previousItem: previousItem,
        nextPagePath: nextPath,
        nextPageId: nextId,
        nextItem: nextItem
      }
    });
  })(items.length);
};
