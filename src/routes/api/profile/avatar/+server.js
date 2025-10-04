/**
 * Avatar API - POST and DELETE
 * 
 * POST: Upload avatar image
 * DELETE: Delete avatar image
 */

import { json } from '@sveltejs/kit';
import { uploadAvatar, deleteAvatar } from '$lib/services/profile.js';

/**
 * POST /api/profile/avatar
 * Upload avatar image
 */
export async function POST({ request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar');

    if (!file) {
      return json({ error: 'No file provided' }, { status: 400 });
    }

    const profile = await uploadAvatar(session.user.id, file);

    return json({ profile });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/profile/avatar
 * Delete avatar image
 */
export async function DELETE({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteAvatar(session.user.id);

    return json({ success: true });
  } catch (error) {
    console.error('Avatar delete error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}