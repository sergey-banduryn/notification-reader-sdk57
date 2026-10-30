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
} from "react-native";
import RNAndroidNotificationListener from "react-native-android-notification-listener";

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
        setHasListenerPermission(status !== "denied");
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
            ? "Разрешение получено"
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
});
