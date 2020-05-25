import React from "react";

import "./style.css";

// Custom input component
const Input = ({ children, color = "black", ...props }) => (
  <input className={`Input Input_${color}`} {...props}>
    {children}
  </input>
);

export default Input;
