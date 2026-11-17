import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { AddAppRuleSection } from '@/components/AddAppRuleSection';
import { SpeechRuleCard } from '@/components/SpeechRuleCard';
import {
  type DiscoveredApp,
  discoveredChannelsService,
} from '@/services/DiscoveredChannelsService';
import {
  type SpeechRulesMap,
  speechRulesService,
} from '@/services/SpeechRulesService';

const SpeechRulesManager: React.FC = () => {
  const [rules, setRules] = useState<SpeechRulesMap>({});
  const [discovered, setDiscovered] = useState<DiscoveredApp[]>([]);

  const loadData = useCallback(() => {
    return Promise.all([
      speechRulesService.getRules(),
      discoveredChannelsService.getDiscoveredApps(),
    ]).then(([savedRules, indexedApps]) => {
      setRules(savedRules);
      setDiscovered(indexedApps);
    });
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const updateRules = async (nextRules: SpeechRulesMap) => {
    setRules(nextRules);
    await speechRulesService.saveRules(nextRules);
  };

  const handleAddAppToRules = async (app: string) => {
    const cleanApp = app.trim();

    if (!cleanApp || rules[cleanApp]) {
      return;
    }

    setRules((prev) => ({
      ...prev,
      [cleanApp]: {
        channels: [],
        enabled: true,
        speakAll: false,
      },
    }));
    await speechRulesService.addAppRule(cleanApp);
  };

  const handleRemoveAppFromRules = (app: string) => {
    Alert.alert('', 'Удалить приложение?', [
      { style: 'cancel', text: 'Отмена' },
      {
        onPress: () => {
          setRules((prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(([key]) => key !== app),
            ),
          );
          void speechRulesService.removeAppRule(app);
        },
        style: 'destructive',
        text: 'Удалить',
      },
    ]);
  };

  const toggleApp = (app: string, enabled: boolean) => {
    const current = rules[app] ?? {
      channels: [],
      enabled: false,
      speakAll: false,
    };
    void updateRules({
      ...rules,
      [app]: { ...current, enabled },
    });
  };

  const toggleSpeakAll = (app: string, speakAll: boolean) => {
    const current = rules[app] ?? {
      channels: [],
      enabled: true,
      speakAll: false,
    };
    void updateRules({
      ...rules,
      [app]: { ...current, speakAll },
    });
  };

  const handleAddChannelToRule = async (app: string, channel: string) => {
    const cleanChannel = channel.trim();

    if (!cleanChannel) {
      return;
    }

    const current = rules[app] ?? {
      channels: [],
      enabled: true,
      speakAll: false,
    };

    if (!current.channels.includes(cleanChannel)) {
      setRules((prev) => ({
        ...prev,
        [app]: { ...current, channels: [...current.channels, cleanChannel] },
      }));
      await speechRulesService.addChannelToRule(app, cleanChannel);
    }
  };

  const handleRemoveChannelFromRule = async (app: string, channel: string) => {
    const current = rules[app];

    if (!current) {
      return;
    }

    setRules((prev) => ({
      ...prev,
      [app]: {
        ...current,
        channels: current.channels.filter((c) => c !== channel),
      },
    }));
    await speechRulesService.removeChannelFromRule(app, channel);
  };

  const handleRefreshDiscovered = async () => {
    const freshApps = await discoveredChannelsService.getDiscoveredApps(true);
    setDiscovered(freshApps);
  };

  const handleClearDiscovered = () => {
    Alert.alert('', 'Удалить все доступные приложения и каналы?', [
      { style: 'cancel', text: 'Отмена' },
      {
        onPress: () => {
          setDiscovered([]);
          void discoveredChannelsService.clearDiscoveredIndex();
        },
        style: 'destructive',
        text: 'Удалить',
      },
    ]);
  };

  const configuredAppIds = Object.keys(rules);
  const availableDiscoveredApps = discovered.filter(
    (item) => !configuredAppIds.includes(item.app),
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Приложения</Text>

      <AddAppRuleSection
        availableApps={availableDiscoveredApps}
        onAddApp={handleAddAppToRules}
        onClearDiscovered={handleClearDiscovered}
        onRefreshDiscovered={handleRefreshDiscovered}
      />

      {configuredAppIds.length === 0 && (
        <Text style={styles.emptyText}>
          Нет выбранных приложений. Раскройте блок выше, чтобы выбрать из
          обнаруженных или добавить пакет вручную.
        </Text>
      )}

      {configuredAppIds.map((app) => {
        const rule = rules[app];

        if (!rule) {
          return null;
        }

        const discoveredTitles =
          discovered.find((d) => d.app === app)?.titles ?? [];
        const availableChannels = discoveredTitles.filter(
          (title) => !rule.channels.includes(title),
        );

        return (
          <SpeechRuleCard
            app={app}
            availableChannels={availableChannels}
            key={app}
            onAddChannel={handleAddChannelToRule}
            onRefreshDiscovered={handleRefreshDiscovered}
            onRemoveApp={handleRemoveAppFromRules}
            onRemoveChannel={handleRemoveChannelFromRule}
            onToggleApp={toggleApp}
            onToggleSpeakAll={toggleSpeakAll}
            rule={rule}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyText: { color: '#6B7280', marginTop: 24, textAlign: 'center' },
  title: {
    color: '#1A1A1A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export { SpeechRulesManager };
