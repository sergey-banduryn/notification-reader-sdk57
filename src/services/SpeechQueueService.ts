import { setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import { VolumeManager } from 'react-native-volume-manager';

import { getSpeechConfigByText } from '@/services/LanguageService';
import { logError } from '@/services/LoggerService';
import {
  loadInitialSystemVolume,
  loadMuted,
  loadVolume,
  saveInitialSystemVolume,
} from '@/services/StorageService';

class SpeechQueueService {
  private isSpeaking = false;
  private lastMessageBySource = new Map<string, string>();
  private queue: string[] = [];

  public enqueue(text: string, sourceKey = 'default'): void {
    const cleanText = text.trim();
    const normalizedText = cleanText.toLowerCase();

    if (!normalizedText) {
      return;
    }

    if (this.lastMessageBySource.get(sourceKey) === normalizedText) {
      return;
    }

    this.lastMessageBySource.set(sourceKey, normalizedText);
    this.queue.push(cleanText);

    if (!this.isSpeaking) {
      this.isSpeaking = true;
      void this.startQueue();
    }
  }

  private async playNext(): Promise<void> {
    const nextText = this.queue.shift();

    if (!nextText) {
      this.isSpeaking = false;
      await this.restoreSystemVolume();

      return;
    }

    try {
      const speechConfig = await getSpeechConfigByText(nextText);

      const handleFinish = (): void => {
        void this.playNext();
      };

      Speech.speak(nextText, {
        language: speechConfig.language,
        onDone: handleFinish,
        onError: (error) => {
          void logError('SpeechQueueService.Speech', error);
          handleFinish();
        },
        onStopped: handleFinish,
        voice: speechConfig.voice,
        volume: 1.0,
      });
    } catch (error) {
      await logError('SpeechQueueService.playNext', error);
      void this.playNext();
    }
  }

  private async prepareAudioSession(): Promise<void> {
    const [targetVolume, savedInitialVolume] = await Promise.all([
      loadVolume(),
      loadInitialSystemVolume(),
    ]);

    if (savedInitialVolume === null) {
      const { volume: currentSystemVolume } = await VolumeManager.getVolume();
      await saveInitialSystemVolume(currentSystemVolume);
    }

    await VolumeManager.setVolume(targetVolume, { showUI: false });

    await setAudioModeAsync({
      allowsRecording: false,
      interruptionMode: 'duckOthers',
      playsInSilentMode: true,
    });
  }

  private async restoreSystemVolume(): Promise<void> {
    const initialVolume = await loadInitialSystemVolume();

    if (initialVolume !== null) {
      await VolumeManager.setVolume(initialVolume, { showUI: false });
      await saveInitialSystemVolume(null);
    }
  }

  private async startQueue(): Promise<void> {
    const isMuted = await loadMuted();

    if (isMuted) {
      this.queue = [];
      this.isSpeaking = false;

      return;
    }

    await this.restoreSystemVolume();

    try {
      await this.prepareAudioSession();
    } catch (error) {
      await logError('SpeechQueueService.prepareAudioSession', error);
    }

    await this.playNext();
  }
}

const speechQueueService = new SpeechQueueService();

export { speechQueueService };
