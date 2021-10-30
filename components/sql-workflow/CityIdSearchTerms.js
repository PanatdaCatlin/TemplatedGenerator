
import React, { useState } from "react";

import H2 from "../H2";


const CityIdSearchTerms = ({ id, setId, city, setCity }) => {

    return <div
        className="column padded elevated rounded bordered flex-start"
        style={{ flexGrow: 1 }}
    >
        <H2 text={"Terms To Replace"}></H2>
        <div className="row flex-wrap">
            <div className="column keymap-list padded flex-start">


                <label htmlFor="city" style={{ width: '100px' }}>City <input name="city" type="text" value={city} onChange={({ target: { value } }) => setCity(value)} /></label>
                <label htmlFor="id" style={{ width: '100px' }}>ID <input name="id" type="text" value={id} onChange={({ target: { value } }) => setId(value)} /></label>


            </div></div>
    </div>
}

export default CityIdSearchTerms;