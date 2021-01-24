const production = process.env.NODE_ENV === "production";

module.exports = {
  exportPathMap: function () {
    // /Next-React-Components
    return {
      "/": { page: "/" },
    };
  },
  repo: production ? process.env.NEXT_PUBLIC_REPO : "",
  github: production ? process.env.NEXT_PUBLIC_GITHUB : "",
};
