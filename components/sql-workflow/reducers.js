const localStorage = global?.localStorage ?? { getItem: () => null };

const initial = {
 
};
function GetInitialState() {
  const localPresets = localStorage.getItem("SQLData");

  return localPresets !== null
    ? JSON.parse(localPresets)
    : JSON.parse(JSON.stringify(initial));
}

export {
  GetInitialState
};
