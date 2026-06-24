import fs from 'fs';
import path from 'path';
import { prisma } from './db/prisma';

type CsvRow = {
  year: string;
  type: string;
  state: string;
  constituencyNo?: string;
  constituencyName: string;
  district?: string;
  turnout?: string;
  turnoutTrend?: string;
  candidateName: string;
  candidateNameKn?: string;
  party: string;
  votes: string;
  votePercentage: string;
  status: string;
  criminalCases?: string;
  seriousCriminalCases?: string;
  assets?: string;
  liabilities?: string;
  education?: string;
  age?: string;
  profession?: string;
  affidavitUrl?: string;
  sourceUrl?: string;
};

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split(/\r?\n/);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());

  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return row as CsvRow;
  });
}

function toNumber(value: string | undefined, fallback = 0) {
  if (!value) return fallback;

  const cleaned = String(value)
    .replace(/,/g, '')
    .replace(/%/g, '')
    .trim();

  const number = Number(cleaned);
  return Number.isNaN(number) ? fallback : number;
}

function toNullableNumber(value: string | undefined) {
  if (!value || value.trim() === '') return null;

  const number = toNumber(value, NaN);
  return Number.isNaN(number) ? null : number;
}

function normalizeStatus(status: string) {
  const value = status.trim().toUpperCase();

  if (value === 'WINNER') return 'WINNER';
  if (value === 'RUNNER-UP') return 'RUNNER-UP';
  if (value === 'RUNNER_UP') return 'RUNNER-UP';

  return 'LOST';
}

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'election-results.csv');

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const rows = parseCsv(fs.readFileSync(filePath, 'utf-8'));

  if (rows.length === 0) {
    throw new Error('CSV has no data rows.');
  }

  const electionSource = await prisma.dataSource.upsert({
    where: {
      id: 'source-eci-opencity-karnataka-2023',
    },
    update: {
      name: 'ECI / OpenCity Karnataka Assembly Election 2023 Results',
      sourceType: 'Election Results',
      sourceUrl: 'ECI Form-20 / OpenCity Karnataka Assembly Elections 2023',
      description: 'Candidate-wise vote and vote-share data for Karnataka Assembly Election 2023.',
      lastVerifiedAt: new Date(),
    },
    create: {
      id: 'source-eci-opencity-karnataka-2023',
      name: 'ECI / OpenCity Karnataka Assembly Election 2023 Results',
      sourceType: 'Election Results',
      sourceUrl: 'ECI Form-20 / OpenCity Karnataka Assembly Elections 2023',
      description: 'Candidate-wise vote and vote-share data for Karnataka Assembly Election 2023.',
      lastVerifiedAt: new Date(),
    },
  });

  const affidavitSource = await prisma.dataSource.upsert({
    where: {
      id: 'source-myneta-adr-karnataka-2023',
    },
    update: {
      name: 'MyNeta / ADR Karnataka 2023 Candidate Affidavits',
      sourceType: 'Candidate Affidavit',
      sourceUrl: 'MyNeta Karnataka 2023 candidate pages',
      description: 'Declared criminal cases, assets, liabilities, education and candidate background details.',
      lastVerifiedAt: new Date(),
    },
    create: {
      id: 'source-myneta-adr-karnataka-2023',
      name: 'MyNeta / ADR Karnataka 2023 Candidate Affidavits',
      sourceType: 'Candidate Affidavit',
      sourceUrl: 'MyNeta Karnataka 2023 candidate pages',
      description: 'Declared criminal cases, assets, liabilities, education and candidate background details.',
      lastVerifiedAt: new Date(),
    },
  });

  const grouped = new Map<string, CsvRow[]>();

  for (const row of rows) {
    const key = `${row.year}-${row.type}-${row.constituencyName}`;
    grouped.set(key, [...(grouped.get(key) || []), row]);
  }

  for (const [key, groupRows] of grouped.entries()) {
    const first = groupRows[0];

    const election = await prisma.election.upsert({
      where: {
        year_type_constituencyName: {
          year: toNumber(first.year),
          type: first.type,
          constituencyName: first.constituencyName,
        },
      },
      update: {
        state: first.state || 'Karnataka',
        constituencyNo: toNullableNumber(first.constituencyNo || ''),
        district: first.district || null,
        turnout: toNullableNumber(first.turnout),
        turnoutTrend: toNullableNumber(first.turnoutTrend),
        sourceUrl: first.sourceUrl || null,
        dataSourceId: electionSource.id,
      },
      create: {
        year: toNumber(first.year),
        type: first.type,
        state: first.state || 'Karnataka',
        constituencyNo: toNullableNumber(first.constituencyNo || ''),
        constituencyName: first.constituencyName,
        district: first.district || null,
        turnout: toNullableNumber(first.turnout),
        turnoutTrend: toNullableNumber(first.turnoutTrend),
        sourceUrl: first.sourceUrl || null,
        dataSourceId: electionSource.id,
      },
    });

    await prisma.candidateResult.deleteMany({
      where: {
        electionId: election.id,
      },
    });

    const sortedRows = [...groupRows].sort(
      (a, b) => toNumber(b.votes) - toNumber(a.votes)
    );

    await prisma.candidateResult.createMany({
      data: sortedRows.map((row, index) => ({
        electionId: election.id,

        candidateName: row.candidateName,
        candidateNameKn: row.candidateNameKn || null,
        party: row.party,

        votes: toNumber(row.votes),
        votePercentage: toNumber(row.votePercentage),
        status: row.status
          ? normalizeStatus(row.status)
          : index === 0
            ? 'WINNER'
            : index === 1
              ? 'RUNNER-UP'
              : 'LOST',

        criminalCases: toNumber(row.criminalCases),
        seriousCriminalCases: toNumber(row.seriousCriminalCases),

        assets: row.assets || null,
        liabilities: row.liabilities || null,
        education: row.education || null,
        age: toNullableNumber(row.age || ''),
        profession: row.profession || null,

        affidavitUrl: row.affidavitUrl || null,
        sourceUrl: row.sourceUrl || null,
        dataSourceId: affidavitSource.id,
      })),
    });

    console.log(`Imported ${key} with ${sortedRows.length} candidates`);
  }

  console.log('Election results import completed.');
  console.log(`Election rows imported: ${grouped.size}`);
  console.log(`Candidate rows imported: ${rows.length}`);
}

main()
  .catch((error) => {
    console.error('Election import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });