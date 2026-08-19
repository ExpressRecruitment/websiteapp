import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { ApiError, submitFormidableForm } from '@/lib/api/formidable';
import { FORMIDABLE_FORMS } from '@/lib/config';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mirrors the fields on the temporary-recruitment page's enquiry form.
 * TODO: reconcile this field set against the live page once accessible -
 * confirm labels, which fields are required, and whether any extra
 * fields (e.g. shift pattern, industry) need to be added.
 */
export default function HireScreen() {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('');
  const [staffRequired, setStaffRequired] = useState('');
  const [startDate, setStartDate] = useState('');
  const [details, setDetails] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!companyName.trim()) nextErrors.companyName = 'Enter your company name.';
    if (!contactName.trim()) nextErrors.contactName = 'Enter a contact name.';
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!phone.trim()) nextErrors.phone = 'Enter a phone number.';
    if (!details.trim()) nextErrors.details = 'Tell us a little about your staffing needs.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const form = FORMIDABLE_FORMS.hireEnquiry;
      await submitFormidableForm({
        formId: form.formId,
        fields: {
          [form.fields.companyName]: companyName.trim(),
          [form.fields.contactName]: contactName.trim(),
          [form.fields.email]: email.trim(),
          [form.fields.phone]: phone.trim(),
          [form.fields.division]: division.trim(),
          [form.fields.staffRequired]: staffRequired.trim(),
          [form.fields.startDate]: startDate.trim(),
          [form.fields.details]: details.trim(),
        },
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Screen>
        <View style={styles.successWrap}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.successTitle}>Enquiry sent</Text>
          <Text style={styles.successMessage}>
            Thanks {contactName.trim().split(' ')[0] || ''}, we've received your enquiry and a
            member of our team will be in touch shortly.
          </Text>
          <Button label="Back to home" onPress={() => router.replace('/')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text style={styles.intro}>
        Tell us about your staffing requirements and a consultant will get back to you.
      </Text>

      <TextField label="Company name" value={companyName} onChangeText={setCompanyName} required error={errors.companyName} />
      <TextField label="Contact name" value={contactName} onChangeText={setContactName} required error={errors.contactName} />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        required
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <TextField label="Phone" value={phone} onChangeText={setPhone} required keyboardType="phone-pad" error={errors.phone} />
      <TextField
        label="Division / type of role"
        value={division}
        onChangeText={setDivision}
        placeholder="e.g. Industrial, Commercial, Driving"
      />
      <TextField
        label="Number of staff required"
        value={staffRequired}
        onChangeText={setStaffRequired}
        keyboardType="number-pad"
      />
      <TextField label="When are staff needed?" value={startDate} onChangeText={setStartDate} placeholder="e.g. ASAP, or a date" />
      <TextField
        label="Tell us about your requirements"
        value={details}
        onChangeText={setDetails}
        multiline
        required
        error={errors.details}
      />

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <Button label="Send enquiry" onPress={handleSubmit} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  submitError: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  successTitle: { fontFamily: fonts.bold, fontSize: fontSizes.xl, color: colors.text },
  successMessage: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
