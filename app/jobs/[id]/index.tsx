import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StateView';
import { colors, fonts, fontSizes, radii, spacing } from '@/constants/theme';
import { ApiError, fetchJobById } from '@/lib/api/wordpress';
import type { Job } from '@/types/job';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = Number(id);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchJobById(jobId)
      .then((result) => {
        if (!cancelled) setJob(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load this role.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (loading) return <LoadingState label="Loading role…" />;
  if (error) return <ErrorState message={error} />;
  if (!job) return <ErrorState message="This vacancy could not be found. It may have been filled." />;

  return (
    <Screen scroll>
      <Text style={styles.title}>{job.title}</Text>

      {job.divisions.length > 0 ? (
        <View style={styles.badgeRow}>
          {job.divisions.map((division) => (
            <View key={division.id} style={styles.badge}>
              <Text style={styles.badgeLabel}>{division.name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.metaCard}>
        {job.location ? (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text style={styles.metaText}>{job.location}</Text>
          </View>
        ) : null}
        {job.salary ? (
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={18} color={colors.primary} />
            <Text style={styles.metaText}>{job.salary}</Text>
          </View>
        ) : null}
        {job.jobType ? (
          <View style={styles.metaItem}>
            <Ionicons name="briefcase-outline" size={18} color={colors.primary} />
            <Text style={styles.metaText}>{job.jobType}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.description}>{job.description}</Text>

      <Button
        label="Apply for this role"
        onPress={() => router.push(`/jobs/${job.id}/apply`)}
        style={styles.applyButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: fontSizes.xxl, color: colors.text, marginBottom: spacing.sm },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  badge: {
    backgroundColor: colors.tealLight,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeLabel: { fontFamily: fonts.medium, fontSize: fontSizes.xs, color: colors.tealDark },
  metaCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaText: { fontFamily: fonts.medium, fontSize: fontSizes.sm, color: colors.text },
  description: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  applyButton: { marginTop: spacing.sm },
});
