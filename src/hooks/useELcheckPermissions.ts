import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const useELcheckPermissions = (checkPermissions: () => Promise<void>) => {
  useEffect(() => {
    void checkPermissions();

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          void checkPermissions();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkPermissions]);
};

export { useELcheckPermissions };
