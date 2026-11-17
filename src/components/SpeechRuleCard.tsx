import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { CollapsibleSection } from '@/components/CollapsibleSection';
import type { AppRule } from '@/services/SpeechRulesService';

type SpeechRuleCardProps = {
  app: string;
  availableChannels: string[];
  onAddChannel: (app: string, channel: string) => Promise<void>;
  onRemoveApp: (app: string) => Promise<void>;
  onRemoveChannel: (app: string, channel: string) => Promise<void>;
  onToggleApp: (app: string, enabled: boolean) => void;
  onToggleSpeakAll: (app: string, speakAll: boolean) => void;
  rule: AppRule;
};

const SpeechRuleCard: React.FC<SpeechRuleCardProps> = ({
  app,
  availableChannels,
  onAddChannel,
  onRemoveApp,
  onRemoveChannel,
  onToggleApp,
  onToggleSpeakAll,
  rule,
}) => {
  const [customInput, setCustomInput] = useState<string>('');

  const handleAddCustomChannel = async () => {
    const value = customInput.trim();

    if (!value) {
      return;
    }

    await onAddChannel(app, value);
    setCustomInput('');
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text numberOfLines={1} style={styles.appName}>
          {app}
        </Text>
        <View style={styles.cardActions}>
          <Switch
            onValueChange={(val) => {
              onToggleApp(app, val);
            }}
            value={rule.enabled}
          />
          <TouchableOpacity
            onPress={() => void onRemoveApp(app)}
            style={styles.deleteAppBtn}
          >
            <Text style={styles.deleteAppText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {rule.enabled && (
        <View style={styles.subSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Озвучивать все чаты</Text>
            <Switch
              onValueChange={(val) => {
                onToggleSpeakAll(app, val);
              }}
              value={rule.speakAll}
            />
          </View>

          {!rule.speakAll && (
            <>
              <Text style={styles.subTitle}>Активные:</Text>
              {rule.channels.length === 0 ? (
                <Text style={styles.hintText}>
                  Каналы не выбраны — уведомления не озвучиваются
                </Text>
              ) : (
                <View style={styles.chipsContainer}>
                  {rule.channels.map((channel) => (
                    <TouchableOpacity
                      key={channel}
                      onPress={() => void onRemoveChannel(app, channel)}
                      style={[styles.chip, styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, styles.chipTextSelected]}>
                        {channel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <CollapsibleSection
                style={styles.channelsCollapsible}
                title='Добавить каналы'
              >
                {availableChannels.length > 0 && (
                  <>
                    <Text style={styles.subTitleNoMargin}>Доступные:</Text>
                    <View style={styles.chipsContainer}>
                      {availableChannels.map((channel) => (
                        <TouchableOpacity
                          key={channel}
                          onPress={() => void onAddChannel(app, channel)}
                          style={styles.chip}
                        >
                          <Text style={styles.chipText}>{channel}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                <View
                  style={[
                    styles.inputRow,
                    availableChannels.length === 0 && styles.inputRowNoMargin,
                  ]}
                >
                  <TextInput
                    onChangeText={setCustomInput}
                    placeholder='Введите название чата ...'
                    style={styles.input}
                    value={customInput}
                  />
                  <TouchableOpacity
                    onPress={() => void handleAddCustomChannel()}
                    style={styles.addBtn}
                  >
                    <Text style={styles.addBtnText}>Добавить</Text>
                  </TouchableOpacity>
                </View>
              </CollapsibleSection>
            </>
          )}
        </View>
      )}
    </View>
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
  appName: { flex: 1, fontSize: 15, fontWeight: '600', marginRight: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  channelsCollapsible: {
    borderRadius: 10,
    marginTop: 12,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  chipText: { color: '#374151', fontSize: 13 },
  chipTextSelected: { color: '#1E40AF', fontWeight: '600' },
  deleteAppBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteAppText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  hintText: { color: '#9CA3AF', fontSize: 12, fontStyle: 'italic' },
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
  label: { color: '#374151', fontSize: 14 },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subSection: {
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
  },
  subTitle: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  subTitleNoMargin: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 0,
  },
});

export { SpeechRuleCard };
