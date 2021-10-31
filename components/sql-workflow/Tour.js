import React from "react";
import dynamic from "next/dynamic";

const ReactTour = dynamic(() => import("reactour"), { ssr: false });

const steps = [
  {
    selector: ".inputs",
    content: "Create templated outputs by pairing a Key-Map with a Template.",
  },
  {
    selector: ".template-container",
    content:
      "Inside the Template, use {{ }} to wrap Keys. The Output will replace your {{ }} with the values provided for that Key",
  },
  {
    selector: ".keymap-container",
    content:
      "Add and Remove Keys which will match and replace {{ }} areas of the Template",
  },
];

function Tour({ isTourOpen, setIsTourOpen }) {
  return (
    <ReactTour
      steps={steps}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
    />
  );
}

export default Tour;
