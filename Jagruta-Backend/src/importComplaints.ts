import fs from 'fs';
import path from 'path';
import { prisma } from './db/prisma';

type CsvRow = Record<string, string>;

const FILE_NAME = 'bbmp-civic-complaints-normalized-2023-2025.csv';

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
    .replace(/\bward\b/g, '')
    .replace(/\./g, '')
    .replace(/,/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(value: string) {
  return normalize(value).replace(/\s+/g, '');
}

async function seedProblemCategories() {
  const categories = [
    {
      key: 'streetlight',
      label: 'Streetlight Issue',
      responsibleDepartment: 'Electrical Department',
      suggestedOfficerRole: 'Assistant Engineer / Assistant Executive Engineer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'garbage',
      label: 'Garbage / Solid Waste Issue',
      responsibleDepartment: 'Solid Waste Management / Health Department',
      suggestedOfficerRole: 'Junior Health Inspector / Senior Health Inspector',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'road',
      label: 'Road / Footpath Issue',
      responsibleDepartment: 'Engineering Department',
      suggestedOfficerRole: 'Assistant Engineer / Assistant Executive Engineer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'drainage',
      label: 'Drainage / Storm Water Drain Issue',
      responsibleDepartment: 'Storm Water Drain / Engineering Department',
      suggestedOfficerRole: 'Assistant Engineer / Assistant Executive Engineer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'water',
      label: 'Water Supply / Leakage Issue',
      responsibleDepartment: 'Water Supply / Civic Engineering Department',
      suggestedOfficerRole: 'Assistant Engineer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'animal',
      label: 'Animal / Stray Dog Issue',
      responsibleDepartment: 'Animal Husbandry Department',
      suggestedOfficerRole: 'Animal Husbandry Officer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'tree',
      label: 'Tree / Forest Issue',
      responsibleDepartment: 'Forest Department',
      suggestedOfficerRole: 'Assistant Engineer / Ward Officer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'health',
      label: 'Public Health Issue',
      responsibleDepartment: 'Health Department',
      suggestedOfficerRole: 'Junior Health Inspector / Senior Health Inspector',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'park',
      label: 'Park / Playground Issue',
      responsibleDepartment: 'Parks and Playgrounds Department',
      suggestedOfficerRole: 'Assistant Engineer / Ward Officer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'building',
      label: 'Building / Town Planning Issue',
      responsibleDepartment: 'Town Planning Department',
      suggestedOfficerRole: 'Assistant Revenue Officer / Revenue Officer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'encroachment',
      label: 'Encroachment Issue',
      responsibleDepartment: 'Revenue / Engineering Department',
      suggestedOfficerRole: 'Revenue Officer / Assistant Engineer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'revenue',
      label: 'Revenue / Khata / Property Tax Issue',
      responsibleDepartment: 'Revenue Department',
      suggestedOfficerRole: 'Revenue Officer / Assistant Revenue Officer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'lake',
      label: 'Lake Issue',
      responsibleDepartment: 'Lakes Department',
      suggestedOfficerRole: 'Ward Officer / Assistant Engineer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'advertisement',
      label: 'Advertisement / Flex / Banner Issue',
      responsibleDepartment: 'Advertisement Department',
      suggestedOfficerRole: 'Revenue Officer / Ward Officer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'market',
      label: 'Market Issue',
      responsibleDepartment: 'Markets Department',
      suggestedOfficerRole: 'Revenue Officer / Ward Officer',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'education',
      label: 'Education Issue',
      responsibleDepartment: 'Education Department',
      suggestedOfficerRole: 'Ward Office',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'canteen',
      label: 'Indira Canteen Issue',
      responsibleDepartment: 'Indira Canteen / Welfare Department',
      suggestedOfficerRole: 'Ward Office',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'it',
      label: 'IT / Call Center Issue',
      responsibleDepartment: 'Information Technology / Call Center',
      suggestedOfficerRole: 'Ward Office',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'traffic',
      label: 'Traffic Engineering Issue',
      responsibleDepartment: 'Traffic Engineering Cell',
      suggestedOfficerRole: 'Traffic Engineer Cell',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'welfare',
      label: 'Welfare Scheme Issue',
      responsibleDepartment: 'Welfare Department',
      suggestedOfficerRole: 'Ward Office',
      emergencyLevel: 'NORMAL',
    },
    {
      key: 'other',
      label: 'Other Civic Issue',
      responsibleDepartment: 'Ward Office / BBMP Department',
      suggestedOfficerRole: 'Ward Office',
      emergencyLevel: 'NORMAL',
    },
  ];

  for (const category of categories) {
    await prisma.problemCategory.upsert({
      where: {
        key: category.key,
      },
      update: category,
      create: category,
    });
  }
}

function findWardByName(wardName: string, wards: any[]) {
  const inputCompact = compact(wardName);

  if (!inputCompact) {
    return null;
  }

  const exact = wards.find((ward) => compact(ward.wardName) === inputCompact);
  if (exact) return exact;

  const startsWith = wards.find((ward) => {
    const dbWard = compact(ward.wardName);
    return dbWard.startsWith(inputCompact) || inputCompact.startsWith(dbWard);
  });

  if (startsWith) return startsWith;

  const includesMatch = wards.find((ward) => {
    const dbWard = compact(ward.wardName);
    return dbWard.length >= 5 && inputCompact.includes(dbWard);
  });

  if (includesMatch) return includesMatch;

  return null;
}

async function main() {
  const filePath = path.join(__dirname, '..', 'data', FILE_NAME);

  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    console.log(`Put this file inside data folder: ${FILE_NAME}`);
    return;
  }

  await seedProblemCategories();

  console.log('Deleting old CivicComplaint rows...');
  await prisma.civicComplaint.deleteMany();

  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCsv(content);
  const wards = await prisma.ward.findMany();

  let imported = 0;
  let skipped = 0;
  let unmatchedWard = 0;

  const categoryCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  const batch: {
    wardId: string;
    category: string;
    status: string;
    description: string;
  }[] = [];

  for (const row of rows) {
    const complaintId = row['complaintId'] || '';
    const year = row['year'] || '';
    const grievanceDate = row['grievanceDate'] || '';
    const wardName = row['wardName'] || '';
    const originalCategory = row['originalCategory'] || '';
    const originalSubCategory = row['originalSubCategory'] || '';
    const mappedCategory = row['mappedCategory'] || 'other';
    const originalStatus = row['originalStatus'] || '';
    const mappedStatus = row['mappedStatus'] || '';
    const staffRemarks = row['staffRemarks'] || '';
    const staffName = row['staffName'] || '';

    if (!['FULFILLED', 'PENDING', 'IGNORED', 'UNRESOLVED', 'REJECTED'].includes(mappedStatus)) {
      skipped++;
      continue;
    }

    const ward = findWardByName(wardName, wards);

    if (!ward) {
      unmatchedWard++;
      continue;
    }

    categoryCounts[mappedCategory] = (categoryCounts[mappedCategory] || 0) + 1;
    statusCounts[mappedStatus] = (statusCounts[mappedStatus] || 0) + 1;

    batch.push({
      wardId: ward.id,
      category: mappedCategory,
      status: mappedStatus,
      description: `${originalCategory} - ${originalSubCategory}. Complaint ID: ${complaintId}. Year: ${year}. Date: ${grievanceDate}. Original Status: ${originalStatus}. Staff: ${staffName}. Remarks: ${staffRemarks}`,
    });

    if (batch.length >= 1000) {
      await prisma.civicComplaint.createMany({
        data: batch,
      });

      imported += batch.length;
      console.log(`Imported ${imported} complaints...`);
      batch.length = 0;
    }
  }

  if (batch.length > 0) {
    await prisma.civicComplaint.createMany({
      data: batch,
    });

    imported += batch.length;
  }

  const total = await prisma.civicComplaint.count();

  console.log('Complaint import completed.');
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Unmatched wards: ${unmatchedWard}`);
  console.log(`Total CivicComplaint rows: ${total}`);
  console.log('Category counts:', categoryCounts);
  console.log('Status counts:', statusCounts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });