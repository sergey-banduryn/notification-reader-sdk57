import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LogViewer } from '@/components/LogViewer';

function LogsScreen(): React.JSX.Element {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <LogViewer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default LogsScreen;
