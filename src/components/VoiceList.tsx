import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const VoiceList: React.FC = () => {
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [selectedId, setSelectedId] = useState<null | string>(null);
  const [playingId, setPlayingId] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVoices() {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const filtered = availableVoices
        .filter((v) => {
          const lang = v.language.toLowerCase();

          return lang.startsWith('uk') || lang.startsWith('ru');
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      setVoices(filtered);
      setLoading(false);
    }

    void loadVoices();

    return () => {
      void Speech.stop();
    };
  }, []);

  const handlePress = async (voice: Speech.Voice) => {
    setSelectedId(voice.identifier);
    await Speech.stop();

    if (playingId === voice.identifier) {
      setPlayingId(null);

      return;
    }

    const isUk = voice.language.toLowerCase().startsWith('uk');
    const sampleText = isUk
      ? 'Привіт! Це приклад звучання голосу.'
      : 'Привет! Это пример звучания голоса.';

    setPlayingId(voice.identifier);

    Speech.speak(sampleText, {
      language: voice.language,
      onDone: () => {
        setPlayingId(null);
      },
      onError: () => {
        setPlayingId(null);
      },
      onStopped: () => {
        setPlayingId(null);
      },
      voice: voice.identifier,
    });
  };

  if (loading) {
    return <ActivityIndicator color='#007AFF' size='small' />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Доступные голоса (УКР / РУС):</Text>
      {voices.length === 0 ? (
        <Text style={styles.emptyText}>Голоса не найдены</Text>
      ) : (
        <ScrollView nestedScrollEnabled style={styles.list}>
          {voices.map((v) => {
            const isSelected = selectedId === v.identifier;
            const isPlaying = playingId === v.identifier;

            return (
              <TouchableOpacity
                key={v.identifier}
                onPress={() => {
                  void handlePress(v);
                }}
                style={[styles.item, isSelected && styles.selectedItem]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.text, isSelected && styles.selectedText]}
                >
                  {v.name} ({v.language}) {v.name === v.identifier ? '+' : '-'}
                </Text>
                <Text style={[styles.icon, isSelected && styles.selectedText]}>
                  {isPlaying ? '⏹' : '▶'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  emptyText: {
    color: '#777777',
    fontSize: 13,
  },
  icon: {
    color: '#007AFF',
    fontSize: 13,
  },
  item: {
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    padding: 10,
  },
  list: {
    maxHeight: 250,
  },
  selectedItem: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  text: {
    color: '#333333',
    flex: 1,
    fontSize: 13,
    marginRight: 8,
  },
  title: {
    color: '#333333',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export { VoiceList };
