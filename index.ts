import "expo-router/entry";
import { AppRegistry, Platform } from "react-native";
import * as Speech from "expo-speech";
import { setAudioModeAsync } from "expo-audio";

// Выполняем регистрацию Headless Task только на платформе Android
if (Platform.OS === "android") {
  const {
    RNAndroidNotificationListenerHeadlessJsName,
  } = require("react-native-android-notification-listener");

  interface NotificationData {
    app?: string;
    title?: string;
    text?: string;
  }

  interface HeadlessNotificationEvent {
    notification?: string;
  }

  const headlessNotificationListener = async ({
    notification,
  }: HeadlessNotificationEvent): Promise<void> => {
    if (!notification) return;

    try {
      const data: NotificationData = JSON.parse(notification);

      // console.log("Уведомление:", {
      //   app: data.app,
      //   title: data.title,
      //   text: data.text,
      // });

      if (
        (data.app === "com.whatsapp" || data.app === "com.android.shell") &&
        data.title?.includes("Цехи Підприємства: Імпульс Диспетчер")
      ) {
        // const title: string = data.title ? `${data.title}. ` : "";
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
          });
        }
      }
    } catch (error) {
      // console.error("Ошибка при обработке фонового уведомления:", error);

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        interruptionMode: "duckOthers",
      });

      Speech.stop();
      Speech.speak("Ошибка при обработке фонового уведомления", {
        language: "ru-RU",
        voice: "ru-ru-x-ruf-local",
      });
    }
  };

  AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName,
    () => headlessNotificationListener,
  );
}
