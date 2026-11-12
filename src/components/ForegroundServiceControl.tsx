import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import {
  isForegroundServiceRunning,
  startForegroundService,
  stopForegroundService,
} from '@/services/ForegroundService';

type Permissions = {
  checkPermissions: () => Promise<void>;
  isBatteryOptEnabled: boolean;
  isListenerGranted: boolean;
  isNotifeeGranted: boolean;
};

const ForegroundServiceControl: React.FC<{
  permissions: Permissions;
}> = ({ permissions }) => {
  const { isNotifeeGranted } = permissions;
  const [isPinned, setIsPinned] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const toggleSwitch = () => {
    setIsPinned((prev) => !prev);
  };

  const isAllGranted = isNotifeeGranted && isPinned;

  // 1. Первичная проверка состояния сервиса при монтировании
  useEffect(() => {
    let isMounted = true;

    void isForegroundServiceRunning().then((running) => {
      if (isMounted) {
        setIsRunning(running);
        setIsPinned(running);
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Управление сервисом ПОСЛЕ завершения первичного анализа
  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (isAllGranted && !isRunning) {
      void startForegroundService().then(() => {
        setIsRunning(true);
      });
    } else if (!isPinned && isRunning) {
      void stopForegroundService().then(() => {
        setIsRunning(false);
      });
    }
  }, [isAllGranted, isReady, isRunning, isPinned]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Закрепить уведомление:</Text>
      <Switch
        disabled={!isNotifeeGranted && !isPinned}
        onValueChange={toggleSwitch}
        style={styles.switch}
        thumbColor={isPinned ? '#FFFFFF' : '#F4F3F4'}
        trackColor={{ false: '#767577', true: '#4BA3E3' }}
        value={isPinned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  switch: { transform: [{ scale: 1.5 }] },
});

export { ForegroundServiceControl };
