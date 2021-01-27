import React, { useState, useRef, useMemo } from "react";
import { downloadJSON, readJSON } from "../../hooks/useDownloadJSON";

const KeyMap = function ({
  presetStore,
  presetDispatch,
  keyMapStore,
  keyMapDispatch,
}) {
  const [newKey, setNewKey] = useState("");
  const [keyMapFilter, setKeyMapFilter] = useState("");
  const [confirmKill, setConfirmKill] = useState(null);

  const keyMapFileInput = useRef();
  const [newKeyMapName, setNewKeyMapName] = useState("");
  const [upload, setUpload] = useState(false);

  const addKey = () => {
    keyMapDispatch({ type: "key/add", value: newKey });
    setNewKey("");
  };
  const keyMapEdited = useMemo(
    () =>
      JSON.stringify(keyMapStore.keyMap) !==
      JSON.stringify(presetStore.KeyMapStates[keyMapStore.name].keyMap),
    [keyMapStore, presetStore]
  );
  return (
    <div
      className="column padded elevated rounded bordered"
      style={{ flexGrow: 1 }}
    >
      <div className="row lightgrey rounded">{keyMapStore.name} Keys</div>
      <div className="row flex-grow">
        <div className="column padded flex-start tall">
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
            className="column flex-start bordered elevated "
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
          <div className="column">
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
          <div className="row flex-space-between pt">
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
                      onKeyPress={({ code }) => code === "Enter" && addKey()}
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
      </div>
    </div>
  );
};

export default KeyMap;
