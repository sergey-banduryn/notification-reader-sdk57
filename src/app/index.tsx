import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  AppState,
  AppStateStatus,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Speech from "expo-speech";
import {
  getPermissionStatus,
  requestPermission,
} from "react-native-android-notification-listener";
import { VoiceSettings, VoiceSettingsData } from "../components/VoiceSettings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen(): React.JSX.Element {
  const [title, setTitle] = useState<string>("Тестовое уведомление");
  const [body, setBody] = useState<string>(
    "Привет! Это проверка работы озвучивания текста.",
  );
  const [hasListenerPermission, setHasListenerPermission] =
    useState<boolean>(false);

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsData>({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: undefined,
  });

  const voiceSettingsRef = useRef<VoiceSettingsData>(voiceSettings);
  useEffect(() => {
    voiceSettingsRef.current = voiceSettings;
  }, [voiceSettings]);

  // Безопасная проверка разрешения только для Android
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
        const status = await getPermissionStatus();
        setHasListenerPermission(status !== "denied");
      } catch (error) {
        console.error("Ошибка проверки прав доступа:", error);
      }
    }
  };

  useEffect(() => {
    async function requestLocalPermissions(): Promise<void> {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Внимание",
          "Разрешение на отправку локальных уведомлений не получено",
        );
      }
    }
    requestLocalPermissions();

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const textToSpeak = notification.request.content.body;
        if (textToSpeak) {
          Speech.stop();
          const currentSettings = voiceSettingsRef.current;
          Speech.speak(textToSpeak, {
            language: "ru-RU",
            rate: currentSettings.rate,
            pitch: currentSettings.pitch,
            volume: currentSettings.volume,
            voice: currentSettings.voice,
          });
        }
      },
    );

    checkListenerPermission(undefined, true);
    const appStateListener = AppState.addEventListener(
      "change",
      checkListenerPermission,
    );

    return () => {
      subscription.remove();
      appStateListener.remove();
    };
  }, []);

  const requestAndroidListenerPermission = (): void => {
    if (Platform.OS === "android") {
      requestPermission();
    } else {
      Alert.alert(
        "Информация",
        "Перехват уведомлений доступен только на Android",
      );
    }
  };

  const sendNotification = async (): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  };

  const speakText = (): void => {
    Speech.stop();
    Speech.speak(`${title}. ${body}`, {
      language: "ru-RU",
      rate: voiceSettings.rate,
      pitch: voiceSettings.pitch,
      volume: voiceSettings.volume,
      voice: voiceSettings.voice,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Тестирование Уведомлений и TTS</Text>

        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            Доступ к уведомлениям Telegram:
          </Text>
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

        <Text style={styles.label}>Заголовок уведомления:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Заголовок"
        />

        <Text style={styles.label}>Текст для озвучки:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={body}
          onChangeText={setBody}
          placeholder="Текст сообщения"
          multiline
        />

        <VoiceSettings
          settings={voiceSettings}
          onChangeSettings={setVoiceSettings}
        />

        <TouchableOpacity style={styles.button} onPress={sendNotification}>
          <Text style={styles.buttonText}>
            🔔 Отправить локальное уведомление (через 2 сек)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.speakButton]}
          onPress={speakText}
        >
          <Text style={styles.buttonText}>🔊 Озвучить прямо сейчас</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { padding: 20 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
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
  permissionStatus: { fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  permissionButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  label: { fontSize: 14, color: "#333", marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: { height: 70, textAlignVertical: "top" },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  speakButton: { backgroundColor: "#34C759" },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
});
