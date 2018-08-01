// @flow
import get from "lodash/fp/get";

type ReturnedItem = {} | void;

export const getPreviousItem = (items: {}[], index: number): ReturnedItem => {
  // If this is the first (or -1) element, there is no previous, so return
  // undefined
  if (index <= 0) {
    return;
  }

  // Get the previous element
  return get(`[${index - 1}]`, items);
};

export const getNextItem = (items: {}[], index: number): ReturnedItem => {
  // If this is the last element (or later), there is no previous, so return
  // undefined
  if (index >= items.length - 1) {
    return;
  }

  // Get the previous element
  return get(`[${index + 1}]`, items);
};

export const paginatedPath = (
  pathPrefix: string,
  pageNumber: number,
  numberOfPages: number
): string => {
  // If this is page 0, return only the pathPrefix
  if (pageNumber === 0) {
    return pathPrefix;
  }

  // If this page is less than zero (-1 for example), then it  it does not
  // exist, return an empty string.
  if (pageNumber < 0) {
    return "";
  }

  // If this page number (which is zero indexed) plus one is more than the total
  // number of pages, then this page does not exist, so return an empty string.
  if (pageNumber + 1 > numberOfPages) {
    return "";
  }

  // Othewrise, add a slash and the number + 1. We add 1 because `pageNumber` is
  // zero indexed, but for human consuption, we want 1 indexed numbers.
  return `${pathPrefix}/${pageNumber + 1}`;
};
