import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radii, shadow, spacing } from '@/constants/theme';

interface HomeOptionCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accent?: 'teal' | 'red';
}

export function HomeOptionCard({
  title,
  description,
  icon,
  onPress,
  accent = 'teal',
}: HomeOptionCardProps) {
  const accentColor = accent === 'red' ? colors.red : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: accentColor }]}>
        <Ionicons name={icon} size={28} color={colors.white} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  pressed: { opacity: 0.85 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textWrap: { flex: 1 },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.lg,
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
});
