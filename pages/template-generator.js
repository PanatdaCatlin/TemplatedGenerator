import React, { useReducer, useState, useRef, useEffect, useMemo } from "react";

import Nav from "../components/Nav";
import KeyMap from "../components/templated-generator/KeyMap";
import Template from "../components/templated-generator/Template";
import Output from "../components/templated-generator/Output";
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

function TemplatedGenerator() {
  const [templateStore, templateDispatch] = useReducer(
    TemplateReducer,
    TemplateState
  );
  const [keyMapStore, keyMapDispatch] = useReducer(KeyMapReducer, KeyMapState);
  const [presetStore, presetDispatch] = useReducer(PresetReducer, PresetState);

  return (
    <div className="view-wrapper">
      <Nav title="City Service Content Generator" />

      <SectionHeader text="Live Template Constructor" dark />

      <div className="inputs row padded flex-wrap">
        <KeyMap {...{ presetStore, presetDispatch, keyMapStore, keyMapDispatch }} />
        <Template {...{ presetStore, presetDispatch, templateStore, templateDispatch }} />
      </div>

      <div className="inputs row padded flex-start">
        <Output {...{ templateStore, keyMapStore }} />
      </div>
    </div>
  );
}

export default TemplatedGenerator;
