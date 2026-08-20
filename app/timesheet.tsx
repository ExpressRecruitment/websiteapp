import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, fonts, fontSizes, radii, spacing } from '@/constants/theme';
import { TIMESHEET_PORTAL_URL } from '@/lib/config';

/**
 * The timesheet portal (expressrecruitment.timesheetportal.com) is a
 * third-party system and isn't embeddable as a native screen, so this
 * opens it in an in-app browser (falls back to the system browser).
 */
export default function TimesheetScreen() {
  const [opening, setOpening] = useState(false);

  async function openPortal() {
    setOpening(true);
    try {
      await WebBrowser.openBrowserAsync(TIMESHEET_PORTAL_URL);
    } catch {
      // In-app browser unavailable for some reason - fall back to the
      // device's default browser app.
      await Linking.openURL(TIMESHEET_PORTAL_URL).catch(() => undefined);
    } finally {
      setOpening(false);
    }
  }

  return (
    <Screen>
      <View style={styles.iconWrap}>
        <Ionicons name="time-outline" size={40} color={colors.white} />
      </View>

      <Text style={styles.title}>Timesheet portal</Text>
      <Text style={styles.body}>
        Timesheets are submitted through our secure external portal. Tap below to open it - you'll
        be able to sign in and submit your hours as usual.
      </Text>

      <Button label="Open timesheet portal" onPress={openPortal} loading={opening} />

      <Text style={styles.url}>{TIMESHEET_PORTAL_URL.replace(/^https?:\/\//, '')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xl,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  url: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
