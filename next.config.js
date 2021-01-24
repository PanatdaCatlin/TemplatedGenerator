const production = process.env.NODE_ENV === "production";

module.exports = {
  exportPathMap: function () {
    // /Next-React-Components
    return {
      "/": { page: "/" },
    };
  },
  basePath: production ? process.env.NEXT_PUBLIC_ASSET_PREFIX : "",
  assetPrefix: production ? process.env.NEXT_PUBLIC_ASSET_PREFIX : "",
  github: production ? process.env.NEXT_PUBLIC_GITHUB : "",
};
