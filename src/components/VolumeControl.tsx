import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Stepper } from "./Stepper";
import { loadVolume, saveVolume } from "@/services/StorageService";

export const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState<number>(1.0);

  useEffect(() => {
    loadVolume().then(setVolume);
  }, []);

  const handleVolumeChange = async (newValue: number) => {
    setVolume(newValue);
    await saveVolume(newValue);
  };

  return (
    <View>
      <Stepper
        label="Громкость"
        value={volume}
        min={0.0}
        max={1.0}
        step={0.1}
        onChange={handleVolumeChange}
        formatValue={(val) => `${Math.round(val * 100)}%`}
      />
    </View>
  );
};
