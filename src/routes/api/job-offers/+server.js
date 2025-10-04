/**
 * Job Offers API Routes
 * 
 * GET /api/job-offers - List job offers with filters
 * POST /api/job-offers - Create new job offer
 */

import { json } from '@sveltejs/kit';
import {
  getJobOffers,
  getJobOffersForTestTaker,
  getJobOffersFromEmployer,
  createJobOffer
} from '$lib/services/jobOffer.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const view = url.searchParams.get('view'); // 'received' or 'sent'

    // If view is specified, get offers for specific user
    if (view === 'received') {
      const filters = {
        status: url.searchParams.get('status'),
        limit: parseInt(url.searchParams.get('limit') || '50')
      };

      // Remove null/undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined || filters[key] === 'null') {
          delete filters[key];
        }
      });

      const offers = await getJobOffersForTestTaker(userId, filters);
      return json({ offers });
    }

    if (view === 'sent') {
      const filters = {
        status: url.searchParams.get('status'),
        limit: parseInt(url.searchParams.get('limit') || '50')
      };

      // Remove null/undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined || filters[key] === 'null') {
          delete filters[key];
        }
      });

      const offers = await getJobOffersFromEmployer(userId, filters);
      return json({ offers });
    }

    // Otherwise, get all offers with filters (admin view)
    const filters = {
      status: url.searchParams.get('status'),
      employment_type: url.searchParams.get('employment_type'),
      limit: parseInt(url.searchParams.get('limit') || '50')
    };

    // Remove null/undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === 'null') {
        delete filters[key];
      }
    });

    const offers = await getJobOffers(filters);
    return json({ offers });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offerData = await request.json();
    
    // Set employer_id from session
    offerData.employer_id = session.user.id;

    const offer = await createJobOffer(offerData);
    
    return json({ offer }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}