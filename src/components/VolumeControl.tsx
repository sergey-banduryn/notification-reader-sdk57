import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { loadVolume, saveVolume } from '@/services/StorageService';

import { Stepper } from './Stepper';

const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState<number>(1.0);

  useEffect(() => {
    void loadVolume().then(setVolume);
  }, []);

  const handleVolumeChange = async (newValue: number) => {
    setVolume(newValue);
    await saveVolume(newValue);
  };

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
});

export { VolumeControl };
