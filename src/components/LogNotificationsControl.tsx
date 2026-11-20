import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import {
  loadLogNotifications,
  saveLogNotifications,
} from '@/services/StorageService';

const LogNotificationsControl: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = (value: boolean) => {
    setIsEnabled(value);
    void saveLogNotifications(value);
  };

  useEffect(() => {
    let isMounted = true;

    void loadLogNotifications().then((enabled) => {
      if (isMounted) {
        setIsEnabled(enabled);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Логировать уведомления:</Text>
      <Switch
        onValueChange={toggleSwitch}
        style={styles.switch}
        thumbColor={isEnabled ? '#FFFFFF' : '#F4F3F4'}
        trackColor={{ false: '#767577', true: '#4BA3E3' }}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  switch: { transform: [{ scale: 1.5 }] },
});

export { LogNotificationsControl };
