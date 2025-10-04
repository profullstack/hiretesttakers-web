/**
 * Notification Preferences API
 * 
 * GET: Get user's notification preferences
 * PUT: Update user's notification preferences
 */

import { json } from '@sveltejs/kit';
import { getPreferences, updatePreferences } from '$lib/services/notification.js';

/**
 * GET /api/notifications/preferences
 * Get user's notification preferences
 * Query params: type (string) - optional filter by notification type
 */
export async function GET({ locals, url }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filters = {};
    const type = url.searchParams.get('type');
    if (type) {
      filters.type = type;
    }

    const preferences = await getPreferences(session.user.id, filters);

    return json({ preferences });
  } catch (error) {
    console.error('Preferences GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/notifications/preferences
 * Update user's notification preferences
 * Body: { type: string, in_app_enabled?: boolean, email_enabled?: boolean, push_enabled?: boolean }
 */
export async function PUT({ locals, request }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, in_app_enabled, email_enabled, push_enabled } = body;

    if (!type) {
      return json({ error: 'Notification type is required' }, { status: 400 });
    }

    const preferences = {};
    if (in_app_enabled !== undefined) preferences.in_app_enabled = in_app_enabled;
    if (email_enabled !== undefined) preferences.email_enabled = email_enabled;
    if (push_enabled !== undefined) preferences.push_enabled = push_enabled;

    const updated = await updatePreferences(session.user.id, type, preferences);

    return json({ preferences: updated });
  } catch (error) {
    console.error('Preferences PUT error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}