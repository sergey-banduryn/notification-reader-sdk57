import * as Speech from "expo-speech";
import { setAudioModeAsync } from "expo-audio";
import { loadVolume } from "@/services/StorageService";
import { logNotification, logError } from "@/services/LoggerService";
import Constants from "expo-constants";

const APP_PACKAGE_NAME = Constants.expoConfig?.android?.package;

interface NotificationData {
  app?: string;
  title?: string;
  text?: string;
  icon?: string;
  iconLarge?: string;
  groupedMessages?: {
    text?: string;
    title?: string;
  }[];
}

interface NotificationEvent {
  notification?: string;
}

export const processNotification = async ({
  notification,
}: NotificationEvent): Promise<void> => {
  if (!notification) return;

  const { icon, iconLarge, ...loggedNotification } = JSON.parse(
    notification,
  ) as NotificationData;

  logNotification(loggedNotification);

  const volume = await loadVolume();

  try {
    const data = loggedNotification;

    if (
      (data.app === "com.whatsapp" ||
        data.app === "com.android.shell" ||
        data.app === APP_PACKAGE_NAME) &&
      data.title?.includes("Цехи")
    ) {
      const title: string = data.title ? `${data.title}. ` : "";
      const text: string = data.text || "";
      const textToSpeak: string = `${text}`.trim();

      if (textToSpeak) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
          interruptionMode: "duckOthers",
        });

        Speech.stop();
        Speech.speak(textToSpeak, {
          language: "uk-UA",
          voice: "uk-ua-x-hfd-local",
          volume,
        });
      }
    }
  } catch (error) {
    await logError("processNotification", error);

    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      interruptionMode: "duckOthers",
    });

    Speech.stop();
    Speech.speak("Ошибка при обработке фонового уведомления", {
      language: "ru-RU",
      voice: "ru-ru-x-ruf-local",
      volume,
    });
  }
};
