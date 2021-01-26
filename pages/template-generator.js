import React, { useReducer, useState, useRef, useEffect, useMemo } from "react";

import Nav from "../components/Nav";
import SectionHeader from "../components/SectionHeader";
import TextareaAutosize from "react-textarea-autosize";
import {
  PresetReducer,
  TemplateReducer,
  KeyMapReducer,
  TemplateState,
  KeyMapState,
  PresetState,
} from "../reducers/templated-generator";
import { downloadJSON, readJSON } from "../hooks/useDownloadJSON";

function TemplatedGenerator() {
  const [templateStore, templateDispatch] = useReducer(
    TemplateReducer,
    TemplateState
  );
  const [keyMapStore, keyMapDispatch] = useReducer(KeyMapReducer, KeyMapState);
  const [presetStore, presetDispatch] = useReducer(PresetReducer, PresetState);
  const [newKey, setNewKey] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [templateFilter, setTemplateFilter] = useState("");
  const [keyMapFilter, setKeyMapFilter] = useState("");
  const [newKeyMapName, setNewKeyMapName] = useState("");
  const templateFileInput = useRef();
  const keyMapFileInput = useRef();
  const templateOutput = useMemo(() => {
    let output = templateStore.template;
    Object.keys(keyMapStore.keyMap).forEach((key) => {
      const value = keyMapStore.keyMap[key];
      if (key && value && output && output.replaceAll) {
        console.log("pre", { output, key, value });
        output = output.replaceAll(`{{${key}}}`, value);
        console.log("post", { output, key, value });
      }
    });

    return output;
  }, [templateStore, keyMapStore]);

  const addKey = () => {
    keyMapDispatch({ type: "key/add", value: newKey });
    setNewKey("");
  };

  const templateEdited = useMemo(
    () =>
      templateStore.template !==
      presetStore.TemplateStates[templateStore.name].template,
    [templateStore, presetStore]
  );

  const keyMapEdited = useMemo(
    () =>
      JSON.stringify(keyMapStore.keyMap) !==
      JSON.stringify(presetStore.KeyMapStates[keyMapStore.name].keyMap),
    [keyMapStore, presetStore]
  );
  console.log({ keyMapEdited, keyMapStore, presetStore });

  return (
    <div className="view-wrapper">
      <Nav title="City Service Content Generator" />

      <SectionHeader text="Live Template Constructor" dark />

      {/* Inputs */}
      <div className="inputs row padded">
        {/* Add new Key*/}
        <div className="wide column padded elevated rounded bordered">
          <div className="row lightgrey rounded">{keyMapStore.name} Keys</div>
          <div className="row flex-grow">
            <div className="column padded flex-start">
              <div className="wide row white flex-start ">
                <input
                  className="wide"
                  type="text"
                  placeholder="Filter"
                  value={keyMapFilter}
                  onChange={({ target: { value } }) => setKeyMapFilter(value)}
                ></input>
              </div>
              <div
                className="column flex-start  bordered elevated "
                style={{
                  overflowY: "auto",
                  maxHeight: "300px",
                  minWidth: "150px",
                }}
              >
                {Object.keys(presetStore.KeyMapStates)
                  .filter(
                    (presetName) =>
                      !keyMapFilter ||
                      presetName
                        .toLowerCase()
                        .indexOf(keyMapFilter.toLowerCase()) >= 0
                  )
                  .map((presetName) => {
                    return (
                      <div
                        key={presetName}
                        onClick={({ target: { value } }) => {
                          keyMapDispatch({
                            type: "key/load-from-preset",
                            value: { presetStore, name: presetName },
                          });
                        }}
                        style={{ padding: "3px" }}
                        className={`row flex-start bordered-b ${
                          keyMapStore.name === presetName ? "lightgrey" : ""
                        }`}
                      >
                        {presetName}
                      </div>
                    );
                  })}
              </div>
              <div className="row wide flex-end">
                <input
                  ref={keyMapFileInput}
                  type="file"
                  accept="text/json"
                  onChange={(event) =>
                    readJSON(keyMapFileInput.current.files[0], (content) =>
                      presetDispatch({
                        type: "preset/key/load-from-file",
                        value: content,
                      })
                    )
                  }
                />
                <input
                  type="button"
                  value="Export"
                  onClick={() =>
                    downloadJSON("keyMap.json", presetStore.KeyMapStates)
                  }
                />
              </div>
            </div>

            <table className="table padded wide  ">
              <thead className="lightgrey">
                <tr>
                  <th className="bordered-r bordered-b">Keys</th>
                  <th className="bordered-b">Values</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="row">
                      <div className="row">
                        <input
                          type="text"
                          value={newKey}
                          onChange={({ target: { value } }) => setNewKey(value)}
                          onKeyPress={({ code }) =>
                            code === "Enter" && addKey()
                          }
                          placeholder="New Key"
                        />
                        <input
                          type="button"
                          value="Add"
                          className="half-padded "
                          onClick={() => addKey()}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                {Object.keys(keyMapStore.keyMap).map((key) => {
                  return (
                    <tr key={key}>
                      <td className="bordered-r bordered-b">{`{{ ${key} }}`}</td>
                      <td className="row bordered-b">
                        <input
                          type="text"
                          className=""
                          value={keyMapStore.keyMap[key]}
                          onChange={({ target: { value } }) =>
                            keyMapDispatch({
                              type: "key/update",
                              value: { [key]: value },
                            })
                          }
                          placeholder="...placeholder"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row flex-end ">
            {keyMapEdited && (
              <input
                style={{ marginRight: "20px" }}
                type="button"
                value="Update"
                onClick={() =>
                  presetDispatch({
                    type: "preset/key/update",
                    value: keyMapStore,
                  })
                }
              ></input>
            )}
            <div className="column">
              <input
                type="text"
                value={newKeyMapName}
                onChange={({ target: { value } }) => setNewKeyMapName(value)}
                onKeyPress={({ code }) => {
                  if (code === "Enter") {
                    presetDispatch({
                      type: "preset/key/add",
                      value: {
                        keyMapStore,
                        newKeyMapName,
                        keyMapDispatch,
                      },
                    });

                    setNewKeyMapName("");
                  }
                }}
              ></input>
              <input
                type="button"
                value="Save as New"
                disabled={
                  !newKeyMapName ||
                  newKeyMapName.length === 0 ||
                  presetStore.KeyMapStates[newKeyMapName]
                }
                onClick={() => {
                  presetDispatch({
                    type: "preset/key/add",
                    value: {
                      keyMapStore,
                      newKeyMapName,
                      keyMapDispatch,
                    },
                  });

                  setNewKeyMapName("");
                }}
              ></input>
            </div>
          </div>
        </div>

        {/* Template */}

        <div className="wide column  padded rounded elevated bordered">
          <div className="row lightgrey rounded">
            {templateStore.name} Template
          </div>

          <div className="row flex-grow padded-half">
            <div className="column padded flex-start">
              <div
                className="wide row white flex-start "
                style={{ position: "sticky", top: "0px" }}
              >
                <input
                  className="wide"
                  type="text"
                  placeholder="Filter"
                  value={templateFilter}
                  onChange={({ target: { value } }) => setTemplateFilter(value)}
                ></input>
              </div>
              <div
                className="column flex-start  bordered elevated "
                style={{
                  overflowY: "auto",
                  maxHeight: "300px",
                  minWidth: "150px",
                }}
              >
                {Object.keys(presetStore.TemplateStates)
                  .filter(
                    (presetName) =>
                      !templateFilter ||
                      presetName
                        .toLowerCase()
                        .indexOf(templateFilter.toLowerCase()) >= 0
                  )
                  .map((presetName) => {
                    return (
                      <div
                        key={presetName}
                        onClick={({ target: { value } }) => {
                          templateDispatch({
                            type: "template/load-from-preset",
                            value: { presetStore, name: presetName },
                          });
                        }}
                        style={{ padding: "3px" }}
                        className={`row flex-start bordered-b ${
                          templateStore.name === presetName ? "lightgrey" : ""
                        }`}
                      >
                        {presetName}
                      </div>
                    );
                  })}
              </div>
              <div className="row wide flex-end">
                <input
                  ref={templateFileInput}
                  type="file"
                  accept="text/json"
                  onChange={(event) =>
                    readJSON(templateFileInput.current.files[0], (content) =>
                      presetDispatch({
                        type: "preset/template/load-from-file",
                        value: content,
                      })
                    )
                  }
                />
                <input
                  type="button"
                  value="Export"
                  onClick={() =>
                    downloadJSON("templates.json", presetStore.TemplateStates)
                  }
                />
              </div>
            </div>

            <TextareaAutosize
              type="textarea"
              minRows={5}
              className="padded rounded elevated flex-grow"
              value={templateStore.template}
              onChange={({ target: { value } }) =>
                templateDispatch({ type: "template/update", value })
              }
              placeholder="...Paste your template here..."
            ></TextareaAutosize>
          </div>
          <div className="row flex-end">
            {templateEdited && (
              <input
                style={{ marginRight: "20px" }}
                type="button"
                value="Update"
                onClick={() =>
                  presetDispatch({
                    type: "preset/template/update",
                    value: templateStore,
                  })
                }
              ></input>
            )}
            <div className="column ">
              <input
                type="text"
                value={newTemplateName}
                onChange={({ target: { value } }) => setNewTemplateName(value)}
                onKeyPress={({ code }) => {
                  if (code === "Enter") {
                    presetDispatch({
                      type: "preset/template/add",
                      value: {
                        templateStore,
                        newTemplateName,
                        templateDispatch,
                      },
                    });

                    setNewTemplateName("");
                  }
                }}
              ></input>
              <input
                type="button"
                value="Save as New"
                disabled={
                  !newTemplateName ||
                  newTemplateName.length === 0 ||
                  presetStore.TemplateStates[newTemplateName]
                }
                onClick={() => {
                  presetDispatch({
                    type: "preset/template/add",
                    value: {
                      templateStore,
                      newTemplateName,
                      templateDispatch,
                    },
                  });

                  setNewTemplateName("");
                }}
              ></input>
            </div>
          </div>
        </div>
      </div>
      {/* Outputs*/}
      <div className="inputs row padded flex-start">
        {/* Add new Key*/}
        <div className="wide column  padded rounded elevated bordered">
          <div className="row lightgrey rounded">Output</div>
          <div className="row flex-grow padded-half">
            <TextareaAutosize
              type="textarea"
              minRows={5}
              className="padded rounded elevated flex-grow"
              value={templateOutput}
              placeholder="Your text will appear here once entered"
            ></TextareaAutosize>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatedGenerator;
