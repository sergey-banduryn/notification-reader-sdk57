import { Dirs, FileSystem } from "react-native-file-access";

const NOTIFICATION_LOG_PATH = `${Dirs.DocumentDir}/notifications.log`;
const ERROR_LOG_PATH = `${Dirs.DocumentDir}/errors.log`;

// Форматирование даты для лога
const getTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleString("ru-RU", { hour12: false });
};

// Запись логирования в файл (с объединением с существующим содержимым)
const appendToFile = async (filePath: string, text: string): Promise<void> => {
  try {
    const line = `[${getTimestamp()}] ${text}\n`;
    await FileSystem.appendFile(filePath, line, "utf8");
  } catch (err) {
    console.error("Не удалось записать лог в файл:", err);
  }
};

// Сохранение входящих уведомлений
export const logNotification = async (data: unknown): Promise<void> => {
  const content = typeof data === "string" ? data : JSON.stringify(data);
  await appendToFile(NOTIFICATION_LOG_PATH, `УВЕДОМЛЕНИЕ: ${content}`);
};

// Сохранение ошибок
export const logError = async (
  context: string,
  error: unknown,
): Promise<void> => {
  const errorMessage =
    error instanceof Error ? error.stack || error.message : String(error);
  await appendToFile(ERROR_LOG_PATH, `ОШИБКА [${context}]: ${errorMessage}`);
};

// Чтение логов уведомлений
export const getNotificationLogs = async (): Promise<string> => {
  try {
    const exists = await FileSystem.exists(NOTIFICATION_LOG_PATH);
    if (!exists) return "Логи уведомлений отсутствуют.";
    return await FileSystem.readFile(NOTIFICATION_LOG_PATH, "utf8");
  } catch {
    return "Ошибка при чтении файла логов уведомлений.";
  }
};

// Чтение логов ошибок
export const getErrorLogs = async (): Promise<string> => {
  try {
    const exists = await FileSystem.exists(ERROR_LOG_PATH);
    if (!exists) return "Логи ошибок отсутствуют.";
    return await FileSystem.readFile(ERROR_LOG_PATH, "utf8");
  } catch {
    return "Ошибка при чтении файла логов ошибок.";
  }
};

// Очистка логов
export const clearAllLogs = async (): Promise<void> => {
  try {
    if (await FileSystem.exists(NOTIFICATION_LOG_PATH)) {
      await FileSystem.unlink(NOTIFICATION_LOG_PATH);
    }
    if (await FileSystem.exists(ERROR_LOG_PATH)) {
      await FileSystem.unlink(ERROR_LOG_PATH);
    }
  } catch (error) {
    await logError("clearAllLogs", error);
  }
};
