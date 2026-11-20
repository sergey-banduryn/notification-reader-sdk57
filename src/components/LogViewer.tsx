import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LogNotificationsControl } from '@/components/LogNotificationsControl';
import {
  clearAllLogs,
  getErrorLogs,
  getNotificationLogs,
} from '@/services/LoggerService';

type TabType = 'errors' | 'notifications';

const fetchLogs = (tab: TabType): Promise<string> =>
  tab === 'notifications' ? getNotificationLogs() : getErrorLogs();

const LogViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notifications');
  const [logText, setLogText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    void fetchLogs(activeTab).then((content) => {
      setLogText(content);
      setLoading(false);
    });
  }, [activeTab]);

  const handleTabPress = (tab: TabType) => {
    if (tab === activeTab) {
      return;
    }

    setLoading(true);
    setActiveTab(tab);
  };

  const handleRefresh = async () => {
    setLoading(true);
    const content = await fetchLogs(activeTab);
    setLogText(content);
    setLoading(false);
  };

  const handleClear = async () => {
    setLoading(true);
    await clearAllLogs();
    await handleRefresh();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Логи</Text>
      <LogNotificationsControl />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => {
            handleTabPress('notifications');
          }}
          style={[
            styles.tab,
            activeTab === 'notifications' && styles.activeTab,
          ]}
        >
          <Text style={styles.tabText}>Уведомления</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleTabPress('errors');
          }}
          style={[styles.tab, activeTab === 'errors' && styles.activeTab]}
        >
          <Text style={styles.tabText}>Ошибки</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => {
            void handleRefresh();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Обновить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            void handleClear();
          }}
          style={[styles.button, { backgroundColor: '#FF3B30' }]}
        >
          <Text style={styles.buttonText}>Очистить логи</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          color='#007AFF'
          size='large'
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView style={styles.logBox}>
          <Text selectable style={styles.logText}>
            {logText}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#34C759',
    borderRadius: 6,
    flex: 0.48,
    padding: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  logBox: {
    backgroundColor: '#1E1E1E',
    borderRadius: 6,
    padding: 10,
  },
  logText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    flex: 0.48,
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export { LogViewer };
