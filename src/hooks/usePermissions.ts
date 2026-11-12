import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { useCallback, useState } from 'react';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';

import { logError } from '@/services/LoggerService';

const usePermissions = () => {
  const [isListenerGranted, setIsListenerGranted] = useState<boolean>(false);
  const [isNotifeeGranted, setIsNotifeeGranted] = useState<boolean>(false);
  const [isBatteryOptEnabled, setIsBatteryOptEnabled] =
    useState<boolean>(false);

  const checkPermissions = useCallback(async (): Promise<void> => {
    try {
      const listenerStatus =
        await RNAndroidNotificationListener.getPermissionStatus();
      setIsListenerGranted(listenerStatus === 'authorized');

      const settings = await notifee.getNotificationSettings();
      const notifeeAuthorized =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;

      setIsNotifeeGranted(notifeeAuthorized);

      const batteryStatus = await notifee.isBatteryOptimizationEnabled();
      setIsBatteryOptEnabled(batteryStatus);
    } catch (error) {
      void logError('checkPermissions', error);
    }
  }, []);

  return {
    checkPermissions,
    isBatteryOptEnabled,
    isListenerGranted,
    isNotifeeGranted,
  };
};

export { usePermissions };
