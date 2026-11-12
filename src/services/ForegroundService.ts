import notifee, { AndroidImportance } from '@notifee/react-native';

import { logError } from './LoggerService';

// Запуск постоянного переднепланового уведомления
const startForegroundService = async (): Promise<void> => {
  try {
    const channelId = await notifee.createChannel({
      id: 'notification_reader_channel',
      importance: AndroidImportance.LOW,
      name: 'Фоновое озвучивание',
    });

    await notifee.displayNotification({
      android: {
        asForegroundService: true,
        channelId,
        ongoing: true,
        pressAction: { id: 'default' },
      },
      body: 'Приложение отслеживает входящие сообщения',
      id: 'foreground_service',
      title: 'Озвучивание уведомлений активно',
    });
  } catch (error) {
    await logError('startForegroundService', error);
  }
};

// Остановка переднепланового сервиса и удаление уведомления
const stopForegroundService = async (): Promise<void> => {
  try {
    // 1. Снимаем статус Foreground Service для уведомления
    await notifee.stopForegroundService();

    // 2. Полностью удаляем уведомление из шторки
    await notifee.cancelNotification('foreground_service');
  } catch (error) {
    await logError('stopForegroundService', error);
  }
};

const isForegroundServiceRunning = async (): Promise<boolean> => {
  const notifications = await notifee.getDisplayedNotifications();

  return notifications.some(
    (notification) => notification.id === 'foreground_service',
  );
};

export {
  isForegroundServiceRunning,
  startForegroundService,
  stopForegroundService,
};
