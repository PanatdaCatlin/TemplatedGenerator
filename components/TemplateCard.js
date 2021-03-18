import React, { useState, useRef, useEffect } from "react";

import { Card } from "semantic-ui-react";
import { EditableCardContent } from "./EditableCardContent";
export default function TemplateCard({
  title,
  description,
  content,
  service,
  index,
  city,
}) {
  const titleArea = useRef(null);
  const descriptionArea = useRef(null);
  const contentArea = useRef(null);
  const [displayTitle, setDisplayTitle] = useState(title);
  const [displayDescription, setDisplayDescription] = useState(description);
  const [displayContent, setDisplayContent] = useState(content);

  useEffect(() => {
    setDisplayTitle(title);
    setDisplayDescription(description);
    setDisplayContent(content);
  }, [title, description, content]);

  const [edited, setEdited] = useState(false);

  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const fields = [
    {
      name: "Title",
      state: displayTitle,
      setter: setDisplayTitle,
      ref: titleArea,
      copied: copiedTitle,
      copiedSetter: setCopiedTitle,
    },
    {
      name: "Description",
      state: displayDescription,
      setter: setDisplayDescription,
      ref: descriptionArea,
      copied: copiedDesc,
      copiedSetter: setCopiedDesc,
    },
    {
      name: "Content",
      state: displayContent,
      setter: setDisplayContent,
      ref: contentArea,
      copied: copiedContent,
      copiedSetter: setCopiedContent,
    },
  ];
  return (
    <div className="column padded elevated flex-shrink flex-grow" style={{maxWidth:'400px'}}>
      <div className="row flex-space-between">
        <h2 >{`Service: ${service}`}</h2>
        {edited && (
          <button
          
            onClick={() => {
              setDisplayTitle(title);
              setDisplayDescription(description);
              setDisplayContent(content);
              setEdited(false);
            }}
          >
            Revert Changes
          </button>
        )}
      </div>
      {fields.map(({ name, state, ref, setter, copied, copiedSetter }) => (
        <EditableCardContent
          {...{
            key: name,
            name,
            state,
            ref,
            setter,
            copied,
            copiedSetter,
            setEdited,
          }}
        />
      ))}
    </div>
  );
}
