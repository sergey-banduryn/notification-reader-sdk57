import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SpeechRulesManager } from '@/components/SpeechRulesManager';

function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView>
        <SpeechRulesManager />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default HomeScreen;
