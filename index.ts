import notifee from '@notifee/react-native';
import 'expo-router/entry';
import { AppRegistry, Platform } from 'react-native';

import { processNotification } from '@/services/NotificationService';

notifee.registerForegroundService(() => {
  return new Promise(() => {
    // Сервис будет удерживаться активным, пока отображается переднеплановое уведомление
  });
});

// Выполняем регистрацию Headless Task только на платформе Android
if (Platform.OS === 'android') {
  const {
    RNAndroidNotificationListenerHeadlessJsName,
  } = require('react-native-android-notification-listener');

  AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName,
    () => processNotification,
  );
}
