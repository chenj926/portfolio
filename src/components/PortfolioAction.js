import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import Material from "./Material";
import "./PortfolioAction.css";

// Navigation and commands share the material; native elements retain their
// keyboard and link semantics. External-link policy lives here, not at callers.
const PortfolioAction = ({
  href,
  icon,
  children,
  className = "",
  ...props
}) => {
  const external = /^https?:\/\//.test(href || "");
  return (
    <Material
      as={href ? "a" : "button"}
      {...(href ? { href } : { type: "button" })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`portfolio-action pressable ${className}`.trim()}
      {...props}
    >
      <span>{children}</span>
      <FontAwesomeIcon
        icon={icon || (external ? faArrowUpRightFromSquare : faArrowRight)}
        aria-hidden="true"
      />
      {external && (
        <span className="portfolio-visually-hidden"> (opens in a new tab)</span>
      )}
    </Material>
  );
};

export default PortfolioAction;
