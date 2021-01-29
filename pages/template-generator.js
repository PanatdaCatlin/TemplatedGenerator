import React, { useReducer, useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Nav from "../components/Nav";
import KeyMap from "../components/templated-generator/KeyMap";
import Template from "../components/templated-generator/Template";
import Output from "../components/templated-generator/Output";
import H1 from "../components/H1";
import H2 from "../components/H2";
import TextareaAutosize from "react-textarea-autosize";
import {
  PresetReducer,
  TemplateReducer,
  KeyMapReducer,
  TemplateState,
  KeyMapState,
  PresetState,
} from "../reducers/templated-generator";
const Tour = dynamic(() => import("reactour"), { ssr: false });

const steps = [
  {
    selector: ".inputs",
    content: "Create templated outputs by pairing a Key-Map with a Template.",
  },
  {
    selector: ".template-container",
    content:
      "Inside the Template, use {{ }} to wrap Keys. The Output will replace your {{ }} with the values provided for that Key",
  },
  {
    selector: ".keymap-container",
    content:
      "Add and Remove Keys which will match and replace {{ }} areas of the Template",
  },
];

function TemplatedGenerator() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [really, setReally] = useState(false);

  const [templateStore, templateDispatch] = useReducer(
    TemplateReducer,
    TemplateState
  );
  const [keyMapStore, keyMapDispatch] = useReducer(KeyMapReducer, KeyMapState);
  const [presetStore, presetDispatch] = useReducer(PresetReducer, PresetState);

  return (
    <div className="view-wrapper">
      <Nav title="City Service Content Generator" />

      <H1
        text="Live Template Constructor"
        dark
        help={() => setIsTourOpen(true)}
      />
      <div className="row flex-end">
        <input
          type="text"
          style={{
            color: "white",
            backgroundColor: "red",
            fontSize: "30px",
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
      </div>
      <div className="inputs row padded flex-wrap">
        <KeyMap
          {...{ presetStore, presetDispatch, keyMapStore, keyMapDispatch }}
        />
        <Template
          {...{ presetStore, presetDispatch, templateStore, templateDispatch }}
        />
      </div>

      <div className="inputs row padded flex-start">
        <Output {...{ templateStore, keyMapStore }} />
      </div>

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}

export default TemplatedGenerator;
