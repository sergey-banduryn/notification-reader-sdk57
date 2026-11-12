import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
});

const NotificationTester2: React.FC = () => {
  const [title, setTitle] = useState<string>(
    'Цехи Підприємства: Імпульс Диспетчер',
  );
  const [body, setBody] = useState<string>(
    'Привіт! Це перевірка роботи озвучування тексту',
  );

  const sendNotification = async (): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        body: body,
        title: title,
      },
      trigger: null,
    });
  };

  return (
    <View>
      <Text style={styles.label}>Заголовок:</Text>
      <TextInput
        multiline
        onChangeText={setTitle}
        placeholder='Заголовок'
        style={styles.input}
        value={title}
      />
      <Text style={styles.label}>Текст сообщения:</Text>
      <TextInput
        multiline
        onChangeText={setBody}
        placeholder='Текст'
        style={[styles.input, styles.textArea]}
        value={body}
      />
      <TouchableOpacity
        onPress={() => void sendNotification()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>🔔 Отправить уведомление</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 6,
    marginTop: 5,
    padding: 12,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 10,
    padding: 8,
  },
  label: { color: '#333333', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
});

export { NotificationTester2 };
