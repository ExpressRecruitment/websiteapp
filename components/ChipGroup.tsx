import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, fonts, fontSizes, radii, spacing } from '@/constants/theme';

export interface Chip {
  key: string;
  label: string;
}

interface ChipGroupProps {
  chips: Chip[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  allLabel?: string;
}

/** Horizontally scrolling single-select filter chips, e.g. for divisions. */
export function ChipGroup({ chips, selectedKey, onSelect, allLabel = 'All' }: ChipGroupProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <ChipItem label={allLabel} selected={selectedKey === null} onPress={() => onSelect(null)} />
      {chips.map((chip) => (
        <ChipItem
          key={chip.key}
          label={chip.label}
          selected={selectedKey === chip.key}
          onPress={() => onSelect(chip.key)}
        />
      ))}
    </ScrollView>
  );
}

function ChipItem({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipLabel: { fontFamily: fonts.medium, fontSize: fontSizes.sm, color: colors.text },
  chipLabelSelected: { color: colors.white },
});
