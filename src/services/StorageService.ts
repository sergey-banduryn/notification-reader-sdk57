import AsyncStorage from "@react-native-async-storage/async-storage";

const VOLUME_KEY = "@tts_volume_level";

export const saveVolume = async (value: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(VOLUME_KEY, value.toString());
  } catch (error) {
    console.error("Ошибка сохранения громкости:", error);
  }
};

export const loadVolume = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(VOLUME_KEY);
    return value !== null ? parseFloat(value) : 1.0;
  } catch (error) {
    console.error("Ошибка загрузки громкости:", error);
    return 1.0;
  }
};
