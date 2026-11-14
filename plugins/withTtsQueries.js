const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withTtsQueries(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest.queries) {
      manifest.queries = [{}];
    }
    if (!manifest.queries[0].intent) {
      manifest.queries[0].intent = [];
    }

    const exists = manifest.queries[0].intent.some(
      (item) =>
        item.action?.[0]?.$?.['android:name'] ===
        'android.intent.action.TTS_SERVICE',
    );

    if (!exists) {
      manifest.queries[0].intent.push({
        action: [
          { $: { 'android:name': 'android.intent.action.TTS_SERVICE' } },
        ],
      });
    }

    return config;
  });
};
