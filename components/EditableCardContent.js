import React from "react";
import { Card } from "semantic-ui-react";

const EditableCardContent = React.forwardRef(function (props, ref) {
  const { name, state, setter, copied, copiedSetter, setEdited } = props;
  return (
    <div className="column pt">
      <h3 className="row flex-start">{name}</h3>
      <textarea
        className="row wide"
        style={{minHeight:'150px', minWidth:'500px'}}
        ref={ref}
        value={state}
        onChange={(ev) => {
          setter(ev.target.value);
          setEdited(true);
        }}
      />

      <button
        onClick={() => {
          ref.current.select();
          document.execCommand("copy");
          copiedSetter(true);
          setTimeout(() => copiedSetter(false), 1000);
        }}
      >
        {copied ? "Coppied!" : "Copy"}
      </button>
    </div>
  );
});
export { EditableCardContent };
