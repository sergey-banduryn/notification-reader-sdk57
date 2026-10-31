import React from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationPermission } from "../components/NotificationPermission";
import { NotificationTester } from "../components/NotificationTester";
import { VolumeControl } from "@/components/VolumeControl";

export default function HomeScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Уведомления</Text>
        <VolumeControl />
        <NotificationPermission />
        {/* <NotificationTester /> */}
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
});
