import React from "react";

const PublicationAuthors = ({ authors }) =>
  authors.map((author, index) => (
    <React.Fragment key={author}>
      {index > 0 && ", "}
      {author === "Jialuo Chen" ? (
        <strong className="publication-author-self">{author}</strong>
      ) : (
        author
      )}
    </React.Fragment>
  ));

export default PublicationAuthors;
