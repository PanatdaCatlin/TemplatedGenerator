import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Nav from "../components/Nav";
import { github, assetPrefix } from "../next.config";
export default function Home(props) {
  return (
    <div className="view-wrapper">
      <Nav title="Workflow Enhancement Tools" home></Nav>
      <div className="column pt">
        <div className="row">
          <div className="row thin p elevated rounded">
            <Link href="/city-tool">
              <div className="column p elevated rounded outlined hoverable clickable">
                <span className="big-text p">City Service Generator</span>
                <hr className="wide" />
                <div className="row">
                  <img
                    src={`${github}${assetPrefix}city.svg`}
                    style={{ height: "200px" }}
                  ></img>
                </div>
              </div>
            </Link>
            <Link href="/template-generator">
              <div className="column p elevated rounded outlined hoverable clickable">
                <span className="big-text p">Template Generator</span>
                <hr className="wide" />
                <div className="row">
                  <img
                    src={`${github}${assetPrefix}braces.svg`}
                    style={{ height: "200px" }}
                  ></img>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
