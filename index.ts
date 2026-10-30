import "expo-router/entry";
import { AppRegistry, Platform } from "react-native";
import * as Speech from "expo-speech";

// Выполняем регистрацию Headless Task только на платформе Android
if (Platform.OS === "android") {
  const {
    RNAndroidNotificationListenerHeadlessJsName,
  } = require("react-native-android-notification-listener");

  interface TelegramNotificationData {
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
      const data: TelegramNotificationData = JSON.parse(notification);

      if (data.app === "org.telegram.messenger") {
        const title: string = data.title ? `${data.title}. ` : "";
        const text: string = data.text || "";
        const textToSpeak: string = `${title}${text}`.trim();

        if (textToSpeak) {
          Speech.stop();
          Speech.speak(textToSpeak, { language: "uk-UA" });
        }
      }
    } catch (error) {
      console.error("Ошибка при обработке фонового уведомления:", error);
    }
  };

  AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName,
    () => headlessNotificationListener,
  );
}
