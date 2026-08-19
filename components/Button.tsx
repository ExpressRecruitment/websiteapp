import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, fonts, fontSizes, radii, spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.label, textVariantStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  fullWidth: { alignSelf: 'stretch' },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.md,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.tealDark },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  danger: { backgroundColor: colors.danger },
};

const textVariantStyles: Record<Variant, { color: string }> = {
  primary: { color: colors.white },
  secondary: { color: colors.white },
  outline: { color: colors.primary },
  danger: { color: colors.white },
};
