import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

/**
 * Base screen wrapper: brand background, consistent horizontal padding,
 * and keyboard-avoidance for screens with forms.
 */
export function Screen({ children, scroll = false, style, contentContainerStyle }: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentContainerStyle]}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.flex, styles.background, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { backgroundColor: colors.background },
  content: { flex: 1, padding: 20 },
  scrollContent: { padding: 20, paddingBottom: 40, flexGrow: 1 },
});
