const debug = process.env.NODE_ENV !== "production";

module.exports = {
  exportPathMap: function () {
    // /Next-React-Components
    return {
      "/": { page: "/" },
     
    };
  },
  assetPrefix: !debug
    ? "/TemplatedGenerator"
    : "",
};
