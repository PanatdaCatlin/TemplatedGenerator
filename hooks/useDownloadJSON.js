function downloadJSON(filename, json) {
  var blob = new Blob([JSON.stringify(json)], { type: "text/json" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

function readJSON(file, callback) {
  const fileReader = new FileReader();
  fileReader.onloadend = (e) => {
    callback(JSON.parse(fileReader.result));
  };
  fileReader.readAsText(file);
}
export { downloadJSON, readJSON };
