import {Actions} from 'gatsby'

type PathPrefixFunction = (opts: {
  pageNumber: number,
  numberOfPages: number
}) => string;

export type PathPrefix = string | PathPrefixFunction;

type PaginateOpts = {
  createPage: Actions['createPage'],
  items: {}[],
  itemsPerPage: number,
  itemsPerFirstPage?: number,
  pathPrefix: PathPrefix,
  component: string,
  context?: {}
};

export declare function paginate(opts: PaginateOpts): void
 
type CreatePagePerItemOpts = {
  createPage: Actions['createPage'],
  items: {}[],
  itemToPath: string | (({}) => string),
  itemToId: string | (({}) => string),
  component: string
};

export declare function createPagePerItem(opts: CreatePagePerItemOpts): void
 