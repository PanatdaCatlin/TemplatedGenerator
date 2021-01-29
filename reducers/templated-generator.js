const localStorage = global?.localStorage ?? { getItem: () => null };
const localPresets = localStorage.getItem("Presets");
const initial = {
  KeyMapStates: {
    Default: {
      keyMap: {
        City: ["Seattle", "Tacoma"],
        Service: ["Carpet Cleaning", "Window Repair"],
        Currency: ["$$$"],
      },
    },
  },
  TemplateStates: {
    Default: {
      template: "The best {{Service}} in {{City}} for your {{Currency}}",
    },
  },
};
const PresetState =
  localPresets !== null
    ? JSON.parse(localPresets)
    : JSON.parse(JSON.stringify(initial));

const KeyMapState = {
  keyMap: JSON.parse(JSON.stringify(PresetState.KeyMapStates.Default.keyMap)),
  name: "Default",
};

const TemplateState = {
  template: JSON.parse(
    JSON.stringify(PresetState.TemplateStates.Default.template)
  ),
  name: "Default",
};

function PresetReducer(state, action) {
  const { type, value } = action;
  switch (type) {
    case "preset/template/add": {
      const { newTemplateName, templateDispatch } = value;
      state.TemplateStates[newTemplateName] = {
        template: "",
        name: newTemplateName,
      };
      templateDispatch({
        type: "template/load-from-preset",
        value: { presetStore: state, name: newTemplateName },
      });
      break;
    }
    case "preset/template/update": {
      const { template, name } = value;
      state.TemplateStates[name].template = template;
      break;
    }
    case "preset/key/update": {
      const { keyMap, name } = value;
      state.KeyMapStates[name].keyMap = keyMap;
      break;
    }
    case "preset/key/add": {
      const { newKeyMapName, keyMapDispatch } = value;
      state.KeyMapStates[newKeyMapName] = {
        keyMap: {},
        name: newKeyMapName,
      };
      keyMapDispatch({
        type: "key/load-from-preset",
        value: { presetStore: state, name: newKeyMapName },
      });
      break;
    }
    case "preset/key/delete": {
      delete state.KeyMapStates[value];
      break;
    }
    case "preset/template/delete": {
      delete state.TemplateStates[value];
      break;
    }
    case "preset/key/load-from-file": {
      state.KeyMapStates = value;
      break;
    }
    case "preset/template/load-from-file": {
      state.TemplateStates = value;

      break;
    }
    case "preset/reset": {
      const { keyMapDispatch, templateDispatch } = value;
      state = JSON.parse(JSON.stringify(initial));
      keyMapDispatch({
        type: "key/load-from-preset",
        value: { presetStore: state, name: "Default" },
      });
      templateDispatch({
        type: "template/load-from-preset",
        value: { presetStore: state, name: "Default" },
      });
      break;
    }
    default:
      console.log("Unhanlded action", { state, action });
  }
  localStorage.setItem("Presets", JSON.stringify(state));
  return { ...state };
}

function KeyMapReducer(state, action) {
  const { type, value } = action;
  switch (type) {
    case "key/add":
      if (!state.keyMap[value]) {
        state.keyMap[value] = [];
        return { ...state };
      }
      break;
    case "key/update":
      Object.assign(state.keyMap, value);
      return { ...state };
      break;
    case "key/delete":
      delete state.keyMap[value];
      return { ...state };
      break;
    case "key/load-from-preset":
      if (value.presetStore.KeyMapStates[value.name]) {
        state.name = value.name;
        // Kill any lingering Object refs
        state.keyMap = JSON.parse(
          JSON.stringify(value.presetStore.KeyMapStates[value.name].keyMap)
        );
        return { ...state };
      }
      break;
    default:
      console.log("Unhanlded action", { state, action });
  }
  return state;
}

function TemplateReducer(state, action) {
  const { type, value } = action;
  switch (type) {
    case "template/update":
      state.template = value;
      break;
    case "template/load-from-preset":
      console.log({ value });
      if (value.presetStore.TemplateStates[value.name]) {
        state.name = value.name;
        // Kill any lingering Object refs
        state.template = JSON.parse(
          JSON.stringify(value.presetStore.TemplateStates[value.name].template)
        );
      }
    default:
      console.log("Unhanlded action", { state, action });
  }
  return { ...state };
}

export {
  TemplateReducer,
  KeyMapReducer,
  PresetReducer,
  TemplateState,
  KeyMapState,
  PresetState,
};
