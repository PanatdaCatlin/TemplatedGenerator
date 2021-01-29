import React, { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import TextareaAutosize from "react-textarea-autosize";
import H2 from "../../components/H2";
const Tour = dynamic(() => import("reactour"), { ssr: false });

const steps = [
  {
    selector: ".output-container",
    content:
      "This area combines your selected KeyMap with your selected Template",
  },
  {
    selector: ".dimension-selectors",
    content:
      "Select the current Value for each Key, the output will recompute the new output",
  },
];

const Output = function ({ templateStore, keyMapStore }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const newSelect = Object.keys(keyMapStore.keyMap).reduce(
      (collection, key) => {
        if (selected[key] && keyMapStore.keyMap[key].includes(selected[key])) {
          collection[key] = selected[key];
        } else {
          collection[key] = keyMapStore.keyMap[key][0] || "";
        }
        return collection;
      },
      {}
    );
    setSelected(newSelect);
  }, [keyMapStore]);

  const templateOutput = useMemo(() => {
    let output = templateStore.template;
    Object.keys(keyMapStore.keyMap).forEach((key) => {
      const value = keyMapStore.keyMap[key];
      if (key && value && output && output.replaceAll) {
        output = output.replaceAll(`{{${key}}}`, selected[key]);
      }
    });

    return output;
  }, [templateStore, keyMapStore, selected]);
  return (
    <div className="output-container wide column  padded rounded elevated bordered">
      <H2 text="Output" help={() => setIsTourOpen(true)} />
      <div className="row flex-grow padded-half">
        <div className="column dimension-selectors">
          {Object.keys(keyMapStore.keyMap).map((key) => {
            return (
              <div className="column outlined" style={{ marginTop: "15px" }}>
                <div className="row big-text bordered-b half-padded">{key}</div>
                <div style={{ maxHeight: "300px", maxWidth:'300px', overflowY: "auto" }}>
                  {keyMapStore.keyMap[key].map((value) => {
                   
                    return (
                      <div
                        onClick={() =>
                          setSelected({ ...selected, [key]: value })
                        }
                        className={`row ${
                          selected[key] === value ? "lightgrey" : ""
                        }`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="column flex-grow">
          <div className="row flex-start half-padded big-text">
            <button
              onClick={() => {
                outputRef.current.select();
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }}
            >
              {copied ? "Coppied!" : "Copy"}
            </button>
          </div>
          <TextareaAutosize
            type="textarea"
            ref={outputRef}
            minRows={5}
            className="padded rounded elevated flex-grow"
            value={templateOutput}
            placeholder="Your text will appear here once entered"
          ></TextareaAutosize>
        </div>
      </div>

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};

export default Output;
