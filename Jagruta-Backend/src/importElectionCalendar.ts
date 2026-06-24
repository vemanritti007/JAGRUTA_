import fs from 'fs';
import path from 'path';
import { prisma } from './db/prisma';

type CsvRow = Record<string, string>;

const FILE_NAME = 'election-calendar.csv';

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    return row;
  });
}

async function main() {
  const filePath = path.join(__dirname, '..', 'data', FILE_NAME);

  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCsv(content);

  await prisma.electionCalendar.deleteMany();

  const data = rows.map((row) => ({
    title: row['title'] || 'Election Event',
    type: row['type'] || 'general',
    constituencyName: row['constituencyName'] || 'Bengaluru',
    votingDate: new Date(row['votingDate']),
    description: row['description'] || '',
    source: row['source'] || '',
  }));

  if (data.length > 0) {
    await prisma.electionCalendar.createMany({
      data,
    });
  }

  console.log(`Imported election calendar events: ${data.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });