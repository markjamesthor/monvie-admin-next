/**
 * Design Abandonment Checker Worker
 *
 * Schedule: Every 5 minutes
 *
 * Logic:
 * 1. Query design_sessions where status='in_progress' AND last_activity_at < NOW() - 60min
 * 2. For sessions with photo_count > 0, set status to 'abandoned', record abandoned_at
 * 3. Register recovery email schedule for logged-in users
 *
 * Dependencies: Prisma client, recovery email service
 */

export interface AbandonmentConfig {
  designAbandonedAfterMinutes: number;     // default: 60
  cartAbandonedAfterMinutes: number;       // default: 30
  requirePhotos: boolean;                   // default: true
  requireLoggedIn: boolean;                 // default: true
}

export const DEFAULT_CONFIG: AbandonmentConfig = {
  designAbandonedAfterMinutes: 60,
  cartAbandonedAfterMinutes: 30,
  requirePhotos: true,
  requireLoggedIn: true,
};

export async function checkDesignAbandonment(_config: AbandonmentConfig = DEFAULT_CONFIG): Promise<{ processed: number; abandoned: number }> {
  // TODO: Implement with Prisma
  // 1. Find sessions: status='in_progress', last_activity_at < now - config.designAbandonedAfterMinutes
  // 2. Filter: photo_count > 0 (if requirePhotos)
  // 3. Update status to 'abandoned', set abandoned_at
  // 4. Create recovery_campaign entries
  console.log('[AbandonmentChecker] Design abandonment check - not yet implemented');
  return { processed: 0, abandoned: 0 };
}

export async function checkCartAbandonment(_config: AbandonmentConfig = DEFAULT_CONFIG): Promise<{ processed: number; abandoned: number }> {
  // TODO: Implement with Prisma
  // 1. Find cart_items: status='active', added_at < now - config.cartAbandonedAfterMinutes
  // 2. Check customer hasn't started checkout
  // 3. Update status to 'abandoned', set abandoned_at
  // 4. Create recovery_campaign entries
  console.log('[AbandonmentChecker] Cart abandonment check - not yet implemented');
  return { processed: 0, abandoned: 0 };
}
