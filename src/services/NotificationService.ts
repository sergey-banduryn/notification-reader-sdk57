import Constants from 'expo-constants';

import { logError, logNotification } from '@/services/LoggerService';
import { speechQueueService } from '@/services/SpeechQueueService';

const APP_PACKAGE_NAME = Constants.expoConfig?.android?.package;

type NotificationData = {
  app?: string;
  groupedMessages?: {
    text?: string;
    title?: string;
  }[];
  icon?: string;
  iconLarge?: string;
  text?: string;
  title?: string;
};

type NotificationEvent = {
  notification?: string;
};

const processNotification = async ({
  notification,
}: NotificationEvent): Promise<void> => {
  if (!notification) {
    return;
  }

  const { icon, iconLarge, ...loggedNotification } = JSON.parse(
    notification,
  ) as NotificationData;

  void logNotification(loggedNotification);

  try {
    const data = loggedNotification;

    if (
      (data.app === 'com.whatsapp' ||
        data.app === 'com.android.shell' ||
        data.app === APP_PACKAGE_NAME) &&
      data.title?.includes('Цехи')
    ) {
      const text: string = data.text ?? '';
      let textToSpeak: string = text.trim();

      const { groupedMessages } = data;

      if (groupedMessages && groupedMessages.length !== 0) {
        const lastMessage = groupedMessages[groupedMessages.length - 1];
        textToSpeak = lastMessage.text ?? '';
      }

      textToSpeak = textToSpeak.replace('Імпульс Диспетчер', '');

      if (textToSpeak) {
        speechQueueService.enqueue(textToSpeak);
      }
    }
  } catch (error) {
    await logError('processNotification', error);
  }
};

export { processNotification };
