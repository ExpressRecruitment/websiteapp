import { router } from 'expo-router';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeOptionCard } from '@/components/HomeOptionCard';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>ER</Text>
        </View>
        <Text style={styles.heroTitle}>Express Recruitment</Text>
        <Text style={styles.heroSubtitle}>Great people. Great jobs. Great teams.</Text>
      </View>

      <View style={styles.options}>
        <HomeOptionCard
          title="Looking for a job"
          description="Search live vacancies and apply with your CV"
          icon="briefcase-outline"
          accent="teal"
          onPress={() => router.push('/jobs')}
        />
        <HomeOptionCard
          title="Looking to hire"
          description="Tell us about your staffing needs"
          icon="people-outline"
          accent="red"
          onPress={() => router.push('/hire')}
        />
        <HomeOptionCard
          title="Submit a timesheet"
          description="Opens the timesheet portal"
          icon="time-outline"
          accent="teal"
          onPress={() => router.push('/timesheet')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontFamily: fonts.bold, fontSize: fontSizes.xl, color: colors.primary },
  heroTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xxl,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.tealLight,
  },
  options: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
});
