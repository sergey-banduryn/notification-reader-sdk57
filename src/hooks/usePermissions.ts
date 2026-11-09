import { useState, useCallback } from "react";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import RNAndroidNotificationListener from "react-native-android-notification-listener";

export const usePermissions = () => {
  const [isListenerGranted, setIsListenerGranted] = useState<boolean>(false);
  const [isNotifeeGranted, setIsNotifeeGranted] = useState<boolean>(false);
  const [isBatteryOptEnabled, setIsBatteryOptEnabled] =
    useState<boolean>(false);

  const checkPermissions = useCallback(async (): Promise<void> => {
    try {
      const listenerStatus =
        await RNAndroidNotificationListener.getPermissionStatus();
      setIsListenerGranted(listenerStatus === "authorized");

      const settings = await notifee.getNotificationSettings();
      const notifeeAuthorized =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;

      setIsNotifeeGranted(notifeeAuthorized);

      const batteryStatus = await notifee.isBatteryOptimizationEnabled();
      setIsBatteryOptEnabled(batteryStatus);
    } catch (error) {
      console.error("Ошибка при проверке разрешений:", error);
    }
  }, []);

  return {
    isListenerGranted,
    isNotifeeGranted,
    isBatteryOptEnabled,
    checkPermissions,
  };
};
