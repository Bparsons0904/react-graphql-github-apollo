import React from "react";

import Link from "../../Link";

import "./style.css";

const Footer = () => (
  <div className="Footer">
    <div>
      <small>
        <span className="Footer-text">Built by Bob Parsons based on </span>{" "}
        <Link className="Footer-link" href="https://www.robinwieruch.de">
          Robin Wieruch Guide
        </Link>{" "}
        <span className="Footer-text">with &hearts;</span>
      </small>
    </div>
    <div>
      <small>
        <span className="Footer-text">
          Interested in GraphQL, Apollo and React?
        </span>{" "}
        <Link
          className="Footer-link"
          href="https://www.getrevue.co/profile/rwieruch"
        >
          Get updates
        </Link>{" "}
        <span className="Footer-text">
          about upcoming articles, books &amp;
        </span>{" "}
        <Link className="Footer-link" href="https://roadtoreact.com">
          courses
        </Link>
        <span className="Footer-text">.</span>
      </small>
    </div>
  </div>
);

export default Footer;
