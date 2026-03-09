import { useState } from 'react';

export function useGoogleSheets() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (apiKey, sheetId) => {
    if (!apiKey.trim() || !sheetId.trim()) {
      setError('Enter API Key and Spreadsheet ID.');
      return false;
    }
    setError(''); setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId.trim()}/values/Sheet1!A1:Z1000?key=${apiKey.trim()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) { setError(`API Error: ${data.error.message}`); setLoading(false); return false; }

      const rows = data.values || [];
      if (rows.length < 2) { setError('No data found in Sheet1.'); setLoading(false); return false; }

      const headers = rows[0].map(h => h.trim().toLowerCase());
      const fi = (keywords) => headers.findIndex(h => keywords.some(k => h.includes(k)));

      const ni = fi(['full name', 'name']);
      const ii = fi(['employee id', 'emp id', 'id']);
      const pi = fi(['photo']);
      const gi = fi(['guardian']);
      const ai = fi(['address']);
      const ci = fi(['contact', 'phone', 'mobile', 'number']);

      if (ni === -1 || ii === -1) {
        setError('Headers must include "Full Name" and "Employee ID".');
        setLoading(false); return false;
      }

      const parsed = rows.slice(1).map(r => ({
        name:     r[ni]  || '—',
        id:       r[ii]  || '—',
        photo:    pi >= 0 ? r[pi]  || '' : '',
        guardian: gi >= 0 ? r[gi]  || '' : '',
        address:  ai >= 0 ? r[ai]  || '' : '',
        contact:  ci >= 0 ? r[ci]  || '' : '',
      })).filter(e => e.name !== '—');

      setEmployees(parsed);
      setLoading(false);
      return true;
    } catch (e) {
      setError('Network error. Check credentials and sheet sharing.');
      setLoading(false); return false;
    }
  };

  return { employees, loading, error, fetchData };
}
