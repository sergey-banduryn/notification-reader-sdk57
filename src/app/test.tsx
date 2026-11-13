import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageTester } from '@/components/LanguageTester';

function TestScreen(): React.JSX.Element {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Text style={styles.title}>Тест</Text>
      <LanguageTester />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#1A1A1A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TestScreen;
