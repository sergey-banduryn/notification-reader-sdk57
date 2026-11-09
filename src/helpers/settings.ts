import notifee from "@notifee/react-native";
import { Linking } from "react-native";

export const openNotificationListenerSettings = () => {
  Linking.sendIntent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
};

export const openNotifeeSettings = () => {
  notifee.openNotificationSettings();
};

export const openBatteryOptimizationSettings = () => {
  notifee.openBatteryOptimizationSettings();
};
