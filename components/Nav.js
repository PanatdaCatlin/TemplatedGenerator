import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { repo, github } from "../next.config";

function Nav({ title, home }) {
  return (
    <nav
      className="row flex-start"
      style={{ backgroundColor: "#232323", height: "100px" }}
    >
      <div className="row">
        <Link href="/">
          <img style={{height:'100px', width:'150px'}} src={`${github}${repo}PNWLogo.png`} />
        </Link>
        {!home && (
          <Link href="/">
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
      <Link href="https://github.com/PanatdaCatlin/TemplatedGenerator">
        <img
          src={`${github}${repo}github-corner-right.svg`}
          style={{ height: "auto", width: "118px" }}
        />
      </Link>
    </nav>
  );
}

export default Nav;
