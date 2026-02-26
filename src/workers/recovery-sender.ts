/**
 * Recovery Email Sender Worker
 *
 * Schedule: Every 1 minute
 *
 * Logic:
 * 1. Query recovery_campaigns where email_sent_at IS NULL and scheduled
 * 2. Send email via Resend/SES
 * 3. Record sent result
 *
 * Dependencies: Prisma client, email service (Resend/AWS SES)
 */

export interface RecoveryEmailConfig {
  designRecoveryDelayMinutes: number;    // default: 120 (2 hours after abandonment)
  cartRecoveryDelayMinutes: number;      // default: 60 (1 hour after abandonment)
  secondCartEmailDelayHours: number;     // default: 24
  maxAttempts: number;                   // default: 3
}

export const DEFAULT_RECOVERY_CONFIG: RecoveryEmailConfig = {
  designRecoveryDelayMinutes: 120,
  cartRecoveryDelayMinutes: 60,
  secondCartEmailDelayHours: 24,
  maxAttempts: 3,
};

export async function sendPendingRecoveryEmails(_config: RecoveryEmailConfig = DEFAULT_RECOVERY_CONFIG): Promise<{ sent: number; failed: number }> {
  // TODO: Implement with Prisma + email service
  console.log('[RecoverySender] Recovery email check - not yet implemented');
  return { sent: 0, failed: 0 };
}
