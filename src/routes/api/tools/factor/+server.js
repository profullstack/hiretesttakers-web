import { json } from '@sveltejs/kit';
import { factorQuadratic } from '$lib/services/tools.js';

export async function POST({ request }) {
  try {
    const { a, b, c } = await request.json();

    if (a === undefined || b === undefined || c === undefined) {
      return json({ error: 'Coefficients a, b, and c are required' }, { status: 400 });
    }

    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    if (isNaN(aNum) || isNaN(bNum) || isNaN(cNum)) {
      return json({ error: 'All coefficients must be valid numbers' }, { status: 400 });
    }

    if (aNum === 0) {
      return json({ error: 'Coefficient a cannot be zero (not a quadratic)' }, { status: 400 });
    }

    const result = factorQuadratic(aNum, bNum, cNum);

    return json({
      ...result,
      success: true
    });
  } catch (error) {
    console.error('Factor API Error:', error);
    return json({ error: error.message || 'Failed to factor expression' }, { status: 500 });
  }
}