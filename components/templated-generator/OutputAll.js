import React, { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { downloadJSON } from "../../hooks/useDownloadJSON";

import TextareaAutosize from "react-textarea-autosize";
import H2 from "../H2";
import ErrorBoundary from "../ErrorBoundary";
import KeyMap from "./KeyMap";
const Tour = dynamic(() => import("reactour"), { ssr: false });

const CopyableText = ({ text }) => {
  const outputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="wide row half-padded bordered rounded flex-space-between">
      <TextareaAutosize
        type="textarea"
        ref={outputRef}
        minRows={1}
        className="padded rounded elevated flex-grow"
        value={text}
        placeholder=""
      ></TextareaAutosize>
      <button
        className="rounded"
        onClick={() => {
          outputRef.current.select();
          document.execCommand("copy");
          setCopied(true);
        }}
      >
        {copied ? "Coppied!" : "Copy"}
      </button>
    </div>
  );
};

const steps = [];
const cartesian = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
const OutputAll = function ({ templateStore, keyMapStore }) {
  const outputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const templateOutput = useMemo(() => {
    let template = templateStore.template;
    const keys = Object.keys(keyMapStore.keyMap);
    const inputs = keys.map((key) =>
      keyMapStore.keyMap[key].map((value) => ({ [key]: value }))
    );
    let output = cartesian(...inputs);

    const outputs = output.map((set) => {
      let result = template;
      set.forEach((element) => {
        const key = Object.keys(element)[0];
        const val = element[key];
        result = result.replaceAll(`{{${key}}}`, val);
      });
      return result;
    });

    return outputs;
  }, [templateStore, keyMapStore]);
  console.log({ templateOutput });
  return (
    <div className="output-container wide column padded rounded elevated bordered">
      <H2 text="Output All" />
      <div className="row flex-grow padded-half" style={{ marginTop: "15px" }}>
        <div className="column flex-grow">
          <div className="row flex-end">
            <button
              className="rounded flex-end"
              onClick={() => {
                outputRef.current.select();
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Coppied!" : "Copy"}
            </button>
          </div>
          <TextareaAutosize
            type="textarea"
            minRows={1}
            ref={outputRef}
            className="padded rounded elevated flex-grow"
            value={templateOutput.join("\n")}
            placeholder=""
          ></TextareaAutosize>
        </div>
      </div>
    </div>
  );
};

export default (props) => (
  <ErrorBoundary
    CustomHandler={({ resolve }) => {
      return (
        <input
          type="button"
          value="reset"
          onClick={() => {
            resolve();
          }}
        />
      );
    }}
  >
    <OutputAll {...props} />
  </ErrorBoundary>
);
