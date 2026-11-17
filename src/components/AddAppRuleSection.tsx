import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { CollapsibleSection } from '@/components/CollapsibleSection';
import type { DiscoveredApp } from '@/services/DiscoveredChannelsService';

type AddAppRuleSectionProps = {
  availableApps: DiscoveredApp[];
  onAddApp: (app: string) => Promise<void>;
  onClearDiscovered: () => void;
  onRefreshDiscovered: () => Promise<void>;
};

const AddAppRuleSection: React.FC<AddAppRuleSectionProps> = ({
  availableApps,
  onAddApp,
  onClearDiscovered,
  onRefreshDiscovered,
}) => {
  const [newAppInput, setNewAppInput] = useState<string>('');

  const handleManualAdd = async () => {
    const value = newAppInput.trim();

    if (!value) {
      return;
    }

    await onAddApp(value);
    setNewAppInput('');
  };

  return (
    <CollapsibleSection style={styles.section} title='Добавить приложение'>
      <View style={styles.subHeaderRow}>
        <Text style={styles.subTitle}>Доступные приложения:</Text>
        <TouchableOpacity
          onPress={() => void onRefreshDiscovered()}
          style={styles.refreshBtn}
        >
          <Text style={styles.refreshBtnText}>Обновить</Text>
        </TouchableOpacity>
      </View>

      {availableApps.length > 0 && (
        <View style={styles.chipsContainer}>
          {availableApps.map(({ app }) => (
            <TouchableOpacity
              key={app}
              onPress={() => void onAddApp(app)}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{app}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View
        style={[
          styles.inputRow,
          availableApps.length === 0 && styles.inputRowCompact,
        ]}
      >
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={setNewAppInput}
          placeholder='Введите название приложения ...'
          style={styles.input}
          value={newAppInput}
        />
        <TouchableOpacity
          onPress={() => void handleManualAdd()}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          onClearDiscovered();
        }}
        style={styles.clearAllBtn}
      >
        <Text style={styles.clearAllBtnText}>Удалить все</Text>
      </TouchableOpacity>
    </CollapsibleSection>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipText: { color: '#374151', fontSize: 13 },
  clearAllBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginTop: 12,
    padding: 8,
  },
  clearAllBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inputRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  inputRowCompact: { marginTop: 8 },
  refreshBtn: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  refreshBtnText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  section: { marginBottom: 16 },
  subHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subTitle: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
});

export { AddAppRuleSection };
