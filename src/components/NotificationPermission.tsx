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
  Linking,
} from "react-native";
import RNAndroidNotificationListener from "react-native-android-notification-listener";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";
import {
  startForegroundService,
  stopForegroundService,
} from "@/services/ForegroundService";
import { logError } from "@/services/LoggerService";
import notifee from "@notifee/react-native";

export const NotificationPermission: React.FC = () => {
  const [hasListenerPermission, setHasListenerPermission] =
    useState<boolean>(false);

  const checkListenerPermission = async (): Promise<void> => {
    if (Platform.OS !== "android") {
      setHasListenerPermission(false);
      return;
    }

    try {
      const status = await RNAndroidNotificationListener.getPermissionStatus();
      const isGranted = status !== "denied";
      setHasListenerPermission(isGranted);

      if (isGranted) {
        await startForegroundService();
      }
    } catch (error) {
      await logError("checkListenerPermission", error);
    }
  };

  useEffect(() => {
    checkListenerPermission();
  }, []);

  const requestAndroidListenerPermission = (): void => {
    if (Platform.OS === "android") {
      RNAndroidNotificationListener.requestPermission();
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
        await logError("requestIgnoreBatteryOptimization", error);
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
    try {
      await stopForegroundService();
    } catch (error) {
      await logError("exitAppCompletely", error);
    } finally {
      BackHandler.exitApp();
    }
  };

  const openNotificationListenerSettings = () => {
    if (Platform.OS === "android") {
      Linking.sendIntent(
        "android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS",
      );
    }
  };

  async function log() {
    const status = await RNAndroidNotificationListener.getPermissionStatus();
    console.log("Реальный статус разрешения:", status);
  }

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
      <TouchableOpacity
        style={[styles.permissionButton, { backgroundColor: "#007AFF" }]}
        onPress={openNotificationListenerSettings}
      >
        <Text style={styles.buttonText}>openNotificationListenerSettings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.permissionButton, { backgroundColor: "#007AFF" }]}
        onPress={() => {
          notifee.openNotificationSettings();
        }}
      >
        <Text style={styles.buttonText}>openNotifeeNotificationSettings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.permissionButton, { backgroundColor: "#007AFF" }]}
        onPress={log}
      >
        <Text style={styles.buttonText}>log</Text>
      </TouchableOpacity>
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
