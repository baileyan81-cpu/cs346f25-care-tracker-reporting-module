// controllers/clinicalHoursController.js
require('dotenv').config();

const EDGE_FUNCTION_URL =
  'https://urnttpvujrpcizotlels.supabase.co/functions/v1/export_clinical_hours_csv';

// Use node-fetch via dynamic import (works in CommonJS)
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.exportClinicalHoursCsv = async function (req, res, next) {
  try {
    if (!req.session || !req.session.user || req.session.user.roleLevel != 2) {
      return next(
        'Failed to generate clinical hours export. Please try again.'
      );
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'GET',
      headers: {
        // If your edge function is public, you can remove this header.
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Edge function error:', response.status, text);
      return next(
        'Failed to generate clinical hours export. Please try again.'
      );
    }

    const csv = await response.text();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="clinical_hours_export.csv"'
    );

    res.send(csv);
  } catch (err) {
    console.error(
      'Error calling export_clinical_hours_csv edge function:',
      err
    );
    if (next) return next(err);
    res
      .status(500)
      .send('Internal server error while exporting clinical hours.');
  }
};
