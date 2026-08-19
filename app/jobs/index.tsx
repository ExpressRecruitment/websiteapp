import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { ChipGroup } from '@/components/ChipGroup';
import { JobCard } from '@/components/JobCard';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateView';
import { colors, fonts, fontSizes, radii, spacing } from '@/constants/theme';
import { useDivisions } from '@/lib/hooks/useDivisions';
import { useJobs } from '@/lib/hooks/useJobs';

export default function JobsScreen() {
  const [search, setSearch] = useState('');
  const [selectedDivisionSlug, setSelectedDivisionSlug] = useState<string | null>(null);

  const { divisions } = useDivisions();
  const selectedDivision = useMemo(
    () => divisions.find((division) => division.slug === selectedDivisionSlug) ?? null,
    [divisions, selectedDivisionSlug]
  );

  const { jobs, loading, error, reload } = useJobs({
    search,
    divisionId: selectedDivision?.id ?? null,
  });

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search job title or keyword"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {divisions.length > 0 ? (
        <View style={styles.filterWrap}>
          <ChipGroup
            chips={divisions.map((division) => ({ key: division.slug, label: division.name }))}
            selectedKey={selectedDivisionSlug}
            onSelect={setSelectedDivisionSlug}
            allLabel="All divisions"
          />
        </View>
      ) : null}

      {loading ? (
        <LoadingState label="Loading vacancies…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No vacancies found"
          message="Try a different search term or division."
        />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(job) => String(job.id)}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => router.push(`/jobs/${item.id}`)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  filterWrap: { marginBottom: spacing.sm },
  listContent: { paddingBottom: spacing.xl },
});
