import { router } from 'expo-router';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeOptionCard } from '@/components/HomeOptionCard';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Image
            source={require('@/assets/brand/logo-mark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
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
  logoBadge: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: 6,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
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
