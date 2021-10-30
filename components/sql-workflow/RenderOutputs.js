import React, { useState } from "react";
import H2 from "../H2";


const RenderOutputs = ({ data, id, city, template }) => {
    const [outputs, setOutputs] = useState([]);
    return <div
        className="column padded elevated rounded bordered flex-start"
        style={{ flexGrow: 1 }}
    >
        <H2 text={"Render Outputs"}></H2>
        <button onClick={() =>
            setOutputs(data.map(([{ value: cityVal }, { value: idVal }]) =>
                template.replaceAll(city, cityVal).replaceAll(id, idVal))
            )} >Generate</button>
        <div className="column padded">
            {outputs.map((output, i) => <div className="row" key={i}>{output}</div>)}
        </div>

    </div >
}

export default RenderOutputs;