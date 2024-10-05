// config-overrides.js
module.exports = {
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: require.resolve("path-browserify"),
        fs: false, // Ignore 'fs' module in browser
      };
      return config;
    },
  };
  