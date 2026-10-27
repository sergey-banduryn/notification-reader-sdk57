import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Speech from "expo-speech";
import { VoiceSettings, VoiceSettingsData } from "./VoiceSettings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  const [title, setTitle] = useState<string>("Тестовое уведомление");
  const [body, setBody] = useState<string>(
    "Привет! Это проверка работы озвучивания текста.",
  );

  // 1. Состояние для хранения настроек голоса
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsData>({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: undefined,
  });

  // 2. Ref для доступа к актуальным настройкам внутри слушателя уведомлений
  const voiceSettingsRef = useRef(voiceSettings);
  useEffect(() => {
    voiceSettingsRef.current = voiceSettings;
  }, [voiceSettings]);

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Внимание",
          "Разрешение на отправку уведомлений не получено",
        );
      }
    }
    requestPermissions();

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

    return () => subscription.remove();
  }, []);

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  };

  const speakText = () => {
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

        {/* 3. Подключение компонента настроек */}
        <VoiceSettings
          settings={voiceSettings}
          onChangeSettings={setVoiceSettings}
        />

        <TouchableOpacity style={styles.button} onPress={sendNotification}>
          <Text style={styles.buttonText}>
            🔔 Отправить уведомление (через 2 сек)
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  speakButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
