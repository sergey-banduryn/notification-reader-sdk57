import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  getSpeechConfigByText,
  type SpeechConfig,
} from '@/services/LanguageService';

type TestPreset = {
  label: string;
  text: string;
};

const TEST_PRESETS: TestPreset[] = [
  {
    label: '1. УКР (уникальные буквы)',
    text: 'Увага! Перевірка лінії живлення в цеху №2.',
  },
  {
    label: '2. РУС (уникальные буквы)',
    text: 'Внимание! Обрыв электросети в цехе №2.',
  },
  {
    label: '3. УКР (без уник. букв → ML Kit)',
    text: 'Тривога! Пожежа в цеху!',
  },
  {
    label: '4. РУС (без уник. букв → ML Kit)',
    text: 'Тревога! Пожар в цеху!',
  },
  {
    label: '5. Смешанный текст → ML Kit',
    text: 'Внимание! Перевірка датчика дыма та освітлення.',
  },
  {
    label: '6. Только цифры → Fallback (УКР)',
    text: '12345 — №404',
  },
];

Notifications.setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
});

const LanguageTester: React.FC = () => {
  const [title, setTitle] = useState<string>(
    'Цехи Підприємства: Імпульс Диспетчер',
  );
  const [body, setBody] = useState<string>(TEST_PRESETS[0].text);
  const [detectedConfig, setDetectedConfig] = useState<null | SpeechConfig>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const checkLanguage = async (): Promise<void> => {
      const cleanedText = body.replace('Імпульс Диспетчер', '').trim();

      if (!cleanedText) {
        if (isMounted) {
          setDetectedConfig(null);
        }

        return;
      }

      const config = await getSpeechConfigByText(cleanedText);

      if (isMounted) {
        setDetectedConfig(config);
      }
    };

    void checkLanguage();

    return () => {
      isMounted = false;
    };
  }, [body]);

  const sendNotification = async (textToSend = body): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        body: textToSend,
        title,
      },
      trigger: null,
    });
  };

  const handleSelectPreset = (presetText: string): void => {
    setBody(presetText);
    void sendNotification(presetText);
  };

  return (
    <ScrollView style={styles.container}>
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
        placeholder='Введите текст для проверки'
        style={[styles.input, styles.textArea]}
        value={body}
      />

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          Определён язык:{' '}
          <Text style={styles.resultBold}>
            {detectedConfig ? detectedConfig.language : '—'}
          </Text>
        </Text>
        <Text style={styles.resultSubText}>
          Голос: {detectedConfig ? detectedConfig.voice : '—'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => void sendNotification()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>🔔 Отправить уведомление</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        Быстрые тесты (нажмите для отправки):
      </Text>
      {TEST_PRESETS.map((preset) => (
        <TouchableOpacity
          key={preset.label}
          onPress={() => {
            handleSelectPreset(preset.text);
          }}
          style={styles.presetButton}
        >
          <Text style={styles.presetLabel}>{preset.label}</Text>
          <Text style={styles.presetText}>{preset.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 6,
    marginBottom: 16,
    padding: 12,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  container: { flex: 1 },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 10,
    padding: 8,
  },
  label: { color: '#333333', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  presetButton: {
    backgroundColor: '#F2F4F7',
    borderColor: '#D0D5DD',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
    padding: 10,
  },
  presetLabel: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  presetText: { color: '#1D2939', fontSize: 14 },
  resultBold: { color: '#007AFF', fontWeight: '700' },
  resultBox: {
    backgroundColor: '#EBF5FF',
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
  },
  resultSubText: { color: '#475467', fontSize: 12, marginTop: 2 },
  resultText: { color: '#101828', fontSize: 14 },
  sectionTitle: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
});

export { LanguageTester };
