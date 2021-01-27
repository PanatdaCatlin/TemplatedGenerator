import React, { useState, useRef, useMemo } from "react";
import { downloadJSON, readJSON } from "../../hooks/useDownloadJSON";
import TextareaAutosize from "react-textarea-autosize";

const Template = function ({
  presetStore,
  presetDispatch,
  templateStore,
  templateDispatch,
}) {
  const [newTemplateName, setNewTemplateName] = useState("");
  const [templateFilter, setTemplateFilter] = useState("");
  const [confirmKill, setConfirmKill] = useState(null);
  const templateFileInput = useRef();
  const templateEdited = useMemo(
    () =>
      templateStore.template !==
      presetStore.TemplateStates[templateStore.name].template,
    [templateStore, presetStore]
  );
  const [upload, setUpload] = useState(false);

  return (
    <div
      className=" column  padded rounded elevated bordered"
      style={{ flexGrow: 5 }}
    >
      <div className="row lightgrey rounded">{templateStore.name} Template</div>

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
            className="column flex-start bordered elevated "
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
                    className={`row flex-space-between bordered-b ${
                      templateStore.name === presetName ? "lightgrey" : ""
                    }`}
                  >
                    <div
                      className="flex-grow"
                      key={presetName}
                      onClick={({ target: { value } }) => {
                        templateDispatch({
                          type: "template/load-from-preset",
                          value: { presetStore, name: presetName },
                        });
                      }}
                      style={{ padding: "3px" }}
                    >
                      {presetName}
                    </div>
                    {presetName !== templateStore.name && (
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
                                  type: "preset/template/delete",
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
            <div className="column">
              <input
                type="text"
                placeholder="...new template name"
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
                value="Add"
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
          <div className="row wide flex-space-between pt">
            {!upload && (
              <input
                type="button"
                value="Upload File"
                onClick={() => setUpload(true)}
              />
            )}
            {upload && (
              <input
                ref={templateFileInput}
                type="file"
                accept="text/json"
                onChange={(event) => {
                  readJSON(templateFileInput.current.files[0], (content) =>
                    presetDispatch({
                      type: "preset/template/load-from-file",
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
      </div>
    </div>
  );
};

export default Template;
