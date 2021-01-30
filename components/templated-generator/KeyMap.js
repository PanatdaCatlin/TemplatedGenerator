import React, { useState, useRef, useMemo } from "react";
import { downloadJSON, readJSON } from "../../hooks/useDownloadJSON";
import dynamic from "next/dynamic";
import H2 from "../H2";

import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import TagsInput from "react-tagsinput";
import TemplatedGenerator from "./template-generator";
import ErrorBoundary from "../ErrorBoundary";

const Tour = dynamic(() => import("reactour"), { ssr: false });

const steps = [
  {
    selector: ".keymap-table",
    content:
      "The Keys and Values in this list will replace the {{Keys}} in the Template",
  },
  {
    selector: ".keyentry-create",
    content: "Add new keys to the set by entering a value and clicking Add",
  },
  {
    selector: ".keymap-list",
    content:
      "Switch between sets of Keys and Values by selecting a Set in this list",
  },
  {
    selector: ".keymap-files",
    content:
      "Download a File of all your current KeyMaps, or load a set of KeyMaps using the FilePicker",
  },
];
const KeyMap = function ({
  presetStore,
  presetDispatch,
  keyMapStore,
  keyMapDispatch,
}) {
  const [newKey, setNewKey] = useState("");
  const [keyMapFilter, setKeyMapFilter] = useState("");
  const [confirmKill, setConfirmKill] = useState(null);
  const [confirmKillKey, setConfirmKillKey] = useState(null);

  const keyMapFileInput = useRef();
  const [newKeyMapName, setNewKeyMapName] = useState("");
  const [upload, setUpload] = useState(false);

  const addKey = () => {
    keyMapDispatch({ type: "key/add", value: newKey });
    setNewKey("");
  };
  console.log({
    keyMap: keyMapStore.keyMap,
    store: presetStore.KeyMapStates[keyMapStore.name].keyMap,
  });
  const isEdited = useMemo(
    () =>
      JSON.stringify(keyMapStore.keyMap) !==
      JSON.stringify(presetStore.KeyMapStates[keyMapStore.name].keyMap),
    [keyMapStore, presetStore]
  );
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <div
      className="keymap-container column padded elevated rounded bordered"
      style={{ flexGrow: 1 }}
    >
      <H2 text={"KeyMap"} help={() => setIsTourOpen(true)}></H2>
      <div className="row flex-grow">
        <div className="column keymap-list padded flex-start tall">
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
            className=" column flex-start bordered elevated "
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
                    className={`row flex-space-between bordered-b ${
                      keyMapStore.name === presetName ? "lightgrey" : ""
                    }`}
                  >
                    <div
                      className="flex-grow"
                      key={presetName}
                      onClick={({ target: { value } }) => {
                        keyMapDispatch({
                          type: "key/load-from-preset",
                          value: { presetStore, name: presetName },
                        });
                      }}
                      style={{ padding: "3px" }}
                    >
                      {presetName}
                    </div>
                    {presetName !== keyMapStore.name && (
                      <>
                        {confirmKill !== presetName && (
                          <div
                            className="column"
                            onClick={() => setConfirmKill(presetName)}
                          >{`X`}</div>
                        )}
                        {confirmKill === presetName && (
                          <div
                            className="row flex-space-between"
                            style={{ width: "35px", marginRight: "5px" }}
                          >
                            <div
                              className="column"
                              onClick={() => setConfirmKill(null)}
                            >{`❌`}</div>
                            <div
                              className="column"
                              onClick={() =>
                                presetDispatch({
                                  type: "preset/key/delete",
                                  value: presetName,
                                })
                              }
                            >{`✅ `}</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
          </div>
          <div className="row keymap-create">
            <input
              type="text"
              value={newKeyMapName}
              placeholder="...new keymap name"
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
              value="Add"
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
          <div className="keymap-files row flex-space-between pt">
            {!upload && (
              <input
                type="button"
                value="Upload File"
                onClick={() => setUpload(true)}
              />
            )}
            {upload && (
              <input
                ref={keyMapFileInput}
                type="file"
                accept="text/json"
                onChange={(event) => {
                  readJSON(keyMapFileInput.current.files[0], (content) =>
                    presetDispatch({
                      type: "preset/key/load-from-file",
                      value: content,
                    })
                  );
                  setUpload(false);
                }}
              />
            )}
            <input
              type="button"
              value="Export"
              onClick={() =>
                downloadJSON("keyMap.json", presetStore.KeyMapStates)
              }
            />
          </div>
        </div>

        <table className="keymap-table table padded wide  ">
          <thead className="lightgrey">
            <tr>
              <th className="bordered-r bordered-b">Keys</th>
              <th className="bordered-b">Values</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(keyMapStore.keyMap).map((key) => {
              return (
                <tr key={key}>
                  <td className="bordered-r bordered-b">
                    <div className="row flex-space-between">
                      <div className="column">{`{{ ${key} }}`}</div>
                      <div className="column">
                        <>
                          {confirmKillKey !== key && (
                            <div
                              className="column"
                              onClick={() => setConfirmKillKey(key)}
                            >{`X`}</div>
                          )}
                          {confirmKillKey === key && (
                            <div
                              className="row flex-space-between"
                              style={{ width: "35px", marginRight: "5px" }}
                            >
                              <div
                                className="column"
                                onClick={() => setConfirmKillKey(null)}
                              >{`❌`}</div>
                              <div
                                className="column"
                                onClick={() =>
                                  keyMapDispatch({
                                    type: "key/delete",
                                    value: key,
                                  })
                                }
                              >{`✅ `}</div>
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                  </td>
                  <td className="row flex-grow bordered-b">
                    <TagsInput
                      className="row flex-grow flex-end"
                      value={keyMapStore.keyMap[key]}
            
                      onChange={(val) =>
                        keyMapDispatch({
                          type: "key/update",
                          value: { [key]: val.reduce((collection, string) => {
                            const splitString = string.split(", ");
                            collection.push(...splitString);
                            return collection;
                          }, []) },
                        })
                      }
                      onlyUnique
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="row keyentry-create">
                <input
                  type="text"
                  className="flexGrow "
                  value={newKey}
                  onChange={({ target: { value } }) => setNewKey(value)}
                  onKeyPress={({ code }) => code === "Enter" && addKey()}
                  placeholder="New Key"
                />
                <input
                  type="button"
                  value="Add"
                  disabled={!newKey || keyMapStore.keyMap[newKey]}
                  onClick={() => addKey()}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="row flex-end ">
        {isEdited && (
          <input
            style={{ marginRight: "20px" }}
            type="button"
            value="Save Changes"
            onClick={() =>
              presetDispatch({
                type: "preset/key/update",
                value: keyMapStore,
              })
            }
          ></input>
        )}
      </div>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};

export default (props) => (
  <ErrorBoundary
    CustomHandler={({resolve}) => {
      return (
        <input
          type="button"
          value="reset"
          onClick={() => {
            props.presetDispatch({ type: "preset/reset", value: props });
            resolve();
          }}
        />
      );
    }}
  >
    <KeyMap {...props} />
  </ErrorBoundary>
);
