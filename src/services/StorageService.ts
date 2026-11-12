import AsyncStorage from '@react-native-async-storage/async-storage';

import { logError } from './LoggerService';

const VOLUME_KEY = '@tts_volume_level';

const saveVolume = async (value: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(VOLUME_KEY, value.toString());
  } catch (error) {
    await logError('saveVolume', error);
  }
};

const loadVolume = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(VOLUME_KEY);

    return value !== null ? parseFloat(value) : 1.0;
  } catch (error) {
    await logError('loadVolume', error);

    return 1.0;
  }
};

export { loadVolume, saveVolume };
