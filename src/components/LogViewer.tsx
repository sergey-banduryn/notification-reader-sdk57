import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getNotificationLogs,
  getErrorLogs,
  clearAllLogs,
} from "@/services/LoggerService";

export const LogViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"notifications" | "errors">(
    "notifications",
  );
  const [logText, setLogText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLogs = async () => {
    setLoading(true);
    const content =
      activeTab === "notifications"
        ? await getNotificationLogs()
        : await getErrorLogs();
    setLogText(content);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab]);

  const handleClear = async () => {
    await clearAllLogs();
    await fetchLogs();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Логи системы</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "notifications" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("notifications")}
        >
          <Text style={styles.tabText}>Уведомления</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "errors" && styles.activeTab]}
          onPress={() => setActiveTab("errors")}
        >
          <Text style={styles.tabText}>Ошибки</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button} onPress={fetchLogs}>
          <Text style={styles.buttonText}>Обновить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30" }]}
          onPress={handleClear}
        >
          <Text style={styles.buttonText}>Очистить логи</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView style={styles.logBox}>
          <Text selectable style={styles.logText}>
            {logText}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxHeight: 400,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    padding: 8,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    borderRadius: 4,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#34C759",
    padding: 8,
    borderRadius: 6,
    flex: 0.48,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  logBox: {
    backgroundColor: "#1e1e1e",
    borderRadius: 6,
    padding: 10,
    maxHeight: 250,
  },
  logText: {
    color: "#00ff00",
    fontSize: 12,
    fontFamily: "monospace",
  },
});
