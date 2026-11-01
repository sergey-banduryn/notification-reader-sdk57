import React from "react";
import { StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { NotificationPermission } from "../components/NotificationPermission";
import { NotificationTester } from "../components/NotificationTester";
import { VolumeControl } from "@/components/VolumeControl";

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Уведомления</Text>
        <VolumeControl />
        <NotificationPermission />
        {/* <NotificationTester /> */}

        <TouchableOpacity
          style={styles.logsButton}
          onPress={() => router.push("/logs")}
        >
          <Text style={styles.buttonText}>Открыть логи</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07065e6b" },
  scrollContent: { padding: 20 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  logsButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
