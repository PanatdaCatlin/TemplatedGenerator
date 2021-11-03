import React, { useState } from "react";
import ErrorBoundry from "../ErrorBoundry";
import H1 from "../H1";

import CityIdTable from "./CityIdTable";
import CityIdSearchTerms from "./CityIdSearchTerms";
import QueryTemplate from "./QueryTemplate";
import RenderOutputs from "./RenderOutputs";
import H2 from "../H2";
import dynamic from "next/dynamic";
const Tour = dynamic(() => import("reactour"), { ssr: false });

const steps = [
  {
    selector: ".data-table",
    content:
      "Provide a list of City/Id pairs. Each row of this table will generate 1 row of output",
  },
  {
    selector: ".data-table",
    content: "PROTIP: You can paste directly from a spreadsheet",
  },
  {
    selector: ".replacables",
    content:
      "These values will be search&replaced in the query template with each value from the Cities&Ids table",
  },
  {
    selector: ".query-text-area",
    content:
      "Query Template is where you should paste in your starting sql query.",
  },
  {
    selector: ".generate-outputs",
    content: "Click this to generate the sql-outputs",
  },
];

const tableHeaders = [
  { readOnly: true, value: "City", width: 100 },
  { readOnly: true, value: "Id", width: 100 },
];
const defaultData = [[{ value: "Seattle" }, { value: 101 }]];

function SQLWorkflow() {
  const [tableData, setTableData] = useState(
    JSON.parse(JSON.stringify([tableHeaders, ...defaultData]))
  );
  const [city, setCity] = useState("Memphis");
  const [id, setId] = useState(1337);
  const [template, setTemplate] = useState(`UPDATE wp_posts SET post_content = REPLACE(post_content, 'Milwaukee', 'Brookfield') WHERE ID = 601;`);
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <>
      <H1 text="SQLWorkflow Builder" dark help={() => setIsTourOpen(true)} />
      <div className="column padded elevated bordered rounded">
        <H2 text="Inputs" />
        <div className="row flex-end">
          <button
            className="red-text rounded px"
            onClick={() => {
              setTableData(
                JSON.parse(JSON.stringify([tableHeaders, ...defaultData]))
              );
              setTemplate("");
              setId(1337);
              setCity("Memphis");
            }}
          >
            {" Reset "}
          </button>
        </div>
        <div className="row">
          <CityIdTable {...{ tableData, setTableData }} />
          <CityIdSearchTerms {...{ city, setCity, id, setId }} />
        </div>
        <QueryTemplate {...{ template, setTemplate }} />
      </div>
      <div className="column padded elevated bordered rounded">
        <H2 text="Outputs" />
        <div className="row">
          <RenderOutputs {...{ tableData, city, id, template }} />
        </div>
      </div>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </>
  );
}

const SafeSQLWorkflow = (props) => (
  <ErrorBoundry
    CustomHandler={(resolve) => {
      resolve();
    }}
  >
    <SQLWorkflow {...props} />
  </ErrorBoundry>
);

export default SafeSQLWorkflow;
