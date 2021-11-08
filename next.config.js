/* eslint-disable @typescript-eslint/no-var-requires */
const withMDX = require("@next/mdx")();

const config = {
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  poweredByHeader: false,
};

module.exports = withMDX(config);
