import React from "react";
// Display individual repository
import RepositoryItem from "../RepositoryItem";
import "../style.css";

// Loop through list of repositories and generate each item
const RepositoryList = ({ repositories }) =>
  repositories.edges.map(({ node }) => (
    <div key={node.id} className="RepositoryItem">
      <RepositoryItem {...node} />
    </div>
  ));

export default RepositoryList;
