import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FilePicker } from '@/components/FilePicker';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { ApiError, submitFormidableForm, type PickedFile } from '@/lib/api/formidable';
import { APPLICATIONS_EMAIL, FORMIDABLE_FORMS } from '@/lib/config';
import { fetchJobById } from '@/lib/api/wordpress';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ApplyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = Number(id);

  const [jobTitle, setJobTitle] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [cv, setCv] = useState<PickedFile | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchJobById(jobId)
      .then((job) => {
        if (!cancelled && job) setJobTitle(job.title);
      })
      .catch(() => {
        // Non-fatal: the job title is passed along for context only.
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = 'Enter your full name.';
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!phone.trim()) nextErrors.phone = 'Enter a phone number.';
    if (!cv) nextErrors.cv = 'Attach your CV as a PDF or Word document.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const form = FORMIDABLE_FORMS.jobApplication;
      await submitFormidableForm({
        formId: form.formId,
        fields: {
          [form.fields.jobTitle]: jobTitle || `Job #${jobId}`,
          [form.fields.fullName]: fullName.trim(),
          [form.fields.email]: email.trim(),
          [form.fields.phone]: phone.trim(),
          [form.fields.message]: message.trim(),
        },
        file: cv,
        fileFieldKey: form.fields.cv,
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
          <Text style={styles.successTitle}>Application sent</Text>
          <Text style={styles.successMessage}>
            Thanks {fullName.trim().split(' ')[0] || ''}, your application for{' '}
            {jobTitle || 'this role'} has been received. A consultant will be in touch soon.
          </Text>
          <Button label="Back to vacancies" onPress={() => router.replace('/jobs')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      {jobTitle ? <Text style={styles.applyingFor}>Applying for {jobTitle}</Text> : null}

      <TextField label="Full name" value={fullName} onChangeText={setFullName} required error={errors.fullName} />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        required
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <TextField
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        required
        keyboardType="phone-pad"
        error={errors.phone}
      />
      <TextField
        label="Message (optional)"
        value={message}
        onChangeText={setMessage}
        multiline
        placeholder="Anything you'd like us to know"
      />
      <FilePicker label="CV" value={cv} onChange={setCv} required error={errors.cv} />

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <Button label="Submit application" onPress={handleSubmit} loading={submitting} />

      <Text style={styles.disclaimer}>
        Your application, including your CV, is sent to our recruitment team at {APPLICATIONS_EMAIL}.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  applyingFor: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  submitError: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  disclaimer: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
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
