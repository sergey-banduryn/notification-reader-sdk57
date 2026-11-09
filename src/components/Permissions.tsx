import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  openBatteryOptimizationSettings,
  openNotifeeSettings,
  openNotificationListenerSettings,
} from "@/helpers/settings";

type Permissions = {
  isListenerGranted: boolean;
  isNotifeeGranted: boolean;
  isBatteryOptEnabled: boolean;
  checkPermissions: () => Promise<void>;
};

export const Permissions: React.FC<{ permissions: Permissions }> = ({
  permissions,
}) => {
  const {
    isListenerGranted,
    isNotifeeGranted,
    isBatteryOptEnabled,
    checkPermissions,
  } = permissions;

  return (
    <View>
      <Text style={styles.title}>Разрешения</Text>
      <View style={styles.permissionCards}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            Доступ к чтению всех уведомлений
          </Text>
          <Text style={styles.statusText}>
            Статус:{" "}
            <Text
              style={isListenerGranted ? styles.grantedText : styles.deniedText}
            >
              {isListenerGranted ? "Разрешено" : "Запрещено"}
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={openNotificationListenerSettings}
          >
            <Text style={styles.buttonText}>Настройки</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            Отображать закрепленное уведомление
          </Text>
          <Text style={styles.statusText}>
            Статус:{" "}
            <Text
              style={isNotifeeGranted ? styles.grantedText : styles.deniedText}
            >
              {isNotifeeGranted ? "Разрешено" : "Запрещено"}
            </Text>
          </Text>
          <TouchableOpacity style={styles.button} onPress={openNotifeeSettings}>
            <Text style={styles.buttonText}>Настройки</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            Выключить оптимизацию батареи
          </Text>
          <Text style={styles.statusText}>
            Статус:{" "}
            <Text
              style={
                !isBatteryOptEnabled ? styles.grantedText : styles.deniedText
              }
            >
              {!isBatteryOptEnabled ? "Выключено" : "Включено"}
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={openBatteryOptimizationSettings}
          >
            <Text style={styles.buttonText}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={checkPermissions}>
        <Text style={styles.refreshButtonText}>Проверить разрешения</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  permissionCards: {
    gap: 10,
  },
  permissionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    gap: 10,
    alignItems: "flex-start",
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  statusText: {
    fontSize: 14,
    color: "#495057",
  },
  grantedText: {
    color: "#28A745",
    fontWeight: "bold",
  },
  deniedText: {
    color: "#DC3545",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  refreshButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 16,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
