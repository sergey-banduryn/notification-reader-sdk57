import React, { useState, useEffect } from "react";
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationTester: React.FC = () => {
  const [title, setTitle] = useState<string>(
    "Цехи Підприємства: Імпульс Диспетчер",
  );
  const [body, setBody] = useState<string>(
    "Привіт! Це перевірка роботи озвучування тексту",
  );

  useEffect(() => {
    async function requestPermissions(): Promise<void> {
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
          Speech.speak(textToSpeak, { language: "uk-UA" });
        }
      },
    );

    return () => subscription.remove();
  }, []);

  const sendNotification = async (): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Заголовок:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок"
      />

      <Text style={styles.label}>Текст сообщения:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={body}
        onChangeText={setBody}
        placeholder="Текст"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={sendNotification}>
        <Text style={styles.buttonText}>🔔 Отправить уведомление</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  label: { fontSize: 13, color: "#333", marginBottom: 4, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  textArea: { height: 60, textAlignVertical: "top" },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
