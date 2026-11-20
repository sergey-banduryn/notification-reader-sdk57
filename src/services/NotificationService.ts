import { discoveredChannelsService } from '@/services/DiscoveredChannelsService';
import { logError, logNotification } from '@/services/LoggerService';
import { speechQueueService } from '@/services/SpeechQueueService';
import { speechRulesService } from '@/services/SpeechRulesService';
import { loadProcessGroupedMessages } from '@/services/StorageService';

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

    void discoveredChannelsService.registerNotificationSource(
      data.app,
      data.title,
    );

    if (await speechRulesService.shouldSpeak(data.app, data.title)) {
      const text: string = data.text ?? '';
      let textToSpeak: string = text.trim();

      const { groupedMessages } = data;
      const shouldProcessGrouped = await loadProcessGroupedMessages();

      if (
        shouldProcessGrouped &&
        groupedMessages &&
        groupedMessages.length !== 0
      ) {
        const lastMessage = groupedMessages[groupedMessages.length - 1];
        textToSpeak = lastMessage.text ?? '';
      }

      textToSpeak = textToSpeak.replace(/^[^:]{1,50}:\s*/, '').trim();

      const app = data.app ?? 'unknown';
      const title = (data.title ?? '').split(':')[0].trim().toLowerCase();

      if (textToSpeak) {
        speechQueueService.enqueue(textToSpeak, `${app}::${title}`);
      }
    }
  } catch (error) {
    await logError('processNotification', error);
  }
};

export { processNotification };
