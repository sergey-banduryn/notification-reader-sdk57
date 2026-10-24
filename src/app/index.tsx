import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Speech from "expo-speech";

// Настройка отображения уведомлений во время работы приложения
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
          Speech.speak(textToSpeak, { language: "ru-RU" });
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
        seconds: 2,
      },
    });
  };

  const speakText = () => {
    Speech.stop();
    Speech.speak(`${title}. ${body}`, { language: "ru-RU" });
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
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
