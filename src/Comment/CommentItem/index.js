import React from "react";

import "./style.css";

// Wrap each issue in a clickable link
const CommentItem = ({ comment }) => (
  <div className="CommentItem">
    <div className="CommentItem-content">
      <h3 dangerouslySetInnerHTML={{ __html: comment.bodyText }} />
      <p dangerouslySetInnerHTML={{ __html: comment.author.login }} />
    </div>
  </div>
);

export default CommentItem;
