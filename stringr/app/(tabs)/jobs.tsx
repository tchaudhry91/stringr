import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';

export default function StringJobsScreen() {
  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>String Jobs</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={SharedStyles.tabSubtitle}>Recent string jobs and history</Text>
      <EditScreenInfo path="app/(tabs)/jobs.tsx" />
    </View>
  );
}

// All styles now use SharedStyles - no local styles needed
const styles = StyleSheet.create({});
