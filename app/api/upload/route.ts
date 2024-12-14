import { NextRequest, NextResponse } from 'next/server';
import { DOMParser } from 'xmldom';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('xmlFile') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const text = await file.text();
    const parser = new DOMParser({
      locator: {},
      errorHandler: { warning: () => {}, error: () => {}, fatalError: () => {} }, // Suppress errors
    });

    const xmlDoc = parser.parseFromString(text, 'application/xml');

    if (!xmlDoc || !xmlDoc.documentElement) {
      throw new Error('Invalid XML structure');
    }

    const result = xmlDoc.documentElement.textContent || 'No content found';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error parsing XML:', error);
    return NextResponse.json({ error: 'Failed to parse XML' }, { status: 500 });
  }
}