const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withAndroid14Fgs(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application?.[0];

    if (application) {
      // Находим или создаем описание сервиса Notifee Foreground Service
      if (!application.service) {
        application.service = [];
      }

      application.service.push({
        $: {
          "android:name": "app.notifee.core.ForegroundService",
          "android:foregroundServiceType": "specialUse",
        },
        property: [
          {
            $: {
              "android:name": "android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE",
              "android:value":
                "Notification reading and text to speech background service",
            },
          },
        ],
      });
    }

    return config;
  });
};
