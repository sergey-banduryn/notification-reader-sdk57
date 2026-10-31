import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppState,
  AppStateStatus,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import RNAndroidNotificationListener from "react-native-android-notification-listener";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";
import {
  startForegroundService,
  stopForegroundService,
} from "@/services/ForegroundService";

export const NotificationPermission: React.FC = () => {
  const [hasListenerPermission, setHasListenerPermission] =
    useState<boolean>(false);

  const checkListenerPermission = async (
    nextAppState?: AppStateStatus,
    force = false,
  ): Promise<void> => {
    if (Platform.OS !== "android") {
      setHasListenerPermission(false);
      return;
    }

    if (nextAppState === "active" || force) {
      try {
        const status =
          await RNAndroidNotificationListener.getPermissionStatus();
        const isGranted = status !== "denied";
        setHasListenerPermission(isGranted);

        if (isGranted) {
          await startForegroundService();
        }
      } catch (error) {
        console.error("Ошибка проверки прав доступа:", error);
      }
    }
  };

  useEffect(() => {
    checkListenerPermission(undefined, true);
    const appStateListener = AppState.addEventListener(
      "change",
      checkListenerPermission,
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  const requestAndroidListenerPermission = (): void => {
    if (Platform.OS === "android") {
      RNAndroidNotificationListener.requestPermission();
    } else {
      Alert.alert(
        "Информация",
        "Перехват уведомлений доступен только на Android",
      );
    }
  };

  const requestIgnoreBatteryOptimization = async (): Promise<void> => {
    if (Platform.OS === "android") {
      const packageName = Constants.expoConfig?.android?.package;

      try {
        await IntentLauncher.startActivityAsync(
          "android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
          { data: `package:${packageName}` },
        );
      } catch (error) {
        console.error("Ошибка запроса отключения оптимизации батареи:", error);
      }
    }
  };

  const openBatterySettings = (): void => {
    requestIgnoreBatteryOptimization();
  };

  const exitApp = async () => {
    // Завершаем процесс приложения на Android
    BackHandler.exitApp();
  };

  const exitAppCompletely = async () => {
    // Сначала останавливаем фоновый сервис
    await stopForegroundService();

    // Завершаем процесс приложения на Android
    BackHandler.exitApp();
  };

  return (
    <View style={styles.permissionCard}>
      <Text style={styles.permissionTitle}>Доступ к уведомлениям:</Text>
      <Text
        style={[
          styles.permissionStatus,
          { color: hasListenerPermission ? "#34C759" : "#FF3B30" },
        ]}
      >
        {Platform.OS !== "android"
          ? "Работает только на Android"
          : hasListenerPermission
            ? "Разрешение получено (Служба активна)"
            : "Доступ не предоставлен"}
      </Text>

      {Platform.OS === "android" && !hasListenerPermission && (
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestAndroidListenerPermission}
        >
          <Text style={styles.buttonText}>
            Предоставить доступ в настройках Android
          </Text>
        </TouchableOpacity>
      )}

      {Platform.OS === "android" && hasListenerPermission && (
        <>
          <TouchableOpacity
            style={[styles.permissionButton, styles.batteryButton]}
            onPress={openBatterySettings}
          >
            <Text style={styles.buttonText}>
              Отключить ограничение батареи (Doze Mode)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: "#FF3B30" }]}
            onPress={exitAppCompletely}
          >
            <Text style={styles.buttonText}>
              Остановить фоновую службу и закрыть приложение
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: "#007AFF" }]}
            onPress={exitApp}
          >
            <Text style={styles.buttonText}>Выход</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  permissionCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  permissionStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  permissionButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 5,
  },
  batteryButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});
