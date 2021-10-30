import Link from "next/link";
import React from "react";
import Nav from "../components/Nav";
import { useRouter } from "next/router";

import { basePath } from "../next.config";
import CityTool from "../components/city-tool/city-tool";
import TemplateGenerator from "../components/templated-generator/template-generator";
import {SQLWorkflow} from "../components/sql-workflow";

const routeMap = {
  "city-tool": CityTool,
  "template-generator": TemplateGenerator,
  "sql-workflow": SQLWorkflow
};

export default function Home(props) {
  const router = useRouter();
  const {
    query: { tool },
  } = router;
  return (
    <div className="view-wrapper">
      <Nav title="Workflow Enhancement Tools" home={!tool}></Nav>
      {tool && routeMap[tool]()}
      {!tool && (
        <div className="column pt">
          <div className="row">
            <div className="row thin padded elevated rounded flex-wrap">
              <Link href="?tool=city-tool">
                <div className="column padded elevated rounded outlined hoverable clickable">
                  <span className="big-text padded">
                    City Service Generator
                  </span>
                  <hr className="wide" />
                  <div className="row">
                    <img
                      src={`${basePath}/city.svg`}
                      style={{ height: "200px" }}
                    ></img>
                  </div>
                </div>
              </Link>
              <Link href="?tool=template-generator">
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
              <Link href="?tool=sql-workflow">
                <div className="column padded elevated rounded outlined hoverable clickable">
                  <span className="big-text padded">SQL Generator</span>
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
      )}
    </div>
  );
}
