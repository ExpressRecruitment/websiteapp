import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radii, spacing } from '@/constants/theme';
import type { PickedFile } from '@/lib/api/formidable';

interface FilePickerProps {
  label: string;
  value: PickedFile | null;
  onChange: (file: PickedFile | null) => void;
  error?: string;
  required?: boolean;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/** CV/attachment picker backed by expo-document-picker (PDF/Word only). */
export function FilePicker({ label, value, onChange, error, required }: FilePickerProps) {
  async function handlePick() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ACCEPTED_TYPES,
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    onChange({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={handlePick}
        style={[styles.picker, !!error && styles.pickerError]}
      >
        <Ionicons
          name={value ? 'document-attach' : 'cloud-upload-outline'}
          size={20}
          color={colors.primary}
        />
        <Text style={styles.pickerText} numberOfLines={1}>
          {value ? value.name : 'Upload PDF or Word document'}
        </Text>
        {value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remove file"
            hitSlop={8}
            onPress={() => onChange(null)}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  required: { color: colors.red },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  pickerError: { borderColor: colors.danger },
  pickerText: { flex: 1, fontFamily: fonts.regular, fontSize: fontSizes.md, color: colors.text },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
