import notifee, { AndroidImportance } from "@notifee/react-native";

// Запуск постоянного переднепланового уведомления
export const startForegroundService = async (): Promise<void> => {
  try {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: "notification_reader_channel",
      name: "Фоновое озвучивание",
      importance: AndroidImportance.LOW,
    });

    await notifee.displayNotification({
      id: "foreground_service",
      title: "Озвучивание уведомлений активно",
      body: "Приложение отслеживает входящие сообщения",
      android: {
        channelId,
        asForegroundService: true,
        ongoing: true,
        pressAction: { id: "default" },
      },
    });
  } catch (error) {
    console.error("Ошибка запуска Foreground Service:", error);
  }
};

// Остановка переднепланового сервиса и удаление уведомления
export const stopForegroundService = async (): Promise<void> => {
  try {
    // 1. Снимаем статус Foreground Service для уведомления
    await notifee.stopForegroundService();

    // 2. Полностью удаляем уведомление из шторки
    await notifee.cancelNotification("foreground_service");
  } catch (error) {
    console.error("Ошибка при остановке Foreground Service:", error);
  }
};
