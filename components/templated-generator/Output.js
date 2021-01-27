import React, { useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";

const Output = function ({ templateStore, keyMapStore }) {
  const templateOutput = useMemo(() => {
    let output = templateStore.template;
    Object.keys(keyMapStore.keyMap).forEach((key) => {
      const value = keyMapStore.keyMap[key];
      if (key && value && output && output.replaceAll) {
        output = output.replaceAll(`{{${key}}}`, value);
      }
    });

    return output;
  }, [templateStore, keyMapStore]);
  return (
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
  );
};

export default Output;
