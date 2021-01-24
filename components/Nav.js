import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function Nav({ title, home }) {
  return (
    <nav
      className="row flex-start"
      style={{ backgroundColor: "#232323", height: "100px" }}
    >
      <div className="row">
        <Link href="/">
          <Image width={150} height={100} src="/PNWLogo.png" />
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
          src="/github-corner-right.svg"
          style={{ height: "auto", width: "118px" }}
        />
      </Link>
    </nav>
  );
}

export default Nav;
