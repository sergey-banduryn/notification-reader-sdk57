import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import {
  isForegroundServiceRunning,
  startForegroundService,
  stopForegroundService,
} from "@/services/ForegroundService";

type Permissions = {
  isListenerGranted: boolean;
  isNotifeeGranted: boolean;
  isBatteryOptEnabled: boolean;
  checkPermissions: () => Promise<void>;
};

export const ForegroundServiceControl: React.FC<{
  permissions: Permissions;
}> = ({ permissions }) => {
  const { isNotifeeGranted } = permissions;
  const [isPinned, setIsPinned] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const toggleSwitch = () => setIsPinned((prev) => !prev);

  const isAllGranted = isNotifeeGranted && isPinned;

  // 1. Первичная проверка состояния сервиса при монтировании
  useEffect(() => {
    let isMounted = true;

    isForegroundServiceRunning().then((running) => {
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
    if (!isReady) return;

    if (isAllGranted && !isRunning) {
      startForegroundService().then(() => setIsRunning(true));
    } else if (!isPinned && isRunning) {
      stopForegroundService().then(() => setIsRunning(false));
    }
  }, [isAllGranted, isReady, isRunning, isPinned]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Закрепить уведомление:</Text>
      <Switch
        disabled={!isNotifeeGranted && !isPinned}
        trackColor={{ false: "#767577", true: "#4ba3e3" }}
        thumbColor={isPinned ? "#ffffff" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isPinned}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  switch: { transform: [{ scale: 1.5 }] },
});
