import { useState } from "react";

const usePersistedString = function (key, defaultValue) {
  if (typeof localStorage !== "undefined") {
    const tryReadValue = localStorage.getItem(cacheKey);
    const [value, setValue] = useState(
      tryReadValue ? tryReadValue : defaultValue
    );
    return [
      value,
      (newValue) => {
        setValue(newValue);
        if (newValue) {
          localStorage.setItem(cacheKey, newValue);
        } else {
          localStorage.removeItem(cacheKey);
        }
      },
    ];
  }
  return useState(defaultValue);
};

export { usePersistedString };
