import { Dirs, FileSystem } from 'react-native-file-access';

const RULES_PATH = `${Dirs.DocumentDir}/speech_rules.json`;

type AppRule = {
  channels: string[];
  enabled: boolean;
  speakAll: boolean;
};

type SpeechRulesMap = Partial<Record<string, AppRule>>;

class SpeechRulesService {
  private rulesCache: null | SpeechRulesMap = null;

  public async addAppRule(app: string): Promise<SpeechRulesMap> {
    const cleanApp = app.trim();
    const rules = await this.getRules();

    if (!cleanApp || rules[cleanApp]) {
      return rules;
    }

    const updatedRules: SpeechRulesMap = {
      ...rules,
      [cleanApp]: {
        channels: [],
        enabled: true,
        speakAll: false,
      },
    };

    await this.saveRules(updatedRules);

    return updatedRules;
  }

  public async addChannelToRule(
    app: string,
    channel: string,
  ): Promise<SpeechRulesMap> {
    const cleanChannel = channel.trim();
    const rules = await this.getRules();

    if (!app || !cleanChannel) {
      return rules;
    }

    const currentRule = rules[app] ?? {
      channels: [],
      enabled: true,
      speakAll: false,
    };

    if (currentRule.channels.includes(cleanChannel)) {
      return rules;
    }

    const updatedRules: SpeechRulesMap = {
      ...rules,
      [app]: {
        ...currentRule,
        channels: [...currentRule.channels, cleanChannel],
      },
    };

    await this.saveRules(updatedRules);

    return updatedRules;
  }

  public async getRules(): Promise<SpeechRulesMap> {
    if (this.rulesCache) {
      return this.rulesCache;
    }

    try {
      if (!(await FileSystem.exists(RULES_PATH))) {
        this.rulesCache = {};

        return this.rulesCache;
      }

      const raw = await FileSystem.readFile(RULES_PATH, 'utf8');
      this.rulesCache = JSON.parse(raw) as SpeechRulesMap;

      return this.rulesCache;
    } catch {
      this.rulesCache = {};

      return this.rulesCache;
    }
  }

  public async removeAppRule(app: string): Promise<SpeechRulesMap> {
    const rules = await this.getRules();

    if (!rules[app]) {
      return rules;
    }

    const updatedRules: SpeechRulesMap = Object.fromEntries(
      Object.entries(rules).filter(([key]) => key !== app),
    );

    await this.saveRules(updatedRules);

    return updatedRules;
  }

  public async removeChannelFromRule(
    app: string,
    channel: string,
  ): Promise<SpeechRulesMap> {
    const rules = await this.getRules();
    const currentRule = rules[app];

    if (!currentRule) {
      return rules;
    }

    const updatedRules: SpeechRulesMap = {
      ...rules,
      [app]: {
        ...currentRule,
        channels: currentRule.channels.filter((c) => c !== channel),
      },
    };

    await this.saveRules(updatedRules);

    return updatedRules;
  }

  public async saveRules(rules: SpeechRulesMap): Promise<void> {
    this.rulesCache = rules;
    await FileSystem.writeFile(
      RULES_PATH,
      JSON.stringify(rules, null, 2),
      'utf8',
    );
  }

  public async shouldSpeak(app?: string, title?: string): Promise<boolean> {
    if (!app) {
      return false;
    }

    const rules = await this.getRules();
    const rule = rules[app];

    if (!rule?.enabled) {
      return false;
    }

    if (rule.speakAll) {
      return true;
    }

    if (!title) {
      return false;
    }

    const normalizedTitle = title.toLowerCase();

    return rule.channels.some((channel) =>
      normalizedTitle.includes(channel.toLowerCase()),
    );
  }
}

const speechRulesService = new SpeechRulesService();

export { type AppRule, type SpeechRulesMap, speechRulesService };
