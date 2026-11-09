import { StyleSheet, Text, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VolumeControl } from "@/components/VolumeControl";
import { Permissions } from "@/components/Permissions";
import { useAppManager } from "@/hooks/useAppManager";
import { ForegroundServiceControl } from "@/components/ForegroundServiceControl";

export default function HomeScreen() {
  const { permissions } = useAppManager();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <Permissions {...{ permissions }} />
        <Text style={styles.title}>Настройки</Text>
        <View style={styles.settingsContainer}>
          <ForegroundServiceControl {...{ permissions }} />
          <VolumeControl />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingsContainer: {
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
});
