import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationTester2: React.FC = () => {
  const [title, setTitle] = useState<string>(
    "Цехи Підприємства: Імпульс Диспетчер",
  );
  const [body, setBody] = useState<string>(
    "Привіт! Це перевірка роботи озвучування тексту",
  );

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
    <View>
      <Text style={styles.label}>Заголовок:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок"
        multiline
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
  label: { fontSize: 14, color: "#333", marginBottom: 4, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 60,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    alignSelf: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
