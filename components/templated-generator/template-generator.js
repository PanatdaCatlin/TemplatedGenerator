import React, { useReducer, useState } from "react";
import KeyMap from "./KeyMap";
import Template from "./Template";
import Output from "./Output";
import H1 from "../H1";
import ErrorBoundry from "../ErrorBoundry";
import {
  PresetReducer,
  TemplateReducer,
  KeyMapReducer,
  GetTemplateInitialState,
  GetKeyMapInitialState,
  GetPresetIntitialState,
} from "./reducers";
import Tour from "./Tour";
import OutputAll from "./OutputAll";

function TemplatedGenerator() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [really, setReally] = useState(false);

  const [templateStore, templateDispatch] = useReducer(
    TemplateReducer,
    GetTemplateInitialState()
  );
  const [keyMapStore, keyMapDispatch] = useReducer(
    KeyMapReducer,
    GetKeyMapInitialState()
  );
  const [presetStore, presetDispatch] = useReducer(
    PresetReducer,
    GetPresetIntitialState()
  );

  return (
    <>
      <H1
        text="Live Template Constructor"
        dark
        help={() => setIsTourOpen(true)}
      />
      <div className="row flex-end " style={{marginRight:'20px'}}>
        <input
          type="text"
          style={{
            color: "white",
            backgroundColor: "red",
            fontSize: "16px",
            textAlign: "center",
          }}
          className="half-padded rounded"
          value={really ? "Confirm Reset" : "Reset"}
          onClick={() => {
            if (really) {
              presetDispatch({
                type: "preset/reset",
                value: { keyMapDispatch, templateDispatch },
              });
              setReally(false);
            } else {
              setReally(true);
            }
          }}
        ></input>
        {really && (
          <input
            type="text"
            style={{
              color: "black",
              backgroundColor: "yellow",
              fontSize: "16px",
              textAlign: "center",
            }}
            className="half-padded rounded"
            value={"Cancel"}
            onClick={() => {
              if (really) {
                presetDispatch({
                  type: "preset/reset",
                  value: { keyMapDispatch, templateDispatch },
                });
                setReally(false);
              } else {
                setReally(true);
              }
            }}
          ></input>
        )}
      </div>
      <div className="inputs row padded">
        <KeyMap
          {...{ presetStore, presetDispatch, keyMapStore, keyMapDispatch }}
        />
        <Template
          {...{ presetStore, presetDispatch, templateStore, templateDispatch }}
        />
      </div>

      <div className="row padded flex-start">
        <Output {...{ templateStore, keyMapStore }} />
      </div>

      <div className="row padded flex-start">
        <OutputAll {...{ templateStore, keyMapStore }} />
      </div>

      <Tour {...{ isTourOpen, setIsTourOpen }}></Tour>
    </>
  );
}

export default (props) => (
  <ErrorBoundry
    CustomHandler={(resolve) => {
      localStorage.removeItem("Presets");
      resolve();
    }}
  >
    <TemplatedGenerator {...props} />
  </ErrorBoundry>
);
