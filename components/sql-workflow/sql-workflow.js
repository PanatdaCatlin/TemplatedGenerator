import React, { useState } from "react";
import ErrorBoundry from '../ErrorBoundry';
import H1 from "../H1";

import CityIdTable from './CityIdTable';
import CityIdSearchTerms from './CityIdSearchTerms';
import QueryTemplate from './QueryTemplate';
import RenderOutputs from "./RenderOutputs";
function SQLWorkflow() {
  const [data, setData] = useState();
  const [city, setCity] = useState("Memphis");
  const [id, setId] = useState(1337);
  const [template, setTemplate] = useState("");
  return (
    <>
      <H1
        text="SQLWorkflow Builder"
        dark

      />
      <CityIdTable getTableData={setData} />
      <CityIdSearchTerms {...{ city, setCity, id, setId }} />
      <QueryTemplate {...{ template, setTemplate }} />
      <RenderOutputs {...{data, city, id, template}} />
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