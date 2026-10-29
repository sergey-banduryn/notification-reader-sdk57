const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withAllowBackup(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    const existingReplace = mainApplication.$["tools:replace"] || "";

    if (existingReplace) {
      if (!existingReplace.includes("android:allowBackup")) {
        mainApplication.$["tools:replace"] =
          `${existingReplace},android:allowBackup`;
      }
    } else {
      mainApplication.$["tools:replace"] = "android:allowBackup";
    }

    return config;
  });
};
