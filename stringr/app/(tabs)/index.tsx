import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';

export default function RacquetsScreen() {
  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>My Racquets</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={SharedStyles.tabSubtitle}>Track your tennis racquets and their string jobs</Text>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

// All styles now use SharedStyles - no local styles needed
const styles = StyleSheet.create({});
