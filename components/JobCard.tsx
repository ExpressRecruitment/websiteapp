import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radii, shadow, spacing } from '@/constants/theme';
import type { Job } from '@/types/job';

export function JobCard({ job, onPress }: { job: Job; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.title} numberOfLines={2}>
        {job.title}
      </Text>

      {job.divisions.length > 0 ? (
        <View style={styles.badgeRow}>
          {job.divisions.map((division) => (
            <View key={division.id} style={styles.badge}>
              <Text style={styles.badgeLabel}>{division.name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.metaRow}>
        {job.location ? (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.location}</Text>
          </View>
        ) : null}
        {job.salary ? (
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.salary}</Text>
          </View>
        ) : null}
      </View>

      {job.excerpt ? (
        <Text style={styles.excerpt} numberOfLines={2}>
          {job.excerpt}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  pressed: { opacity: 0.85 },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xs },
  badge: {
    backgroundColor: colors.tealLight,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeLabel: { fontFamily: fonts.medium, fontSize: fontSizes.xs, color: colors.tealDark },
  metaRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xs, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: fonts.regular, fontSize: fontSizes.xs, color: colors.textMuted },
  excerpt: { fontFamily: fonts.regular, fontSize: fontSizes.sm, color: colors.textMuted },
});
