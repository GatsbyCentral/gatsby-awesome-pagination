import * as React from "react";
import { Link } from "gatsby";

const linkOrText = (
  label: string,
  link: string,
  activeStyle: {},
  inactiveStyle: {}
): React.Node =>
  link ? (
    <Link to={link} style={activeStyle}>
      {label}
    </Link>
  ) : (
    <span style={inactiveStyle}>{label}</span>
  );

type PaginationLinksProps = {
  previousLabel?: string,
  nextLabel?: string,
  pageLabel?: string,
  separator?: string,
  pageContext: {
    pageNumber: number,
    humanPageNumber: number,
    skip: number,
    limit: number,
    numberOfPages: number,
    previousPagePath?: string,
    nextPagePath?: string
  }
};

export const PaginationLinks = ({
  previousLabel = "← previous",
  nextLabel = "next →",
  pageLabel = "Page: %d",
  separator = " - ",
  activeStyle = {},
  inactiveStyle = { textDecorationLine: "line-through", color: "grey" },
  pageContext: {
    pageNumber,
    humanPageNumber,
    skip,
    limit,
    numberOfPages,
    previousPagePath,
    nextPagePath
  }
}: PaginationLinksProps): React.Node => {
  return (
    <div className="has-text-centered">
      {linkOrText(previousLabel, previousPagePath, activeStyle, inactiveStyle)}
      {separator}
      {pageLabel.replace("%d", humanPageNumber)}
      {separator}
      {linkOrText(nextLabel, nextPagePath)}
    </div>
  );
};
