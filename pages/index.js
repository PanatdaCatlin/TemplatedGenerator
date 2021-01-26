import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Nav from "../components/Nav";
import { basePath } from "../next.config";
export default function Home(props) {
  return (
    <div className="view-wrapper">
      <Nav title="Workflow Enhancement Tools" home></Nav>
      <div className="column pt">
        <div className="row">
          <div className="row thin padded elevated rounded">
            <Link href="/city-tool">
              <div className="column padded elevated rounded outlined hoverable clickable">
                <span className="big-text padded">City Service Generator</span>
                <hr className="wide" />
                <div className="row">
                  <img
                    src={`${basePath}/city.svg`}
                    style={{ height: "200px" }}
                  ></img>
                </div>
              </div>
            </Link>
            <Link href="/template-generator">
              <div className="column padded elevated rounded outlined hoverable clickable">
                <span className="big-text padded">Template Generator</span>
                <hr className="wide" />
                <div className="row">
                  <img
                    src={`${basePath}/braces.svg`}
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
