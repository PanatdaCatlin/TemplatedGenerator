import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { basePath, github } from "../next.config";

function Nav({ title, home }) {
  return (
    <nav
      className="row flex-start"
      style={{ backgroundColor: "#232323", height: "100px" }}
    >
      <div className="row">
        {home && (
          <img
            style={{ height: "100px", width: "auto" }}
            src={`${basePath}/PNWLogo.png`}
          />
        )}
        {!home && (
          <Link href={`/`}>
            <a
              className="big-text"
              style={{ color: "white", alignSelf: "center" }}
            >{`<Home`}</a>
          </Link>
        )}
      </div>
      <div className="row wide">
        <h1 style={{ color: "white", alignSelf: "center" }}>{title}</h1>
      </div>
      <Link href={`${github}${basePath}`}>
        <img
        
          src={`${basePath}/github-corner-right.svg`}
          style={{ height: "50px", width: "auto" }}
        />
      </Link>
    </nav>
  );
}

export default Nav;
