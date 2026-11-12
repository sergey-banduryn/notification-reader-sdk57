import notifee from '@notifee/react-native';
import { Linking } from 'react-native';

const openNotificationListenerSettings = () => {
  void Linking.sendIntent(
    'android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS',
  );
};

const openNotifeeSettings = () => {
  void notifee.openNotificationSettings();
};

const openBatteryOptimizationSettings = () => {
  void notifee.openBatteryOptimizationSettings();
};

export {
  openBatteryOptimizationSettings,
  openNotifeeSettings,
  openNotificationListenerSettings,
};
