import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ForegroundServiceControl } from '@/components/ForegroundServiceControl';
import { Permissions } from '@/components/Permissions';
import { VolumeControl } from '@/components/VolumeControl';
import { useAppManager } from '@/hooks/useAppManager';

function HomeScreen() {
  const { permissions } = useAppManager();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView>
        <Permissions {...{ permissions }} />
        <Text style={styles.title}>Настройки</Text>
        <View style={styles.settingsContainer}>
          <ForegroundServiceControl {...{ permissions }} />
          <VolumeControl />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingsContainer: {
    gap: 10,
  },
  title: {
    color: '#1A1A1A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
