import AsyncStorage from '@react-native-async-storage/async-storage';

import { logError } from './LoggerService';

const VOLUME_KEY = '@tts_volume_level';
const INITIAL_SYSTEM_VOLUME_KEY = '@initial_system_volume';
const MUTE_KEY = 'app_speech_muted';

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

const saveInitialSystemVolume = async (value: null | number): Promise<void> => {
  try {
    if (value === null) {
      await AsyncStorage.removeItem(INITIAL_SYSTEM_VOLUME_KEY);
    } else {
      await AsyncStorage.setItem(INITIAL_SYSTEM_VOLUME_KEY, value.toString());
    }
  } catch (error) {
    await logError('saveInitialSystemVolume', error);
  }
};

const loadInitialSystemVolume = async (): Promise<null | number> => {
  try {
    const value = await AsyncStorage.getItem(INITIAL_SYSTEM_VOLUME_KEY);

    return value !== null ? parseFloat(value) : null;
  } catch (error) {
    await logError('loadInitialSystemVolume', error);

    return null;
  }
};

const loadMuted = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(MUTE_KEY);

  return value === 'true';
};

const saveMuted = async (isMuted: boolean): Promise<void> => {
  await AsyncStorage.setItem(MUTE_KEY, String(isMuted));
};

export {
  loadInitialSystemVolume,
  loadMuted,
  loadVolume,
  saveInitialSystemVolume,
  saveMuted,
  saveVolume,
};
