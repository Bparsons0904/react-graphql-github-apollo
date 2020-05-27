import React from "react";
// Link component for creating clickable links
import Link from "../../Link";
import Comment from "../../Comment";

import "./style.css";
// Wrap each issue in a clickable link
const IssueItem = ({ issue, repositoryOwner, repositoryName }) => (
  <div className="IssueItem">
    <div className="IssueItem-content">
      <h3>
        <Link href={issue.url}>{issue.title}</Link>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />

      {/* Display comments */}
      <Comment
        issueNumber={issue.number}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
      />
    </div>
  </div>
);

export default IssueItem;
