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
};

const AddAppRuleSection: React.FC<AddAppRuleSectionProps> = ({
  availableApps,
  onAddApp,
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
      {availableApps.length > 0 && (
        <>
          <Text style={styles.subTitle}>Доступные приложения:</Text>
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
        </>
      )}

      <View
        style={[
          styles.inputRow,
          availableApps.length === 0 && styles.inputRowNoMargin,
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
  inputRowNoMargin: { marginTop: 0 },
  section: { marginBottom: 16 },
  subTitle: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export { AddAppRuleSection };
