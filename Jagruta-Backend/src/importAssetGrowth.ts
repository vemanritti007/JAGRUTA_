import fs from 'fs';
import path from 'path';
import { prisma } from './db/prisma';

type CsvRow = Record<string, string>;

const FILE_NAME = 'asset-growth.csv';

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

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/,/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatIndianMoney(value: number) {
  if (!value || Number.isNaN(value)) {
    return 'Not available';
  }

  const crore = value / 10000000;

  if (crore >= 1) {
    return `₹${crore.toFixed(2)} Cr`;
  }

  const lakh = value / 100000;

  return `₹${lakh.toFixed(2)} Lakh`;
}

async function main() {
  const filePath = path.join(__dirname, '..', 'data', FILE_NAME);

  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCsv(content);

  const grouped: Record<string, any[]> = {};

  for (const row of rows) {
    const politicianName = row['politicianName'] || '';
    const constituency = row['constituency'] || '';

    if (!politicianName) continue;

    const key = `${normalize(politicianName)}__${normalize(constituency)}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push({
      politicianName,
      constituency,
      year: Number(row['year'] || 0),
      assets: Number(row['assets'] || 0),
      liabilities: Number(row['liabilities'] || 0),
      source: row['source'] || 'Demo asset-growth.csv',
      note: row['note'] || 'Demo generated data',
    });
  }

  let updated = 0;
  let unmatched = 0;

  for (const records of Object.values(grouped)) {
    records.sort((a, b) => a.year - b.year);

    const first = records[0];
    const politicianName = first.politicianName;
    const constituency = first.constituency;

    const politician = await prisma.politician.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: politicianName,
              mode: 'insensitive',
            },
          },
          {
            AND: [
              {
                name: {
                  contains: politicianName.split(' ')[0],
                  mode: 'insensitive',
                },
              },
              {
                constituencyRef: {
                  name: {
                    contains: constituency,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        constituencyRef: true,
      },
    });

    if (!politician) {
      unmatched++;
      console.log(`Unmatched politician: ${politicianName} - ${constituency}`);
      continue;
    }

    const latest = records[records.length - 1];

    const assetHistory = records.map((record) => ({
      year: record.year,
      assets: record.assets,
      liabilities: record.liabilities,
      netWorth: record.assets - record.liabilities,
      source: record.source,
      note: record.note,
    }));

    await prisma.politician.update({
      where: {
        id: politician.id,
      },
      data: {
        assetHistory,
        assets: formatIndianMoney(latest.assets),
        liabilities: formatIndianMoney(latest.liabilities),
      },
    });

    updated++;
  }

  console.log(`Asset growth import completed.`);
  console.log(`Updated politicians: ${updated}`);
  console.log(`Unmatched politicians: ${unmatched}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });