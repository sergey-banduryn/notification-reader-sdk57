import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogViewer } from "@/components/LogViewer";

export default function LogsScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <LogViewer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
});
