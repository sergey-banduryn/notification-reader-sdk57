import * as Speech from "expo-speech";
import { setAudioModeAsync } from "expo-audio";
import { loadVolume } from "@/services/StorageService";
import { logNotification, logError } from "@/services/LoggerService";

interface NotificationData {
  app?: string;
  title?: string;
  text?: string;
}

interface NotificationEvent {
  notification?: string;
}

export const processNotification = async ({
  notification,
}: NotificationEvent): Promise<void> => {
  if (!notification) return;

  await logNotification(notification);

  const volume = await loadVolume();

  try {
    const data: NotificationData = JSON.parse(notification);

    if (
      (data.app === "com.whatsapp" || data.app === "com.android.shell") &&
      data.title?.includes("Цехи Підприємства: Імпульс Диспетчер")
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
