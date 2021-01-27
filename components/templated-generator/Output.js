import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import TextareaAutosize from "react-textarea-autosize";
import H2 from "../../components/H2";
const Tour = dynamic(() => import("reactour"), { ssr: false });

const steps = [
  {
    selector: ".output-container",
    content:
      "This area will update live as you type Templates, or modify KeyMap values",
  },
];

const Output = function ({ templateStore, keyMapStore }) {
  const [isTourOpen, setIsTourOpen] = useState(false);

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
    <div className="output-container wide column  padded rounded elevated bordered">
      <H2 text="Output" help={()=>setIsTourOpen(true)} />
      <div className="row flex-grow padded-half">
        <TextareaAutosize
          type="textarea"
          minRows={5}
          className="padded rounded elevated flex-grow"
          value={templateOutput}
          placeholder="Your text will appear here once entered"
        ></TextareaAutosize>
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
