import { google } from 'googleapis';
import path from 'path';

// Load credentials from environment variables or config file
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'config', 'google-sheets-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getSheetData(range: string = 'Sheet1!A:E') {
  try {
    // Spreadsheet ID from your URL
    const spreadsheetId = '1kJ8wK5jauvIHCyAW_TtWWY-vvhXhfXtaSQxYewLJPOU';
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    return response.data.values;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}
