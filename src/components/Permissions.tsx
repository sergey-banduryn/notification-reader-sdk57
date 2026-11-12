import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  openBatteryOptimizationSettings,
  openNotifeeSettings,
  openNotificationListenerSettings,
} from '@/helpers/settings';

type PermissionsProps = {
  checkPermissions: () => Promise<void>;
  isBatteryOptEnabled: boolean;
  isListenerGranted: boolean;
  isNotifeeGranted: boolean;
};

const Permissions: React.FC<{ permissions: PermissionsProps }> = ({
  permissions,
}) => {
  const {
    checkPermissions,
    isBatteryOptEnabled,
    isListenerGranted,
    isNotifeeGranted,
  } = permissions;

  return (
    <View>
      <Text style={styles.title}>Разрешения</Text>
      <View style={styles.permissionCards}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            Доступ к чтению всех уведомлений
          </Text>
          <Text style={styles.statusText}>
            Статус:{' '}
            <Text
              style={isListenerGranted ? styles.grantedText : styles.deniedText}
            >
              {isListenerGranted ? 'Разрешено' : 'Запрещено'}
            </Text>
          </Text>
          <TouchableOpacity
            onPress={openNotificationListenerSettings}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Настройки</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            Отображать закрепленное уведомление
          </Text>
          <Text style={styles.statusText}>
            Статус:{' '}
            <Text
              style={isNotifeeGranted ? styles.grantedText : styles.deniedText}
            >
              {isNotifeeGranted ? 'Разрешено' : 'Запрещено'}
            </Text>
          </Text>
          <TouchableOpacity onPress={openNotifeeSettings} style={styles.button}>
            <Text style={styles.buttonText}>Настройки</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            Выключить оптимизацию батареи
          </Text>
          <Text style={styles.statusText}>
            Статус:{' '}
            <Text
              style={
                !isBatteryOptEnabled ? styles.grantedText : styles.deniedText
              }
            >
              {!isBatteryOptEnabled ? 'Выключено' : 'Включено'}
            </Text>
          </Text>
          <TouchableOpacity
            onPress={openBatteryOptimizationSettings}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => void checkPermissions()}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>Проверить разрешения</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deniedText: {
    color: '#DC3545',
    fontWeight: 'bold',
  },
  grantedText: {
    color: '#28A745',
    fontWeight: 'bold',
  },
  permissionCard: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    gap: 10,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  permissionCards: {
    gap: 10,
  },
  permissionTitle: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  statusText: {
    color: '#495057',
    fontSize: 14,
  },
  title: {
    color: '#1A1A1A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export { Permissions };
