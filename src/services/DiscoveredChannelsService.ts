import { Dirs, FileSystem } from 'react-native-file-access';

const INDEX_PATH = `${Dirs.DocumentDir}/discovered_channels.json`;

type DiscoveredApp = {
  app: string;
  titles: string[];
};

// Хранилище уникальных чатов по пакету приложения: { "com.whatsapp": ["Цехи", "Семья"] }
type DiscoveredIndexMap = Partial<Record<string, string[]>>;

class DiscoveredChannelsService {
  private indexCache: DiscoveredIndexMap | null = null;

  public async getDiscoveredApps(): Promise<DiscoveredApp[]> {
    const index = await this.getDiscoveredIndex();

    return Object.entries(index)
      .map(([app, titles = []]) => ({
        app,
        titles,
      }))
      .sort((a, b) => a.app.localeCompare(b.app));
  }

  public async getDiscoveredIndex(): Promise<DiscoveredIndexMap> {
    if (this.indexCache) {
      return this.indexCache;
    }

    try {
      if (!(await FileSystem.exists(INDEX_PATH))) {
        this.indexCache = {};

        return this.indexCache;
      }

      const raw = await FileSystem.readFile(INDEX_PATH, 'utf8');
      this.indexCache = JSON.parse(raw) as DiscoveredIndexMap;

      return this.indexCache;
    } catch {
      this.indexCache = {};

      return this.indexCache;
    }
  }

  // Автоматическая регистрация новой пары { app, title } при получении уведомления
  public async registerNotificationSource(
    app?: string,
    title?: string,
  ): Promise<void> {
    if (!app) {
      return;
    }

    const index = await this.getDiscoveredIndex();
    const cleanTitle = title ? title.split(':')[0].trim() : '';

    let hasChanges = false;
    const updatedIndex: DiscoveredIndexMap = { ...index };

    if (!updatedIndex[app]) {
      updatedIndex[app] = [];
      hasChanges = true;
    }

    if (cleanTitle && !updatedIndex[app].includes(cleanTitle)) {
      updatedIndex[app] = [...updatedIndex[app], cleanTitle].sort();
      hasChanges = true;
    }

    if (hasChanges) {
      await this.saveDiscoveredIndex(updatedIndex);
    }
  }

  private async saveDiscoveredIndex(index: DiscoveredIndexMap): Promise<void> {
    this.indexCache = index;
    await FileSystem.writeFile(
      INDEX_PATH,
      JSON.stringify(index, null, 2),
      'utf8',
    );
  }
}

const discoveredChannelsService = new DiscoveredChannelsService();

export {
  type DiscoveredApp,
  discoveredChannelsService,
  type DiscoveredIndexMap,
};
