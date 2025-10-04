/**
 * Email Service using Mailgun
 * 
 * Sends transactional emails via Mailgun API.
 * Requires MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.
 */

/**
 * Send an email via Mailgun
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.text - Plain text content
 * @param {string} [params.html] - HTML content (optional)
 * @returns {Promise<Object>} Mailgun response
 * @throws {Error} If email sending fails
 */
export async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const fromEmail = process.env.MAILGUN_FROM_EMAIL || `noreply@${domain}`;

  if (!apiKey || !domain) {
    throw new Error('Mailgun configuration missing. Set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.');
  }

  if (!to || !subject || !text) {
    throw new Error('Missing required email parameters: to, subject, text');
  }

  const formData = new FormData();
  formData.append('from', fromEmail);
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('text', text);
  if (html) {
    formData.append('html', html);
  }

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send email');
  }

  return data;
}

/**
 * Send job offer notification email to test taker
 * @param {Object} params - Notification parameters
 * @param {string} params.testTakerEmail - Test taker's email
 * @param {string} params.testTakerName - Test taker's name
 * @param {string} params.employerName - Employer's name
 * @param {string} params.jobTitle - Job title
 * @param {string} params.offerId - Job offer ID
 * @returns {Promise<Object>} Email send result
 */
export async function sendJobOfferNotification({
  testTakerEmail,
  testTakerName,
  employerName,
  jobTitle,
  offerId
}) {
  const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:5173';
  const offerUrl = `${siteUrl}/job-offers/${offerId}`;

  const subject = `New Job Offer: ${jobTitle}`;
  
  const text = `
Hi ${testTakerName},

You have received a new job offer from ${employerName}!

Position: ${jobTitle}

View and respond to this offer here:
${offerUrl}

Best regards,
HireTestTakers Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f8f9fa; }
    .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💼 New Job Offer</h1>
    </div>
    <div class="content">
      <p>Hi ${testTakerName},</p>
      <p>You have received a new job offer from <strong>${employerName}</strong>!</p>
      <p><strong>Position:</strong> ${jobTitle}</p>
      <p>
        <a href="${offerUrl}" class="button">View Job Offer</a>
      </p>
      <p>Click the button above to view the full details and respond to this offer.</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>HireTestTakers Team</p>
      <p><a href="${siteUrl}">Visit HireTestTakers.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: testTakerEmail,
    subject,
    text,
    html
  });
}

/**
 * Send job offer status update notification to employer
 * @param {Object} params - Notification parameters
 * @param {string} params.employerEmail - Employer's email
 * @param {string} params.employerName - Employer's name
 * @param {string} params.testTakerName - Test taker's name
 * @param {string} params.jobTitle - Job title
 * @param {string} params.status - New status (accepted/rejected)
 * @returns {Promise<Object>} Email send result
 */
export async function sendOfferStatusNotification({
  employerEmail,
  employerName,
  testTakerName,
  jobTitle,
  status
}) {
  const statusText = status === 'accepted' ? 'accepted' : 'declined';
  const subject = `Job Offer ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}: ${jobTitle}`;
  
  const text = `
Hi ${employerName},

${testTakerName} has ${statusText} your job offer for the position of ${jobTitle}.

${status === 'accepted' ? 'Congratulations! You can now proceed with the next steps.' : 'Thank you for using HireTestTakers. Keep looking for the right candidate!'}

Best regards,
HireTestTakers Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${status === 'accepted' ? '#28a745' : '#dc3545'}; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f8f9fa; }
    .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${status === 'accepted' ? '✓' : '✗'} Offer ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}</h1>
    </div>
    <div class="content">
      <p>Hi ${employerName},</p>
      <p><strong>${testTakerName}</strong> has ${statusText} your job offer for the position of <strong>${jobTitle}</strong>.</p>
      ${status === 'accepted' ? '<p>Congratulations! You can now proceed with the next steps.</p>' : '<p>Thank you for using HireTestTakers. Keep looking for the right candidate!</p>'}
    </div>
    <div class="footer">
      <p>Best regards,<br>HireTestTakers Team</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: employerEmail,
    subject,
    text,
    html
  });
}