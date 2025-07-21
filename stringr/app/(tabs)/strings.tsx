import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function StringsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>String Database</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.subtitle}>Browse and manage string types</Text>
      <EditScreenInfo path="app/(tabs)/strings.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});