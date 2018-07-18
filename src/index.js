// @flow

import isString from "lodash/fp/isString";
import get from "lodash/fp/get";
import times from "lodash/fp/times";

import { paginatedPath, getPreviousItem, getNextItem } from "./utils";

type CreatePage = ({}) => void;

type PaginateOpts = {
  items: {}[],
  perPage: number,
  pathPrefix: string,
  component: string
};
export const paginate = (createPage: CreatePage, opts: PaginateOpts): void => {
  const { items, perPage, pathPrefix, component } = opts;

  const totalItems = items.length;

  // How many page should we have?
  const numberOfPages = Math.ceil(totalItems / perPage);

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
        skip: perPage * pageNumber,
        limit: perPage,
        numberOfPages,
        previousPagePath,
        nextPagePath
      }
    });
  })(numberOfPages);
};

type CreatePagePerItemOpts = {
  items: {}[],
  itemToPath: string | (({}) => string),
  component: string
};
export const createPagePerItem = (
  createPage: CreatePage,
  opts: CreatePagePerItemOpts
): void => {
  const { items, itemToPath, component } = opts;

  // This produces a flow error because it is possible to return a `string` from
  // `itemToPath`. Flow does not know that we test for a `string` and in that
  // case, return a function. $FlowExpectError
  const getPath: ({}) => string = isString(itemToPath)
    ? get(itemToPath)
    : itemToPath;

  // We cannot use `forEach()` here because in the FP version of lodash, the
  // iteratee is capped to a single argument, the item itself. We cannot get the
  // item's index in the array. So instead we use `times()` and provide the
  // length of the array.
  times((index: number) => {
    const item = items[index];
    const path = getPath(item);

    const previousItem = getPreviousItem(items, index);
    const previousPath = getPath(previousItem);
    const nextItem = getNextItem(items, index);
    const nextPath = getPath(nextItem);

    // TODO Provide a mechanism to extract an ID from each `item`

    // Call `createPage()` for this item
    createPage({
      path,
      component,
      context: {
        previousPagePath: previousPath,
        previousItem: previousItem,
        nextPagePath: nextPath,
        nextItem: nextItem
      }
    });
  })(items.length);
};
