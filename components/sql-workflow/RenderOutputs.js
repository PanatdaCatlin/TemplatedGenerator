import React, { useState, useMemo } from "react";
import H2 from "../H2";

const RenderOutputs = ({ tableData, id, city, template }) => {
  const [outputs, setOutputs] = useState(null);
  const justData = useMemo(() => {
    const [, ...rest] = tableData;
    return rest;
  }, [tableData]);
  return (
    <div
      className="column padded elevated rounded bordered flex-start"
      style={{ flexGrow: 1 }}
    >
      <button
        className="generate-outputs row elevated rounded padded"
        style={{ width: "100px" }}
        onClick={() =>
          setOutputs(
            justData.map(([{ value: cityVal }, { value: idVal }]) =>
              template.replaceAll(city, cityVal).replaceAll(id, idVal)
            )
          )
        }
      >
        Generate
      </button>

      {outputs && (
        <>
          <H2 text={"Rendered Outputs"}></H2>

          <div className="column padded">
            {outputs.map((output, i) => (
              <div className="row" key={i}>
                {output}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RenderOutputs;
