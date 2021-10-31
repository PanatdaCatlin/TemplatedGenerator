import React from "react";
import H2 from "../H2";



const QueryTemplate = ({ template, setTemplate }) => {
  return (
    <div
      className="query-template-container column padded elevated rounded bordered flex-start"
      style={{ flexGrow: 1 }}
    >
      <H2 text={"Query Template"}></H2>
      <div className="row flex-wrap">
        <div className="column flex-grow" style={{ maxWidth: "500px" }}>
          <h2>Query Template</h2>
          <textarea
          className="query-text-area"
            style={{ width: "100%" }}
            value={template}
            onChange={({ target: { value } }) => setTemplate(value)}
            placeholder="SELECT * FROM CITIES"
          />
        </div>
      </div>
     
    </div>
  );
};

export default QueryTemplate;
