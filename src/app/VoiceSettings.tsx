import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import { Stepper } from "./Stepper";

export interface VoiceSettingsData {
  rate: number;
  pitch: number;
  volume: number;
  voice?: string;
}

interface VoiceSettingsProps {
  settings: VoiceSettingsData;
  onChangeSettings: (settings: VoiceSettingsData) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  settings,
  onChangeSettings,
}) => {
  const [voices, setVoices] = useState<Speech.Voice[]>([]);

  useEffect(() => {
    async function loadVoices() {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const ruVoices = availableVoices.filter((v) =>
        v.language.toLowerCase().startsWith("ru"),
      );
      setVoices(ruVoices.length > 0 ? ruVoices : availableVoices);
    }
    loadVoices();
  }, []);

  const updateSetting = <K extends keyof VoiceSettingsData>(
    key: K,
    value: VoiceSettingsData[K],
  ) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Настройки воспроизведения</Text>

      {/* Скорость */}
      <Stepper
        label="Скорость (Rate)"
        value={settings.rate}
        min={0.25}
        max={2.0}
        step={0.1}
        onChange={(val) => updateSetting("rate", val)}
      />

      {/* Тон */}
      <Stepper
        label="Тон (Pitch)"
        value={settings.pitch}
        min={0.5}
        max={2.0}
        step={0.1}
        onChange={(val) => updateSetting("pitch", val)}
      />

      {/* Громкость */}
      <Stepper
        label="Громкость"
        value={settings.volume}
        min={0.0}
        max={1.0}
        step={0.1}
        formatValue={(val) => `${Math.round(val * 100)}%`}
        onChange={(val) => updateSetting("volume", val)}
      />

      {/* Выбор диктора */}
      <Text style={styles.label}>Выбор диктора:</Text>
      <ScrollView style={styles.voiceList} nestedScrollEnabled>
        {voices.map((v) => {
          const isSelected = settings.voice === v.identifier;
          return (
            <TouchableOpacity
              key={v.identifier}
              style={[styles.voiceItem, isSelected && styles.selectedVoiceItem]}
              onPress={() => updateSetting("voice", v.identifier)}
            >
              <Text
                style={[
                  styles.voiceText,
                  isSelected && styles.selectedVoiceText,
                ]}
              >
                {v.name} ({v.language})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  voiceList: {
    // maxHeight: 300,
    maxHeight: 'auto',
  },
  voiceItem: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  selectedVoiceItem: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  voiceText: {
    fontSize: 12,
    color: "#333",
  },
  selectedVoiceText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
