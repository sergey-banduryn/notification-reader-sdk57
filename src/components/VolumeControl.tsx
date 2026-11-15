import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  loadMuted,
  loadVolume,
  saveMuted,
  saveVolume,
} from '@/services/StorageService';

import { Stepper } from './Stepper';

const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    void loadVolume().then(setVolume);
    void loadMuted().then(setIsMuted);
  }, []);

  const handleVolumeChange = async (newValue: number) => {
    setVolume(newValue);
    await saveVolume(newValue);

    if (newValue > 0 && isMuted) {
      setIsMuted(false);
      await saveMuted(false);
    }
  };

  const handleToggleMute = async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    await saveMuted(nextMuted);
  };

  return (
    <View style={styles.container}>
      <View style={isMuted ? styles.dimmed : undefined}>
        <Stepper
          formatValue={(val) => `${String(Math.round(val * 100))}%`}
          label='Громкость'
          max={1.0}
          min={0.0}
          onChange={(value) => void handleVolumeChange(value)}
          step={0.1}
          value={volume}
        />
      </View>

      <TouchableOpacity
        onPress={() => void handleToggleMute()}
        style={[styles.muteButton, isMuted && styles.muteButtonActive]}
      >
        <Text style={styles.muteButtonText}>
          {isMuted ? 'Включить звук' : 'Без звука'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  dimmed: {
    opacity: 0.5,
  },
  muteButton: {
    alignSelf: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    marginTop: 8,
    padding: 10,
  },
  muteButtonActive: {
    backgroundColor: '#FF3B30',
  },
  muteButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
});

export { VolumeControl };
