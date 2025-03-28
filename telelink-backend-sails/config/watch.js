module.exports.watch = {
  active: true,
  usePolling: true,
  dirs: ["api/models", "api/controllers", "api/services", "config/locales","api/policies","api/helpers"],
  ignored: [
    // Ignore all files with .ts extension
    "**.ts",
    "node_modules",
  ],
};
