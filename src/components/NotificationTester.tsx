import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
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

export const NotificationTester: React.FC = () => {
  const [title, setTitle] = useState<string>("Тестове повідомлення");
  const [body, setBody] = useState<string>(
    "Привіт! Це перевірка роботи озвучування тексту.",
  );

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
            language: "uk-UA",
            rate: currentSettings.rate,
            pitch: currentSettings.pitch,
            volume: currentSettings.volume,
            voice: currentSettings.voice,
          });
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

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
      language: "uk-UA",
      rate: voiceSettings.rate,
      pitch: voiceSettings.pitch,
      volume: voiceSettings.volume,
      voice: voiceSettings.voice,
    });
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
